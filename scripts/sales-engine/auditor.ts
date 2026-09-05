import { BusinessLead } from './types';

export interface AuditResult {
  observation: string;
  evidenceUrl: string;
  confidence: number;
  opportunityForTriajeOS: string;
}

export class WebsiteAuditor {
  public async audit(url: string): Promise<{ findings: AuditResult[], platform: string, webshopDetected: boolean }> {
    if (!url) return { webshopDetected: false, platform: 'Unknown', findings: [] };
    
    // Auto-prepend https if missing
    if (!url.startsWith('http')) url = 'https://' + url;

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'TriajeOS-B2B-Discovery-Agent/1.0 (abraham@auxdesign.nl)' }, signal: AbortSignal.timeout(5000) });
      if (!res.ok) return { webshopDetected: false, platform: 'Unknown', findings: [] };
      
      const html = await res.text();
      let platform = 'Custom';
      let webshopDetected = false;
      
      if (html.includes('Shopify.shop') || html.includes('cdn.shopify.com')) platform = 'Shopify';
      else if (html.includes('wp-content/plugins/woocommerce')) platform = 'WooCommerce';
      else if (html.includes('lightspeed')) platform = 'Lightspeed';

      if (platform !== 'Custom' || html.includes('add-to-cart') || html.includes('shopping-cart')) {
        webshopDetected = true;
      }

      return {
        webshopDetected,
        platform,
        findings: [] // We don't invent findings if we can't observe them.
      };
    } catch (e) {
      return { webshopDetected: false, platform: 'Unknown', findings: [] };
    }
  }
}
