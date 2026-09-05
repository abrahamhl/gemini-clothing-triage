import { BusinessLead } from './types';

export function generatePersonalizedEmail(lead: BusinessLead, demoUrl: string, lang: 'NL' | 'EN' = 'NL') {
  // Enforce consent/lawful basis check before generating an email
  if (lead.consentStatus !== 'CONSENTED' && lead.consentStatus !== 'EXISTING_CUSTOMER') {
      throw new Error(`Cannot generate email draft: Missing explicit consent or lawful basis for lead ${lead.id}`);
  }

  const visitNote = lead.visitedInPerson && lead.visitNotes 
    ? (lang === 'NL' ? `Ik was onlangs in uw winkel en zag uw prachtige collectie. ` : `I visited your store recently and loved the collection. `)
    : "";

  if (lang === 'NL') {
    return {
      subject: `Automatisering van productinvoer voor ${lead.businessName}`,
      bodyText: `Beste team van ${lead.businessName},

${visitNote}Ik merkte via jullie website (${lead.website}) dat jullie veel unieke vintage items verkopen.
Uit onze analyse blijkt dat het handmatig prijzen en beschrijven van deze items veel tijd kost. 
TriajeOS kan dit proces automatiseren. U kunt het zelf testen met 10 van uw eigen kledingstukken:

${demoUrl}

Dit is een gepersonaliseerde demo. Als het bevalt, kunnen we TriajeOS integreren voor een eenmalige setup van €499 en €99/maand voor onderhoud en AI-updates.

Met vriendelijke groet,

Abraham Haddioui Lastras
AUX Design · Arnhem
https://auxdesign.nl
Portfolio: https://creative-tech-portfolio.vercel.app/
GitHub: https://github.com/abrahamhl
`
    };
  } else {
      // English version omitted for brevity
      return { subject: "", bodyText: "" };
  }
}
