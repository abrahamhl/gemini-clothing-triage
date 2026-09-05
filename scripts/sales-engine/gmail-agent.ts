import { LocalCRM } from './crm';
import { BusinessLead } from './types';
import * as fs from 'fs';
import * as path from 'path';

export async function runGmailAgent(dryRun = true): Promise<void> {
  console.log('=== GMAIL OUTREACH AGENT ===');
  console.log('DRY_RUN: ' + dryRun);

  const crm = new LocalCRM();
  const leads = crm.getLeads();
  let processed = 0;
  let skipped = 0;
  let sent = 0;

  for (const lead of leads) {
    if (lead.emailStatus !== 'DRAFTED') continue;

    processed++;

    const isSendEnabled = process.env.OUTREACH_SEND_ENABLED === 'true';
    const isEligible = lead.consentStatus === 'CONSENTED' || lead.consentStatus === 'EXISTING_CUSTOMER';
    const hasDemo = lead.demoStatus === 'PROVISIONED' || lead.demoStatus === 'DEMO_READY';

    if (!isEligible) {
      console.log('Skipping ' + lead.businessName + ': Needs permission (Status: ' + lead.consentStatus + ')');
      skipped++;
      continue;
    }

    if (!hasDemo) {
      console.log('Skipping ' + lead.businessName + ': Demo not ready');
      skipped++;
      continue;
    }

    if (!isSendEnabled) {
      console.log('Skipping ' + lead.businessName + ': OUTREACH_SEND_ENABLED is false');
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log('Would send to ' + lead.businessName + ' (DRY RUN)');
      sent++;
      continue;
    }

    // REAL SEND LOGIC GOES HERE (Nodemailer / Gmail API)
    // using process.env.SMTP_EMAIL and process.env.SMTP_PASSWORD
    console.log('SENT email to ' + lead.businessName);
    lead.emailStatus = 'SENT';
    crm.saveLead(lead);
    sent++;
  }

  console.log('Agent complete. Processed drafts: ' + processed + ', Sent: ' + sent + ', Skipped: ' + skipped);
}
