import crypto from 'crypto';

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(sa) {
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

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64, mime, provider, apiKey } = req.body;

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
}`;    // MODO SIMULADO / MOCK - Bypassing all API quotas for the demo
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time

    // Realistic Dutch second-hand market mock data
    const mockResponses = [
      {
        nombre: "Chaqueta Vintage Levi's",
        marca: "Levi's",
        estado: "Excelente",
        defectos: "Pequeño desgaste en el puño derecho",
        precio_estimado: "45.00",
        canal_venta: "Vinted / Tienda Física",
        explicacion: "El denim vintage de Levi's mantiene un alto valor en el mercado holandés de segunda mano. Perfecto para el público joven de Ámsterdam."
      },
      {
        nombre: "Suéter de Lana Merino",
        marca: "Sin etiqueta visible (Premium)",
        estado: "Bueno",
        defectos: "Ligeras bolitas de pelusa (pilling) en el abdomen",
        precio_estimado: "18.50",
        canal_venta: "Marketplace / Venta al peso",
        explicacion: "Material de alta calidad muy demandado en invierno en los Países Bajos, aunque requiere un ligero cepillado antes de la venta."
      },
      {
        nombre: "Abrigo de Invierno Impermeable",
        marca: "The North Face",
        estado: "Como Nuevo",
        defectos: "Ninguno visible",
        precio_estimado: "85.00",
        canal_venta: "Plataforma Premium / Escaparate",
        explicacion: "Altamente comercializable dado el clima lluvioso de Holanda. El estado impecable permite un margen de beneficio máximo."
      },
      {
        nombre: "Pantalones Vaqueros Rectos",
        marca: "G-Star RAW",
        estado: "Aceptable",
        defectos: "Desgaste notable en las rodillas y bajo deshilachado",
        precio_estimado: "12.00",
        canal_venta: "Reciclaje Textil / Venta al peso",
        explicacion: "G-Star es popular localmente, pero el nivel de desgaste lo relega a una categoría de menor margen. Ideal para upcycling."
      }
    ];

    // Pick a random mock response
    const mockData = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    let textResponse = JSON.stringify(mockData);

    const clean = textResponse.replace(/```json|```/g, '').trim();
    res.status(200).send(clean);

  } catch (err) {
    console.error("Error analizador:", err.message);
    res.status(500).json({ error: err.message });
  }
}
