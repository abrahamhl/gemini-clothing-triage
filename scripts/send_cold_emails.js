const fs = require('fs');
const nodemailer = require('nodemailer');
const csv = require('csv-parser');
require('dotenv').config();

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const VERCEL_URL = process.env.VERCEL_URL || 'https://gemini-clothing-triage.vercel.app';

if (!SMTP_EMAIL || !SMTP_PASSWORD) {
  console.error('ERROR CRITICO: Faltan las credenciales');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: SMTP_EMAIL, pass: SMTP_PASSWORD }
});

const leads = [];
const CSV_PATH = 'C:\\Users\\2fabr\\.gemini\\antigravity-cli\\brain\\475642cc-423b-4ca9-9661-08f5a83ff38d\\Leads_Arnhem_100km.csv';

function getTemplateNoWeb(name, city) {
  return {
    subject: 'Vraag over uw vintage kleding winkel in ' + city + ' / Question about your store',
    text: 'Hi ' + name + ',\n\nIk ben Abraham, een tech-ondernemer. Ik zag dat jullie een fantastische winkel hebben in ' + city + ', maar ik kon jullie website niet vinden.\n\nVeel vintage winkels verliezen omzet omdat ze niet online verkopen. Ik heb een systeem ontwikkeld (LEAN AI) waarmee u kledingstukken kunt fotograferen met uw telefoon, waarna de AI automatisch de prijs berekent, de beschrijving schrijft en het product online zet.\n\nIk kan in 48 uur een complete webshop voor u bouwen inclusief deze AI-tool. U bespaart uren werk per week.\n\nHeeft u interesse in een korte digitale demo (geheel vrijblijvend)?\n\nMet vriendelijke groet,\nAbraham Haddioui\n\n(Note: I also speak English and Spanish if you prefer!)'
  };
}

function getTemplateWithWeb(name) {
  return {
    subject: 'Samenwerking voor ' + name + ' / AI Triage Tool',
    text: 'Hi ' + name + ' team,\n\nIk kwam jullie online shop tegen en ben onder de indruk van jullie vintage collectie.\n\nUit ervaring weet ik dat het fotograferen, prijzen bepalen en online zetten van tweedehands kleding een enorme flessenhals is. Daarom hebben wij de LEAN OSINT Engine gebouwd: een AI die kledingstukken herkent, direct de Marktplaats/Vinted waarde berekent en de SEO-beschrijvingen genereert, met 1 klik.\n\nIk geef u graag gratis toegang om het zelf te testen met 10 van uw eigen kledingstukken. Klik hier om het te proberen: ' + VERCEL_URL + '\n\nLaat me weten wat u ervan vindt!\n\nMet vriendelijke groet,\nAbraham Haddioui\n\n(Note: I also speak English and Spanish if you prefer!)'
  };
}

function sendEmailWithDelay(lead, delayMs) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const isNoWeb = lead.Oportunidad_Servicio === 'Vender_Web_y_LEAN_AI';
      const template = isNoWeb ? getTemplateNoWeb(lead.Nombre, lead.Ciudad) : getTemplateWithWeb(lead.Nombre);
      
      const mailOptions = {
        from: 'Abraham Haddioui <' + SMTP_EMAIL + '>',
        to: lead.Email,
        subject: template.subject,
        text: template.text
      };

      try {
        console.log('[ ' + new Date().toLocaleTimeString() + ' ] 🔐 Enviando a: ' + lead.Nombre + ' (' + lead.Email + ')');
        await transporter.sendMail(mailOptions);
        console.log('   ✅ Exito!');
      } catch (err) {
        console.error('   ❌ Error enviando a ' + lead.Email + ': ' + err.message);
      }
      resolve();
    }, delayMs);
  });
}

fs.createReadStream(CSV_PATH)
  .pipe(csv())
  .on('data', (row) => {
    if (row.Email && row.Email.includes('@')) {
      leads.push(row);
    }
  })
  .on('end', async () => {
    console.log('🎯 Se encontraron ' + leads.length + ' leads con email valido.');
    console.log('⏱ Iniciando secuencia de envio anti-spam (1 correo cada 45-90 segundos)...');
    
    let accumulatedDelay = 0;
    const promises = [];

    // Test mail to the user
    promises.push(sendEmailWithDelay({
      Nombre: 'Abraham (Test)',
      Ciudad: 'Arnhem',
      Oportunidad_Servicio: 'Vender_LEAN_AI',
      Email: SMTP_EMAIL
    }, 1000));
    accumulatedDelay += 1000;

    for (let i = 0; i < leads.length; i++) {
      const randomDelay = Math.floor(Math.random() * (90000 - 45000 + 1) + 45000);
      accumulatedDelay += randomDelay;
      promises.push(sendEmailWithDelay(leads[i], accumulatedDelay));
    }

    await Promise.all(promises);
    console.log('\n🎉 CAMPANA FINALIZADA. Todos los correos han sido procesados.');
  });