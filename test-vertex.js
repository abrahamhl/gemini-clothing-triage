const fs = require('fs');
const crypto = require('crypto');

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function run() {
  const sa = JSON.parse(fs.readFileSync('C:/dev/02_PROJECTS/own-gemini-API-project/anomalyos/secrets/gcp-sa.json', 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: sa.token_uri,
    exp: now + 3600,
    iat: now
  };
  const header = { alg: 'RS256', typ: 'JWT' };
  const signInput = base64UrlEncode(JSON.stringify(header)) + '.' + base64UrlEncode(JSON.stringify(claim));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signInput);
  const signature = signer.sign(sa.private_key, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const resp = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: signInput + '.' + signature })
  });
  const { access_token } = await resp.json();
  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-flash-001:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'hola' }] }] })
  });
  console.log(JSON.stringify(await res.json(), null, 2));
}
run().catch(console.error);
