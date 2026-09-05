import { LocalCRM } from './crm';
import { discoverArnhemLeads } from './discover';
import { runGmailAgent } from './gmail-agent';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const crm = new LocalCRM();

  if (command === 'run') {
    console.log("=== RUNNING TRIAJEOS SALES PIPELINE ===");
    await discoverArnhemLeads();
    console.log("Pipeline run complete.");
  } else if (command === 'status') {
    const leads = crm.getLeads();
    console.log("=== TRIAJEOS CRM STATUS ===");
    console.log("TOTAL LEADS: " + leads.length);
    console.log("ARNHEM LEADS: " + leads.filter(l => l.city.toLowerCase() === 'arnhem').length);
    console.log("LEADS WITH WEBSITE: " + leads.filter(l => l.website).length);
    console.log("LEADS WITH WEBSHOP: " + leads.filter(l => l.webshop).length);
    console.log("LEADS WITH VERIFIED BUSINESS EMAIL: " + leads.filter(l => l.publicBusinessEmail).length);
    
    const avgFit = leads.length ? leads.reduce((acc, l) => acc + l.triajeFitScore, 0) / leads.length : 0;
    console.log("AVERAGE FIT SCORE: " + avgFit.toFixed(2));
    
    const states = {
      DISCOVERED: 0, AUDITED: 0, HIGH_FIT: 0, CONTACT_ELIGIBLE: 0,
      DEMO_READY: 0, DRAFT_READY: 0, SENT: 0, REPLIED: 0,
      DEMO_USED: 0, WON: 0, LOST: 0, DO_NOT_CONTACT: 0
    };
    
    leads.forEach(l => {
      if (l.consentStatus in states) states[l.consentStatus as keyof typeof states]++;
      if (l.triajeFitScore >= 70) states.HIGH_FIT++;
      if (l.consentStatus === 'CONSENTED') states.CONTACT_ELIGIBLE++;
    });
    
    console.log("\n--- STATES ---");
    for (const [k, v] of Object.entries(states)) {
      console.log(k + ": " + v);
    }
  } else if (command === 'export') {
    const csv = crm.generateCSV();
    const outPath = path.join(process.cwd(), 'export-leads.csv');
    fs.writeFileSync(outPath, csv);
    console.log("Exported to " + outPath + " (Remember not to commit this!)");
  } else if (command === 'mail') {
    await runGmailAgent(true);
  } else {
    console.log("Unknown command. Use: run, status, export, mail");
  }
}

main().catch(console.error);
