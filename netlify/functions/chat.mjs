const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";
const defaultModel = "openai/gpt-oss-120b";

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse(405, {
      error: "Metode tidak didukung.",
    });
  }

  const apiKey = Netlify.env.get("GROQ_API_KEY");
  if (!apiKey) {
    return jsonResponse(503, {
      error: "GROQ_API_KEY belum dikonfigurasi di Netlify.",
    });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, {
      error: "Request body harus berupa JSON yang valid.",
    });
  }

  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    return jsonResponse(400, {
      error: "Riwayat pesan tidak valid.",
    });
  }

  const model = Netlify.env.get("GROQ_MODEL") || defaultModel;
  let groqResponse;

  try {
    groqResponse = await fetch(groqEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: payload.messages,
        temperature: 0.4,
        max_tokens: 500,
      }),
    });
  } catch {
    return jsonResponse(502, {
      error: "Tidak dapat terhubung ke layanan Groq.",
    });
  }

  const responseText = await groqResponse.text();
  let result;

  try {
    result = responseText ? JSON.parse(responseText) : {};
  } catch {
    result = {
      error: `Groq mengembalikan respons non-JSON (HTTP ${groqResponse.status}).`,
    };
  }

  if (!groqResponse.ok) {
    const groqMessage =
      result.error && typeof result.error === "object"
        ? result.error.message
        : result.error;

    result = {
      error:
        typeof groqMessage === "string" && groqMessage.trim()
          ? groqMessage
          : `Groq menolak permintaan (HTTP ${groqResponse.status}, model ${model}).`,
    };
  }

  return jsonResponse(groqResponse.status, result);
}
