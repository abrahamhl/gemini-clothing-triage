import { LocalCRM } from './crm';
import { BusinessLead } from './types';
import { WebsiteAuditor } from './auditor';
import { calculateTriajeFitScore } from './scoring';
import { generatePersonalizedEmail } from './email-generator';

export async function discoverArnhemLeads(): Promise<void> {
  const crm = new LocalCRM();
  const auditor = new WebsiteAuditor();
  const existingLeads = crm.getLeads();
  const existingSlugs = new Set(existingLeads.map(l => l.slug));

  console.log("Fetching leads from Overpass API for Arnhem...");
  
  const query = `
    [out:json][timeout:25];
    area["name"="Arnhem"]["admin_level"="8"]->.searchArea;
    (
      node["shop"="second_hand"](area.searchArea);
      way["shop"="second_hand"](area.searchArea);
      relation["shop"="second_hand"](area.searchArea);
      node["shop"="vintage"](area.searchArea);
      way["shop"="vintage"](area.searchArea);
      relation["shop"="vintage"](area.searchArea);
      node["name"~"kringloop|tweedehands|vintage",i](area.searchArea);
      way["name"~"kringloop|tweedehands|vintage",i](area.searchArea);
      relation["name"~"kringloop|tweedehands|vintage",i](area.searchArea);
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "TriajeOS-B2B-Discovery-Agent/1.0 (abraham@auxdesign.nl)"
      },
      body: "data=" + encodeURIComponent(query)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("Overpass API failed: " + res.statusText + " - " + errText);
    }

    const data = await res.json();
    let discovered = 0;

    for (const element of data.elements) {
      if (!element.tags || !element.tags.name) continue;
      
      const name = element.tags.name;
      if (name.match(/(c&a|h&m|primark|zara)/i)) continue;

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      if (existingSlugs.has(slug)) continue;

      const website = element.tags.website || element.tags['contact:website'] || undefined;
      const phone = element.tags.phone || element.tags['contact:phone'] || undefined;
      const email = element.tags.email || element.tags['contact:email'] || undefined;
      
      const lead: BusinessLead = {
        id: "osm-" + element.id,
        slug,
        businessName: name,
        city: "Arnhem",
        address: ((element.tags['addr:street'] || '') + ' ' + (element.tags['addr:housenumber'] || '')).trim(),
        businessCategory: element.tags.shop || "vintage",
        website,
        publicPhone: phone,
        publicBusinessEmail: email,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCheckedAt: new Date().toISOString()
      };

      if (lead.website) {
        console.log("Auditing website: " + lead.website);
        const auditRes = await auditor.audit(lead.website);
        lead.webshop = auditRes.webshopDetected ? lead.website : undefined;
        lead.shopPlatform = auditRes.platform;
        lead.auditStatus = 'COMPLETED';
      }

      lead.triajeFitScore = calculateTriajeFitScore(lead);
      if (lead.triajeFitScore >= 55) {
         lead.consentStatus = 'QUALIFIED';
         lead.demoStatus = 'PROVISIONED'; // Ready for demo
         
         const demoUrl = `https://gemini-clothing-triage.vercel.app/demo/${lead.slug}?token=local-test-token`;
         const draft = generatePersonalizedEmail(lead, demoUrl);
         crm.queueEmailDraft(lead.id, draft);
         lead.emailStatus = 'DRAFTED';
      }

      crm.saveLead(lead);
      existingSlugs.add(slug);
      discovered++;
    }

    console.log("Discovery complete. Found " + discovered + " new leads in Arnhem.");
  } catch (error) {
    console.error("Discovery error:", error);
  }
}
