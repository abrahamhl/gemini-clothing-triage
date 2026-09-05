# LEAD DISCOVERY AUDIT

| FEATURE | OLD COMMIT | WAS REAL? | CURRENT STATUS | RECOVER? | WHY |
|---|---|---|---|---|---|
| Arnhem B2B Leads CSV | d92523b | PARTIAL (Manual) | DEPRECATED | NO | The previous CSV was static and stored in Git, violating private data boundaries. Replaced by a real-time Overpass OSM agent. |
| Competitor Spy Flow | f265baa | PARTIAL | ACTIVE | NO | Relied on a static JSON fallback of Arnhem stores. The new sales-engine/discover.ts fetches this data dynamically to a local JSONL DB instead of shipping it to the client. |
| Dynamic Radius | d92523b | MOCK | DEPRECATED | NO | Old scripts attempted to calculate radius client-side using hardcoded arrays. Replaced by server-side Overpass Bounding Boxes. |
| Business Auditor | f265baa | MOCK | ACTIVE | YES (Rewritten) | Previous auditor blindly returned WooCommerce for everyone. Rewritten to actually fetch HTTP headers and body to detect platforms safely without crawling. |
| Email Sender | d92523b | BROKEN | ACTIVE | YES (Rewritten) | Previous send_cold_emails.js had no consent gating. Replaced by gmail-agent.ts with strict contactEligibility and DRY_RUN defaults. |

## Conclusion
The previous static/mock implementations were inadequate for a real B2B engine and violated the new data boundaries by committing leads to the repository. The new sales:run pipeline recovers the core concept (Overpass -> CRM -> Outreach) but implements it via local-only real fetches, strictly isolating the CRM from the Git repository.
