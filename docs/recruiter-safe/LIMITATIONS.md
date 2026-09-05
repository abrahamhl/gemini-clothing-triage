# Technical Limitations (INTERNAL DRAFT)

- **Storage (VERIFIED)**: The current implementation utilizes an ephemeral local storage model (local-store.ts) which resets on serverless cold starts. Persistent data requires migration to PostgreSQL/Supabase.
- **Market Data (PARTIAL)**: The competitive market intelligence data shown in the UI currently leverages heuristic estimations and simulated localization rather than real-time SERP scraping.
- **Authentication (UNVERIFIED)**: No user authentication layer currently exists; sessions are tied exclusively to localStorage flags.
