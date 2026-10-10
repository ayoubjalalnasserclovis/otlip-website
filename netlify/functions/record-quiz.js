// Netlify Serverless Function to reliably record all quiz touches & drop-offs to Supabase

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const { session_id } = payload;

    if (!session_id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing session_id" }) };
    }

    const supabaseUrl = process.env.SUPABASE_URL || "https://pcxzyykqvenyurffepok.supabase.co";
    const supabaseKey = process.env.SUPABASE_KEY || "sb_publishable_Yd99sfuyTBruMSOr_KKSzA_8qqkOhbt";

    // Prepare Supabase payload
    const record = {
      session_id: payload.session_id,
      current_step: payload.current_step || 1,
      status: payload.status || "in_progress",
      project_type: payload.project_type || null,
      business_name: payload.business_name || null,
      activity_sector: payload.activity_sector || null,
      target_audience: payload.target_audience || null,
      design_style: payload.design_style || null,
      specific_needs: payload.specific_needs || null,
      client_name: payload.client_name || null,
      client_email: payload.client_email || null,
      client_phone: payload.client_phone || null,
      utm_source: payload.utm_source || null,
      utm_medium: payload.utm_medium || null,
      utm_campaign: payload.utm_campaign || null,
      user_agent: event.headers["user-agent"] || null,
      updated_at: new Date().toISOString()
    };

    // Upsert to Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/quiz_leads`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Supabase upsert error:", errText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: "Supabase error", details: errText })
      };
    }

    const result = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, lead: result })
    };
  } catch (err) {
    console.error("Handler error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
