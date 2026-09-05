import { LocalCRM } from './crm';
import { calculateTriajeFitScore } from './scoring';
import { WebsiteAuditor } from './auditor';
import { BusinessLead } from './types';

// Mock runner to demonstrate the pipeline architecture
async function run() {
  const crm = new LocalCRM();
  const auditor = new WebsiteAuditor();

  // In a real scenario, this fetches from Overpass/OSM locally
  const mockLead: BusinessLead = {
    id: "froufrous-arnhem",
    slug: "froufrous",
    businessName: "Froufrou's",
    city: "Arnhem",
    businessCategory: "vintage",
    categories: [],
    samplePublicProducts: [],
    digitalMaturityScore: 0,
    triajeFitScore: 0,
    estimatedManualListingBurden: 0,
    evidence: [],
    visitedInPerson: false,
    consentStatus: 'DISCOVERED',
    auditStatus: 'PENDING',
    demoStatus: 'PENDING',
    emailStatus: 'PENDING',
    lastCheckedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockLead.triajeFitScore = calculateTriajeFitScore(mockLead);
  crm.saveLead(mockLead);

  console.log("Local CRM updated. CSV Export:");
  console.log(crm.generateCSV());
}

// run();
