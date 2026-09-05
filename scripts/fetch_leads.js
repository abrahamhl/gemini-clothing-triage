const fs = require('fs');
const https = require('https');

const ARNHEM_LAT = 51.9851;
const ARNHEM_LON = 5.8987;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const query = '[out:json];(node["shop"="clothes"](around:100000,51.9851,5.8987);node["shop"="vintage"](around:100000,51.9851,5.8987);node["shop"="second_hand"](around:100000,51.9851,5.8987););out 2000;';

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
      const elements = json.elements || [];
      
      let leads = elements.map(el => {
        const tags = el.tags || {};
        const dist = getDistance(ARNHEM_LAT, ARNHEM_LON, el.lat, el.lon);
        return {
          name: tags.name ? tags.name.replace(/"/g, '""') : 'Sin nombre',
          type: tags.shop || 'desconocido',
          distanceKm: dist.toFixed(2),
          city: (tags['addr:city'] || '').replace(/"/g, '""'),
          street: (tags['addr:street'] || '').replace(/"/g, '""'),
          website: (tags.website || tags['contact:website'] || '').replace(/"/g, '""'),
          email: (tags.email || tags['contact:email'] || '').replace(/"/g, '""'),
          phone: (tags.phone || tags['contact:phone'] || '').replace(/"/g, '""'),
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + el.lat + ',' + el.lon
        };
      }).filter(l => l.name !== 'Sin nombre');
      
      leads.sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));
      
      let csv = 'Nombre,Tipo,Distancia_Km,Ciudad,Direccion,Sitio_Web,Email,Telefono,Google_Maps,Oportunidad_Servicio\n';
      
      leads.slice(0, 500).forEach(l => {
        const hasWeb = l.website !== '' ? 'SI' : 'NO';
        const op = hasWeb === 'NO' ? 'Vender_Web_y_LEAN_AI' : 'Vender_LEAN_AI';
        csv += '"' + l.name + '","' + l.type + '",' + l.distanceKm + ',"' + l.city + '","' + l.street + '","' + l.website + '","' + l.email + '","' + l.phone + '","' + l.mapsUrl + '","' + op + '"\n';
      });
      
      const outPath = 'C:\\Users\\2fabr\\.gemini\\antigravity-cli\\brain\\475642cc-423b-4ca9-9661-08f5a83ff38d\\scratch\\Leads_Arnhem_100km.csv';
      fs.writeFileSync(outPath, csv);
      console.log('CSV guardado en ' + outPath + ' con ' + Math.min(leads.length, 500) + ' resultados.');
    } catch (e) {
      console.error(e);
    }
  });
});
req.write(query);
req.end();
