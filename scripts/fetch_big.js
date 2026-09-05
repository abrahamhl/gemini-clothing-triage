const https = require('https');
const fs = require('fs');

const query = `
  [out:json];
  area["name"="Nederland"]->.searchArea;
  (
    nwr["shop"~"clothes|second_hand|charity|vintage"]["name"~"(?i)kringloop|vintage|tweedehands|thrift|second hand"](area.searchArea);
    nwr["name"~"(?i)kringloop|vintage|tweedehands|thrift|second hand"](area.searchArea);
  );
  out center 20000;`
;

const options = {
  hostname: 'overpass-api.de',
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'NodeJS Leads Scraper'
  }
};


const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Found elements:', json.elements ? json.elements.length : 0);
      let count = 0;
      json.elements.forEach(el => {
        if(el.tags && el.tags.email) count++;
      });
      const path = 'C:\\Users\\2fabr\\.gemini\\antigravity-cli\\brain\\475642cc-423b-4ca9-9661-08f5a83ff38d\\raw_osm.json';
      fs.writeFileSync(path, JSON.stringify(json.elements, null, 2));
      console.log('Saved to ' + path);
      console.log('With email:', count);
    } catch(e) { console.log(e); }
  });
});
req.write(query);
req.end();
