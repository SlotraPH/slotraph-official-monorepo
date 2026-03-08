import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("");
  // Cal.com sends either plain hex or "sha256=<hex>"
  return hex === signature || `sha256=${hex}` === signature;
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

  const rawBody = await req.text();

  const webhookSecret = Deno.env.get("CAL_WEBHOOK_SECRET");
  const signature = req.headers.get("X-Cal-Signature-256");
  if (webhookSecret && signature) {
    const valid = await verifySignature(webhookSecret, rawBody, signature);
    if (!valid) {
      return new Response(JSON.stringify({ error: "invalid_signature" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }
  }


  let event: { triggerEvent: string; payload: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { triggerEvent, payload } = event;

  if (!["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"].includes(triggerEvent)) {
    // Acknowledge unknown events without processing
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const uid = payload.uid as string;
  const attendees = payload.attendees as { name: string; email: string; timeZone: string }[] | undefined;
  const attendee = attendees?.[0];
  const videoCallData = payload.videoCallData as { url?: string } | undefined;
  const meetUrl = videoCallData?.url ?? (payload.location as string | undefined) ?? null;

  const statusMap: Record<string, string> = {
    BOOKING_CREATED: "confirmed",
    BOOKING_RESCHEDULED: "rescheduled",
    BOOKING_CANCELLED: "cancelled",
  };

  console.log("cal-webhook triggerEvent:", triggerEvent);
  console.log("cal-webhook payload:", JSON.stringify(payload));

  if (triggerEvent === "BOOKING_CREATED") {
    const { error } = await supabase.from("demo_bookings").upsert({
      cal_booking_uid: uid,
      name: attendee?.name ?? "",
      email: attendee?.email?.toLowerCase() ?? "",
      scheduled_at: payload.startTime as string,
      timezone: attendee?.timeZone ?? "Asia/Manila",
      meet_url: meetUrl,
      message: (payload.additionalNotes as string | undefined) ?? null,
      status: "confirmed",
    }, { onConflict: "cal_booking_uid" });
    if (error) console.error("demo_bookings insert error:", JSON.stringify(error));
  } else {
    const { error } = await supabase
      .from("demo_bookings")
      .update({
        status: statusMap[triggerEvent],
        ...(triggerEvent === "BOOKING_RESCHEDULED"
          ? { scheduled_at: payload.startTime as string, meet_url: meetUrl }
          : {}),
      })
      .eq("cal_booking_uid", uid);
    if (error) console.error("demo_bookings update error:", JSON.stringify(error));
  }

  // Notify n8n (fire-and-forget — don't block the response)
  const n8nWebhookUrl = Deno.env.get("N8N_BOOKING_WEBHOOK_URL");
  if (n8nWebhookUrl) {
    fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: triggerEvent,
        name: attendee?.name ?? "",
        email: attendee?.email?.toLowerCase() ?? "",
        scheduled_at: payload.startTime,
        timezone: attendee?.timeZone ?? null,
        meet_url: meetUrl,
        message: (payload.additionalNotes as string | undefined) ?? null,
        cal_booking_uid: uid,
        created_at: new Date().toISOString(),
      }),
    }).catch((err) => console.error("n8n webhook error:", err));
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
