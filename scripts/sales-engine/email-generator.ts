import { BusinessLead } from './types';

export function generatePersonalizedEmail(lead: BusinessLead, demoUrl: string, lang: 'NL' | 'EN' = 'NL') {

  const observation = lead.evidence.length > 0 
    ? lead.evidence.map(e => e.signal).join(', ') 
    : 'unieke vintage items verkoopt';
  
  const evidenceUrl = lead.webshop || lead.website || 'uw winkel';

  const visitNote = lead.visitedInPerson && lead.visitNotes 
    ? (lang === 'NL' ? `Ik was onlangs in uw winkel en zag uw prachtige collectie. ` : `I visited your store recently and loved the collection. `)
    : "";

  if (lang === 'NL') {
    return {
      subject: `Automatisering van productinvoer voor ${lead.businessName}`,
      bodyText: `Beste team van ${lead.businessName},

${visitNote}Tijdens mijn analyse van ${evidenceUrl} viel het me op dat u ${observation}.
Het handmatig invoeren, prijzen en beschrijven van deze tweedehands/vintage items kost extreem veel tijd vergeleken met standaard retail.
Omdat u gebruik maakt van ${lead.shopPlatform || 'een webshop'}, kan TriajeOS dit proces naadloos automatiseren.

U kunt de AI zelf testen met 10 van uw eigen kledingstukken via uw gepersonaliseerde demo:
${demoUrl}

Als dit de gewenste tijdswinst oplevert, kunnen we TriajeOS integreren (eenmalige setup €499, onderhoud/AI-updates €99/maand).

Met vriendelijke groet,

Abraham Haddioui Lastras
AUX Design · Arnhem
https://auxdesign.nl
https://creative-tech-portfolio.vercel.app/
`
    };
  } else {
      // English version
      return { subject: '', bodyText: '' };
  }
}
