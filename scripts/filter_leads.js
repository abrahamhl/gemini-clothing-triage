const fs = require('fs');
const csv = require('csv-parser');
const leads = [];
const validTypes = ['vintage', 'second_hand'];

fs.createReadStream('C:\\Users\\2fabr\\.gemini\\antigravity-cli\\brain\\475642cc-423b-4ca9-9661-08f5a83ff38d\\Leads_Arnhem_100km.csv')
  .pipe(csv())
  .on('data', (row) => {
    const t = row.Tipo.toLowerCase();
    const n = row.Nombre.toLowerCase();
    if (validTypes.includes(t) || n.includes('kringloop') || n.includes('vintage') || n.includes('tweedehands')) {
      if (row.Email && row.Email.includes('@')) {
        leads.push(row);
      }
    }
  })
  .on('end', () => {
    let csvData = 'Nombre,Tipo,Distancia_Km,Ciudad,Direccion,Sitio_Web,Email,Telefono,Google_Maps,Oportunidad_Servicio\n';
    leads.forEach(l => {
      csvData += '"' + l.Nombre + '","' + l.Tipo + '",' + l.Distancia_Km + ',"' + l.Ciudad + '","' + l.Direccion + '","' + l.Sitio_Web + '","' + l.Email + '","' + l.Telefono + '","' + l.Google_Maps + '","' + l.Oportunidad_Servicio + '"\n';
    });
    fs.writeFileSync('C:\\Users\\2fabr\\.gemini\\antigravity-cli\\brain\\475642cc-423b-4ca9-9661-08f5a83ff38d\\Leads_Arnhem_100km_Limpio.csv', csvData);
    console.log('Leads super cualificados guardados: ', leads.length);
  });