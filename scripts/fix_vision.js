const fs = require('fs');
const path = 'C:/dev/02_PROJECTS/triaje-ropa-gemini/src/lib/ai/vision.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace("sign.update(\.);", "sign.update(h + '.' + c);");
code = code.replace("return \..;", "return h + '.' + c + '.' + signature;");
code = code.replace("body: grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=", "body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt");
code = code.replace("const visionUrl = https://vision.googleapis.com/v1/images:annotate;", "const visionUrl = 'https://vision.googleapis.com/v1/images:annotate';");
code = code.replace("headers: { 'Authorization': Bearer +token, 'Content-Type': 'application/json' },", "headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },");

fs.writeFileSync(path, code);
console.log('Fixed vision.ts');
