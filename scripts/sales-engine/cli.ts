import { LocalCRM } from './crm';
import { discoverArnhemLeads } from './discover';
import { runGmailAgent } from './gmail-agent';
import { runReconciliation } from './reconcile';
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
    
    let historicalSent = 31;
    let duplicates = leads.filter(l => l.suppressionReason === 'DUPLICATE_SENT').length;
    let bounces = leads.filter(l => l.suppressionReason === 'BOUNCED').length;
    let replies = leads.filter(l => l.suppressionReason === 'REPLIED').length;
    let dnc = leads.filter(l => l.consentStatus === 'DO_NOT_CONTACT').length;
    let audited = leads.filter(l => l.auditStatus === 'COMPLETED').length;
    let highFit = leads.filter(l => l.triajeFitScore >= 55).length;
    let demoReady = leads.filter(l => l.demoStatus === 'DEMO_READY' || l.demoStatus === 'PROVISIONED').length;
    let draftReady = leads.filter(l => l.emailStatus === 'DRAFTED').length;
    let sendEligible = leads.filter(l => l.emailStatus === 'DRAFTED' && (l.consentStatus === 'CONSENTED' || l.consentStatus === 'EXISTING_CUSTOMER')).length;

    console.log("TOTAL LEADS: " + leads.length);
    console.log("EXTERNAL EMAILS ALREADY SENT: " + historicalSent);
    console.log("UNIQUE BUSINESSES CONTACTED: " + (historicalSent - duplicates));
    console.log("DUPLICATE SENDS: " + duplicates);
    console.log("BOUNCES: " + bounces);
    console.log("REPLIES: " + replies);
    console.log("DO_NOT_CONTACT: " + dnc);
    console.log("AUDITED: " + audited);
    console.log("HIGH_FIT: " + highFit);
    console.log("DEMO_READY: " + demoReady);
    console.log("DRAFT_READY: " + draftReady);
    console.log("SEND_ELIGIBLE: " + sendEligible);
  } else if (command === 'export') {
    const csv = crm.generateCSV();
    const outPath = path.join(process.cwd(), 'export-leads.csv');
    fs.writeFileSync(outPath, csv);
    console.log("Exported to " + outPath + " (Remember not to commit this!)");
  } else if (command === 'reconcile') {
    await runReconciliation();
  } else if (command === 'mail') {
    await runGmailAgent(true);
  } else {
    console.log("Unknown command. Use: run, status, export, mail, reconcile");
  }
}

main().catch(console.error);
