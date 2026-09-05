import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;

// Try to load Service Account JSON from multiple possible locations
const saPaths = [
  path.resolve("C:/Users/2fabr/Documents/gcp-sa.json"),
  path.resolve("C:/dev/02_PROJECTS/own-gemini-API-project/anomalyos/secrets/gcp-sa.json"),
  path.resolve(__dirname, "gcp-sa.json")
];

let sa = null;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  try {
    sa = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    console.log(`✅ Service Account cargado exitosamente desde variable de entorno.`);
    console.log(`📌 Proyecto GCP: ${sa.project_id}`);
  } catch (e) {
    console.log(`⚠️ Error leyendo variable GOOGLE_APPLICATION_CREDENTIALS_JSON:`, e.message);
  }
}

if (!sa) {
  for (const p of saPaths) {
    if (fs.existsSync(p)) {
      try {
        sa = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log(`✅ Service Account cargado exitosamente desde: ${p}`);
        console.log(`📌 Proyecto GCP: ${sa.project_id}`);
        break;
      } catch (e) {
        console.log(`⚠️ Error leyendo ${p}:`, e.message);
      }
    }
  }
}

if (!sa) {
  console.log("⚠️ No se encontró gcp-sa.json ni variable de entorno. Se usarán API Keys de cliente si se proporcionan.");
}

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken() {
  if (!sa) throw new Error("Service Account no configurado.");
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/generative-language",
    aud: sa.token_uri,
    exp: now + 3600,
    iat: now
  };
  const header = { alg: "RS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaim = base64UrlEncode(JSON.stringify(claim));
  const signInput = `${encodedHeader}.${encodedClaim}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signInput);
  const signature = signer.sign(sa.private_key, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = `${signInput}.${signature}`;

  const resp = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error("OAuth token error: " + JSON.stringify(data));
  return data.access_token;
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(htmlPath));
      return;
    }
  }

  if (req.method === 'POST' && req.url === '/api/analyze') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { base64, mime, provider, apiKey } = JSON.parse(body);

        const prompt = `Eres un auditor experto en reventa de ropa usada en Marktplaats NL, Vinted y Facebook Marketplace.
Analiza esta prenda y responde ÚNICAMENTE con un JSON válido sin markdown ni comillas triples:

{
  "titulo": "Marca + Tipo de prenda descriptivo",
  "nicho": "Streetwear / Vintage / Casual / Deportivo / Formal",
  "genero": "Hombre / Mujer / Unisex",
  "talla": "Talla estimada visualmente",
  "estado": "Nuevo / Como nuevo / Bueno / Usado",
  "pvp_marktplaats": "Precio estimado en euros para Marktplaats",
  "pvp_vinted": "Precio estimado en euros para Vinted",
  "canal": "Marktplaats / Vinted / FB Marketplace / Ambos",
  "veredicto": "KEEP / TRASH",
  "motivo": "Motivo breve de reventa"
}`;

        let textResponse = "";

        if (provider === "nvidia") {
          // LLama 3.2 90B Vision Instruct on NVIDIA NIM
          if (!apiKey) throw new Error("API Key de NVIDIA NIM no proporcionada");
          
          const url = "https://integrate.api.nvidia.com/v1/chat/completions";
          const nimPayload = {
            model: "meta/llama-3.2-90b-vision-instruct",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: `data:${mime};base64,${base64}` } }
                ]
              }
            ],
            temperature: 0.2,
            max_tokens: 512
          };
          
          const resNim = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(nimPayload)
          });
          
          const dataNim = await resNim.json();
          if (!resNim.ok) throw new Error(dataNim.detail || "Error en NVIDIA NIM");
          textResponse = dataNim.choices[0].message.content;

        } else if (provider === "gemini-free") {
          // Gemini Free API
          if (!apiKey) throw new Error("API Key de Gemini no proporcionada");
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
          const resGem = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: mime || 'image/jpeg', data: base64 } }
                ]
              }]
            })
          });
          
          const dataGem = await resGem.json();
          if (!resGem.ok) throw new Error(dataGem.error?.message || "Error en Gemini API");
          textResponse = dataGem.candidates[0].content.parts[0].text;

        } else {
          // GCP Vertex AI (Default)
          if (!sa) throw new Error("Google Cloud Service Account no configurado en el servidor.");
          const token = await getAccessToken();

          let vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/us-central1/publishers/google/models/gemini-3.6-flash:generateContent`;
          let apiRes = await fetch(vertexUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{
                role: 'user',
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: mime || 'image/jpeg', data: base64 } }
                ]
              }]
            })
          });

          let data = await apiRes.json();
          if (!apiRes.ok) {
            // Fallback GenerativeLanguage API with bearer
            let genUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`;
            apiRes = await fetch(genUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    { text: prompt },
                    { inline_data: { mime_type: mime || 'image/jpeg', data: base64 } }
                  ]
                }]
              })
            });
            data = await apiRes.json();
          }

          if (!apiRes.ok) throw new Error(data.error?.message || 'Error en API Google Cloud');
          textResponse = data.candidates[0].content.parts[0].text;
        }

        const clean = textResponse.replace(/```json|```/g, '').trim();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(clean);

      } catch (err) {
        console.error("Error analizador:", err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================================`);
  console.log(`🚀 SERVIDOR LEAN AI TRIAJE EN EJECUCIÓN`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 Disponible en tu red local para acceso móvil.`);
  console.log(`=================================================\n`);
});
