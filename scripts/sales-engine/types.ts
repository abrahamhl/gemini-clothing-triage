export interface BusinessLead {
  id: string;
  businessName: string;
  slug: string;
  city: string;
  address?: string;
  website?: string;
  webshop?: string;
  businessCategory: string;
  publicBusinessEmail?: string;
  publicPhone?: string;
  mapsUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;

  websitePlatform?: string;
  shopPlatform?: string;

  categories: string[];
  samplePublicProducts: string[];

  digitalMaturityScore: number;
  triajeFitScore: number;
  estimatedManualListingBurden: number;
  evidence: Array<{ signal: string; source: string; observedValue: any; scoreContribution: number }>;

  visitedInPerson: boolean;
  visitedAt?: string;
  visitNotes?: string;

  consentStatus: 'DISCOVERED' | 'QUALIFIED' | 'AUDITED' | 'CONSENT_PENDING' | 'CONSENTED' | 'DEMO_READY' | 'DRAFT_READY' | 'SENT' | 'REPLIED' | 'WON' | 'LOST' | 'DO_NOT_CONTACT';
  consentSource?: 'IN_PERSON' | 'WEBSITE_OPT_IN' | 'EXISTING_CUSTOMER' | 'EXPLICIT_EMAIL_REQUEST';
  consentAt?: string;
  consentEvidence?: string;

  auditStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  demoStatus: 'PENDING' | 'PROVISIONED' | 'USED' | 'EXPIRED';
  emailStatus: 'PENDING' | 'DRAFTED' | 'SENT';

  lastCheckedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoProfile {
  slug: string;
  businessName: string;
  city: string;
  domain?: string;
  recognizedCategories: string[];
}
