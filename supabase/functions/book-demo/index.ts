import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CAL_API_BASE = "https://api.cal.com/v2";
const CAL_API_VERSION = "2024-09-04";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const ipLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  ipLog.set(ip, hits);
  return hits.length > RATE_LIMIT_MAX;
}


Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "rate_limit_exceeded" }), {
      status: 429,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  let body: { name?: string; email?: string; startTime?: string; timezone?: string; message?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { name, email, startTime, timezone, message, token } = body;

  if (!name || !email || !startTime || !timezone || !token) {
    return new Response(JSON.stringify({ error: "missing_fields" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Verify Turnstile
  const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!turnstileSecret) {
    return new Response(JSON.stringify({ error: "server_misconfiguration" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const verifyForm = new FormData();
  verifyForm.append("secret", turnstileSecret);
  verifyForm.append("response", token);
  verifyForm.append("remoteip", ip);

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: verifyForm,
  });
  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    return new Response(JSON.stringify({ error: "bot_check_failed" }), {
      status: 403,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const calApiKey = Deno.env.get("CAL_API_KEY");
  const calEventTypeId = Deno.env.get("CAL_EVENT_TYPE_ID");

  if (!calApiKey || !calEventTypeId) {
    return new Response(JSON.stringify({ error: "not_configured" }), {
      status: 503,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const eventTypeId = parseInt(calEventTypeId, 10);

  // Create Cal.com booking
  let calData: {
    status: string;
    data?: { uid?: string; meetingUrl?: string; start?: string; end?: string };
  };

  try {
    const calRes = await fetch(`${CAL_API_BASE}/bookings`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${calApiKey}`,
        "cal-api-version": CAL_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: startTime,
        eventTypeId,
        attendee: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          timeZone: timezone,
          language: "en",
        },
        ...(message?.trim() ? { bookingFieldsResponses: { notes: message.trim() } } : {}),
      }),
    });
    calData = await calRes.json();
  } catch (err) {
    console.error("Cal.com booking error:", err);
    return new Response(JSON.stringify({ error: "upstream_error" }), {
      status: 502,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (calData.status !== "success" || !calData.data?.uid) {
    console.error("Cal.com booking failed:", calData);
    return new Response(JSON.stringify({ error: "booking_failed" }), {
      status: 502,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { uid, meetingUrl, start } = calData.data;

  // Save to Supabase
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await supabase.from("demo_bookings").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message?.trim() || null,
    cal_booking_uid: uid,
    scheduled_at: start ?? startTime,
    timezone,
    meet_url: meetingUrl ?? null,
    status: "confirmed",
  });

  return new Response(
    JSON.stringify({ success: true, uid, meetUrl: meetingUrl, startTime: start ?? startTime }),
    { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
  );
});
