import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT) || 3000;
const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-IsyaratOK-Server": "groq-proxy",
  });
  response.end(JSON.stringify(payload));
}

async function readRequestBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 100_000) {
      throw new Error("Request terlalu besar.");
    }
  }
  if (!body.trim()) {
    throw new Error("Request body kosong.");
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("Request body harus berupa JSON yang valid.");
  }
}

async function handleChat(request, response) {
  if (!groqApiKey) {
    sendJson(response, 503, { error: "GROQ_API_KEY belum dikonfigurasi di server." });
    return;
  }

  const payload = await readRequestBody(request);
  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    sendJson(response, 400, { error: "Riwayat pesan tidak valid." });
    return;
  }

  const groqResponse = await fetch(groqEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: groqModel,
      messages: payload.messages,
      temperature: 0.4,
      max_tokens: 500,
    }),
  });

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
          : `Groq menolak permintaan (HTTP ${groqResponse.status}, model ${groqModel}).`,
      status: groqResponse.status,
      model: groqModel,
    };
  }

  sendJson(response, groqResponse.status, result);
}

async function serveStatic(request, response) {
  const requestedPath = request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const filePath = normalize(join(root, requestedPath));
  if (!filePath.startsWith(root)) {
    sendJson(response, 403, { error: "Akses ditolak." });
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    });
    response.end(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendJson(response, 404, { error: "File tidak ditemukan." });
      return;
    }
    throw error;
  }
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const pathname = requestUrl.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS" && pathname === "/api/chat") {
      response.writeHead(204, {
        Allow: "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      });
      response.end();
      return;
    }

    if (request.method === "POST" && pathname === "/api/chat") {
      await handleChat(request, response);
      return;
    }

    if (request.method === "GET") {
      await serveStatic({ ...request, url: `${pathname}${requestUrl.search}` }, response);
      return;
    }

    response.setHeader("Allow", pathname === "/api/chat" ? "POST, OPTIONS" : "GET");
    sendJson(response, 405, { error: "Metode tidak didukung." });
  } catch (error) {
    if (response.headersSent) {
      response.end();
      return;
    }
    sendJson(response, 500, { error: error.message || "Terjadi kesalahan server." });
  }
});

server.listen(port, () => {
  console.log(`IsyaratOK berjalan di http://localhost:${port} menggunakan model ${groqModel}`);
});
