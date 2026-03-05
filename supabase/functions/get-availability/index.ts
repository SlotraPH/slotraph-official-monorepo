import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const CAL_API_BASE = "https://api.cal.com/v2";
const CAL_API_VERSION = "2024-09-04";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
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

  const url = new URL(req.url);
  const year = parseInt(url.searchParams.get("year") ?? "");
  const month = parseInt(url.searchParams.get("month") ?? ""); // 1-indexed
  const timezone = url.searchParams.get("timezone") ?? "Asia/Manila";

  if (!year || !month || month < 1 || month > 12) {
    return new Response(JSON.stringify({ error: "invalid_params" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Fetch two months ahead (current + next) for better UX
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59); // last day of month

  const calUrl = new URL(`${CAL_API_BASE}/slots/available`);
  calUrl.searchParams.set("eventTypeId", calEventTypeId);
  calUrl.searchParams.set("startTime", startDate.toISOString());
  calUrl.searchParams.set("endTime", endDate.toISOString());
  calUrl.searchParams.set("timeZone", timezone);

  let calData: { status: string; data?: { slots?: Record<string, { time: string }[]> } };
  try {
    const calRes = await fetch(calUrl.toString(), {
      headers: {
        "Authorization": `Bearer ${calApiKey}`,
        "cal-api-version": CAL_API_VERSION,
      },
    });
    calData = await calRes.json();
  } catch (err) {
    console.error("Cal.com fetch error:", err);
    return new Response(JSON.stringify({ error: "upstream_error" }), {
      status: 502,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (calData.status !== "success" || !calData.data?.slots) {
    console.error("Cal.com unexpected response:", calData);
    return new Response(JSON.stringify({ error: "upstream_error" }), {
      status: 502,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Flatten to { date: slotISOString[] }
  const slots: Record<string, string[]> = {};
  for (const [date, slotArr] of Object.entries(calData.data.slots)) {
    slots[date] = slotArr.map((s) => s.time);
  }

  return new Response(JSON.stringify({ slots }), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
});
