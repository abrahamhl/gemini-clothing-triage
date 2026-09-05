import * as fs from 'fs';
import * as path from 'path';
import { BusinessLead } from './types';

const CRM_DIR = process.env.TRIAJE_CRM_DIR || path.join(process.env.LOCALAPPDATA || process.env.HOME || '', 'TriajeOS', 'crm');
const LEADS_FILE = path.join(CRM_DIR, 'leads.jsonl');
const QUEUE_DIR = path.join(CRM_DIR, 'outreach-queue');

export class LocalCRM {
  constructor() {
    if (!fs.existsSync(CRM_DIR)) fs.mkdirSync(CRM_DIR, { recursive: true });
    if (!fs.existsSync(QUEUE_DIR)) fs.mkdirSync(QUEUE_DIR, { recursive: true });
    if (!fs.existsSync(LEADS_FILE)) fs.writeFileSync(LEADS_FILE, '');
  }

  public getLeads(): BusinessLead[] {
    const lines = fs.readFileSync(LEADS_FILE, 'utf-8').split('\n').filter(Boolean);
    return lines.map(line => JSON.parse(line));
  }

  public saveLead(lead: BusinessLead): void {
    const leads = this.getLeads();
    const existingIndex = leads.findIndex(l => l.slug === lead.slug);
    
    lead.updatedAt = new Date().toISOString();

    if (existingIndex >= 0) {
      leads[existingIndex] = lead;
    } else {
      leads.push(lead);
    }
    
    // Write entire array back as JSONL (inefficient for millions, but fine for local B2B pipeline)
    const jsonl = leads.map(l => JSON.stringify(l)).join('\n');
    fs.writeFileSync(LEADS_FILE, jsonl + '\n');
  }

  public queueEmailDraft(leadId: string, emailContent: any): void {
    const filePath = path.join(QUEUE_DIR, `${leadId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(emailContent, null, 2));
  }

  public generateCSV(): string {
    const leads = this.getLeads();
    if (leads.length === 0) return '';
    
    const headers = ['Score', 'Business', 'City', 'Website', 'Webshop', 'Platform', 'Categories', 'Audit status', 'Demo status', 'Consent status', 'Email status', 'Visited', 'Last checked'];
    
    const rows = leads.map(l => [
      l.triajeFitScore,
      l.businessName,
      l.city,
      l.website || '',
      l.webshop || '',
      l.shopPlatform || '',
      l.categories.join('; '),
      l.auditStatus,
      l.demoStatus,
      l.consentStatus,
      l.emailStatus,
      l.visitedInPerson ? 'Yes' : 'No',
      l.lastCheckedAt
    ]);

    const csvLines = [
      headers.join(','),
      ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ];
    
    return csvLines.join('\n');
  }
}
