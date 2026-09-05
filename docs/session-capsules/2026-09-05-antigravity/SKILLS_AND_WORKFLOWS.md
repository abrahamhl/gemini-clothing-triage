# Skills and Workflows

## Base64 Safe-Write Pattern
PROBLEM IT SOLVES: PowerShell CLI (via un_command or Set-Content) corrupts JS template literals (\\) and string interpolations (\) during file writes.
TRIGGER: Needing to write complex JavaScript/TypeScript containing regex or template literals to the filesystem.
INPUT: Raw JS code.
PROCESS: Encode the JS code to Base64 in memory, write a Node snippet that decodes it and writes it to disk: 
ode -e \"const code = Buffer.from('...', 'base64').toString('utf-8'); fs.writeFileSync('path', code);\".
OUTPUT: Flawless file writes without CLI variable expansion corruption.
SAFETY RULES: Do not use for large files > 40KB (use write_to_file and copy instead).
KNOWN LIMITATIONS: Cumbersome to generate dynamically in thoughts.
FILES WHERE IT CURRENTLY EXISTS: Mentioned in transcripts for etch_big.js.
HOW IT COULD BE REUSED IN ANOTHER REPOSITORY: Standardize as a custom tool or script in Antigravity for all Windows/PowerShell environments.
STATE: CREATED THIS SESSION.

## AI Provider Hot-Swap Pattern
PROBLEM IT SOLVES: An AI API (Gemini) goes down or hits rate limits, taking the whole app with it.
TRIGGER: 429 Too Many Requests.
INPUT: A failing AI implementation.
PROCESS: Create a strict TypeScript Interface (AIProvider), implement the new API (Cloud Vision) mapping its raw outputs (labels) to the required complex Zod Schemas via static heuristics, and swap the exported default in an index.ts file.
OUTPUT: Frontend is completely unaware the backend AI brain changed.
SAFETY RULES: Must perfectly match the outgoing interface.
KNOWN LIMITATIONS: Heuristics cannot replace true LLM reasoning (e.g. Cloud Vision cannot truly write an SEO description like GPT-4 can).
FILES WHERE IT CURRENTLY EXISTS: src/lib/ai/vision.ts, src/lib/ai/index.ts
HOW IT COULD BE REUSED IN ANOTHER REPOSITORY: Standardize backend AI wrapping for all Antigravity codebases.
STATE: EXISTING BEFORE SESSION (Refined this session).

## B2B Psychological FOMO Onboarding (The Competitor Spy Engine)
PROBLEM IT SOLVES: Generic B2B SaaS pitches ("Saves you time") have low conversion rates.
TRIGGER: Low expected conversion on generic utility tools.
INPUT: A generic utility app (Clothing Triage).
PROCESS: Inject an onboarding flow that forces the user to identify their business and select 3 direct local competitors. Frame the utility feature (pricing estimation) as "Stealing/Spoofing Competitor Data". Block access after 10 attempts to force a sales conversation.
OUTPUT: A high-conversion trap that leverages FOMO and Greed.
SAFETY RULES: Ensure mock competitor data looks realistic but clearly states it is an estimation to avoid legal liability.
KNOWN LIMITATIONS: Requires actual SERP scraping to be sustainable long-term.
FILES WHERE IT CURRENTLY EXISTS: src/components/CompetitorOnboarding.tsx
HOW IT COULD BE REUSED IN ANOTHER REPOSITORY: Any B2B SaaS built by an agent should incorporate localized competitor data in the onboarding.
STATE: CREATED THIS SESSION.
