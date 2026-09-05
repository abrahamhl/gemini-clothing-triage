# Defensible CV & Interview Claims

## Claim 1: Architected and implemented a secure AI-provider hot-swap in Next.js
**WHAT IT PROVES**: Backend engineering, security awareness (JWT/Service Accounts), API resilience, and ability to pivot architectures mid-flight without breaking frontend components.
**EXACT EVIDENCE**: Custom implementation of GoogleVisionProvider in src/lib/ai/vision.ts generating JWTs server-side via crypto modules to bypass frontend API key exposure, seamlessly replacing the failing Gemini API.
**TARGET ROLES**: AI Product Engineer, Full Stack Engineer.
**LIMITATION**: The Cloud Vision fallback relies heavily on heuristic polyfills rather than true LLM semantic generation.

## Claim 2: Designed and shipped a high-conversion 'Competitor Spy Engine' onboarding flow for a B2B SaaS
**WHAT IT PROVES**: Product sense, UX/UI engineering, React/Tailwind proficiency, and the ability to align technical features with aggressive business KPIs (FOMO-driven sales).
**EXACT EVIDENCE**: src/components/CompetitorOnboarding.tsx which injects a mandatory competitor-selection funnel before allowing product usage, gated by a strict 10-attempt local storage limit.
**TARGET ROLES**: Product Engineer, Creative Technologist, AI-native Product Designer.
**LIMITATION**: Currently uses hardcoded/mocked competitor data arrays rather than real-time SERP scraping.

## Claim 3: Built an automated OpenStreetMap OSINT pipeline for hyper-localized B2B lead generation
**WHAT IT PROVES**: Data engineering, automation, API integration (Overpass API), and business acumen (filtering enterprise noise to isolate SMB leads).
**EXACT EVIDENCE**: Node scripts (scripts/fetch_big.js, scripts/filter_leads.js) parsing OpenStreetMap JSON data via Overpass Query Language to extract verified Dutch vintage/second-hand stores with valid contact details.
**TARGET ROLES**: Applied AI Engineer, Forward Deployed Engineer.
**LIMITATION**: Data relies strictly on OSM tagging conventions, which may miss businesses unmapped or misclassified by the community.
