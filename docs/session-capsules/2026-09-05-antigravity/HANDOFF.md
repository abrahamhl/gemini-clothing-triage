# Agent Handoff Document

## Current Status
- **CURRENT COMMIT**: (Check \git log -1\)
- **CURRENT BRANCH**: \master\
- **WORKING TREE STATUS**: Clean (docs/session-capsules will be committed shortly).
- **WHAT WORKS**: The Next.js app compiles successfully on Turbopack and Vercel. The \CompetitorOnboarding\ flow functions perfectly in the UI. Cloud Vision successfully analyzes images server-side.
- **WHAT IS BROKEN**: The 'Competitor Spy' data returned by the AI is currently mocked in \ision.ts\ (hardcoded random price modifiers) rather than real SERP data.

## Next 5 Priorities
1. **Database Migration**: Remove \local-store.ts\ and connect the \src/lib/storage.ts\ interface to Supabase/PostgreSQL. Vercel wipes the local store constantly.
2. **Real SERP Scraping**: Integrate Apify or Google Search API in \ision.ts\ -> \esearchMarket()\ to pull real Vinted/Marktplaats prices for the selected competitors.
3. **Stripe Integration**: Add a real Stripe Payment Link to the limit-reached error message in \CaptureModal.tsx\.
4. **Google Places Autocomplete**: Replace the hardcoded Arnhem competitors list in \CompetitorOnboarding.tsx\ with live Google Places or Overpass API calls based on the user's input.
5. **Auth**: Add NextAuth/Supabase Auth so clients can log in and save their competitor profiles persistently instead of relying on \localStorage\.

## Files That Must Not Be Modified Casually
- \src/lib/ai/vision.ts\: The JWT signing logic is brittle. Do not modify the \crypto.createSign\ block unless you fully understand GCP Service Account JWT assertions.
- \src/lib/ai/index.ts\: Controls the global AI provider singleton.

## Current Realities
- **AI PROVIDER REALITY**: We are hardcoded to Google Cloud Vision API using a Service Account JSON. Gemini is disabled.
- **STORAGE REALITY**: Ephemeral in-memory/JSON storage. Fails in production.
- **DEPLOYMENT REALITY**: Auto-deploys to Vercel on \master\ pushes.
