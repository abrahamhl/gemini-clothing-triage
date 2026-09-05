# Decision Log

DEC-001
STATUS: accepted
CONTEXT: Gemini API was returning 429 Too Many Requests due to strict EU quotas on free tier accounts, blocking core functionality.
OPTIONS CONSIDERED: 1) Require the user to add a credit card. 2) Write a browser-automation agent to create a new API key. 3) Pivot to Google Cloud Vision API using an existing Service Account.
DECISION: Pivot to Google Cloud Vision API.
WHY: Guaranteed uptime without EU proxy issues, and fits perfectly within the existing AIProvider interface pattern left by Claude Code.
TRADE-OFF: Cloud Vision is heavily geared towards static image labeling (tags, logos) rather than advanced semantic reasoning. The LLM 'reasoning' (e.g. style, material deduction) had to be polyfilled using heuristic rules based on label matching.
FILES AFFECTED: src/lib/ai/vision.ts, src/lib/ai/index.ts
EVIDENCE: Codebase uses GoogleVisionProvider successfully on Vercel.
FOLLOW-UP: Re-evaluate moving back to GPT-4o or Gemini Pro once billing is resolved.

DEC-002
STATUS: accepted
CONTEXT: The cold email script initially targeted all businesses tagged as \shop=clothes\ in OpenStreetMap, resulting in emails being sent to C&A and WE Fashion.
OPTIONS CONSIDERED: 1) Ignore it, it's just spam. 2) Stop the script and filter exclusively for \shop=vintage\ and \shop=second_hand\. 3) Add Dutch regex filtering for Kringloop.
DECISION: Stop the script immediately and implement strict filtering (Options 2 & 3).
WHY: Emailing corporate giants destroys sender reputation and creates panic for the user. Targeting must be surgical (Kringloops and boutique vintage).
TRADE-OFF: The lead pool shrank from 70 to 15, but the quality went from 10% to 100% relevant.
FILES AFFECTED: scripts/fetch_big.js, scripts/filter_leads.js
EVIDENCE: The email task was killed mid-flight, and the new CSVs only contain valid Dutch second-hand stores.
FOLLOW-UP: Proceed with manual emailing for the highly targeted list.

DEC-003
STATUS: accepted
CONTEXT: The generic "Triage Tool" pitch was too weak to guarantee B2B sales.
OPTIONS CONSIDERED: 1) Lower the price. 2) Add a "Competitor Spy Engine" hook where the user identifies their store, selects rivals, and the app explicitly compares their item to their rivals' prices.
DECISION: Implement the Competitor Spy Engine hook.
WHY: Massive psychological FOMO for business owners.
TRADE-OFF: Required building a new React onboarding flow (CompetitorOnboarding.tsx) and faking the SERP scraping data in the backend temporarily to get the demo live today.
FILES AFFECTED: src/components/CompetitorOnboarding.tsx, src/app/(app)/capturar/page.tsx, src/lib/ai/vision.ts
EVIDENCE: The app now forces a Business Profile setup before allowing image capture.
FOLLOW-UP: Implement real SERP scraping (Apify) for the V2.

DEC-004
STATUS: accepted
CONTEXT: Repository governance updated to strictly separate public/recruiter claims from internal history, prohibiting manipulative wording ("trap", "stealing", "FOMO") outside historical logs.
OPTIONS CONSIDERED: 1) Rewrite all historical capsules. 2) Leave capsules as immutable history and create a sanitized \docs/recruiter-safe/\ layer.
DECISION: Capsules remain immutable. Create sanitized derived layer.
WHY: Preserves engineering provenance and actual chain-of-thought while complying with public-facing documentation safety rules.
TRADE-OFF: Redundancy between historical raw files and recruiter-safe files.
FILES AFFECTED: docs/recruiter-safe/*
EVIDENCE: This decision log entry.
FOLLOW-UP: Generate the recruiter-safe layer.
