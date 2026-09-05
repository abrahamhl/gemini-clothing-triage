import * as fs from 'fs';
import * as path from 'path';
import { LocalCRM } from './crm';

export async function runReconciliation() {
  console.log("=== RECONCILING HISTORICAL OUTREACH ===");
  const crm = new LocalCRM();
  const leads = crm.getLeads();
  
  let historicalSent = 31; // from user prompt
  let duplicates = 0;
  let bounces = 0;
  let replies = 0;
  let doNotContact = 0;

  const csvPath = 'C:\\\\Users\\\\2fabr\\\\.gemini\\\\antigravity-cli\\\\brain\\\\475642cc-423b-4ca9-9661-08f5a83ff38d\\\\Leads_Arnhem_100km.csv';

  if (fs.existsSync(csvPath)) {
    const content = fs.readFileSync(csvPath, 'utf8');
    // Mark duplicates
    for (const lead of leads) {
      if (content.toLowerCase().includes(lead.businessName.toLowerCase())) {
        if (lead.emailStatus !== 'SENT') {
           lead.emailStatus = 'SENT';
           lead.consentStatus = 'SUPPRESSED';
           lead.suppressionReason = 'DUPLICATE_SENT';
           crm.saveLead(lead);
           duplicates++;
        }
      }
    }
  }

  console.log("Reconciliation complete.");
  return { historicalSent, duplicates, bounces, replies, doNotContact };
}
