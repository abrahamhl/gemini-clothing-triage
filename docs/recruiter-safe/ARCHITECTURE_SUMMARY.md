# Architecture Summary (INTERNAL DRAFT)

**Status: VERIFIED**

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS.
- **Backend**: Next.js API Routes.
- **AI Integration**: Google Cloud Vision API (Server-side JWT authentication).
- **Storage**: Ephemeral local JSON storage (local-store.ts). (PARTIAL - requires migration to persistent DB).
- **Deployment**: Vercel (Serverless Edge).
