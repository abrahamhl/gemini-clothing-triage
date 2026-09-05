import { BusinessLead } from './types';

export function calculateTriajeFitScore(lead: Partial<BusinessLead>): number {
  let score = 0;
  const evidence: Array<{ signal: string; source: string; observedValue: unknown; scoreContribution: number }> = [];

  const addScore = (signal: string, val: unknown, points: number, source: string = 'OSINT') => {
    score += points;
    evidence.push({ signal, source, observedValue: val, scoreContribution: points });
  };

  // High-fit signals based purely on evidence
  if (lead.webshop) {
    addScore("webshop_exists", true, 30);
  }

  if (lead.businessCategory?.toLowerCase().includes('vintage') || lead.businessCategory?.toLowerCase().includes('second_hand')) {
    addScore("category_match", lead.businessCategory, 25);
  }

  if (lead.shopPlatform === 'Shopify' || lead.shopPlatform === 'WooCommerce') {
    addScore("platform_compatible", lead.shopPlatform, 15);
  }

  // Cap score at 100
  return Math.min(score, 100);
}
