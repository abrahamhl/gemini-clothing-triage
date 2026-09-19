# TriajeOS - Architecture Case Study

TriajeOS was built as an advanced, AI-driven clothing triage system for B2B applications. It leverages a modern Jamstack/Serverless architecture for auto-scaling and high availability.

## System Overview

*   **Frontend:** Next.js (React) + Tailwind CSS, emphasizing a PWA-ready approach with minimal payload overhead.
*   **Backend (Removed from public demo):** Vercel Serverless Functions that execute computer vision and natural language processing tasks.
*   **Database (Removed from public demo):** Supabase (PostgreSQL) for scalable relation mapping and authentication.
*   **AI Engine (Removed from public demo):** Abstraction over proprietary heuristics and computer vision models (including Gemini and Google Cloud Vision APIs), heavily fortified with Zero-Trust paradigms.

## Security Posture

- **Zero-Trust Backend**: All AI keys and service accounts are isolated within Vercel Edge functions. The client receives absolutely zero sensitive config.
- **Payload Sanitization**: The frontend performs aggressive client-side canvas compression to respect Vercel's 4.5MB payload limit and mitigate accidental DDoS from high-res images.
- **Proprietary Logic Omitted**: The actual valuation heuristics, OSINT parsing, and automated sales outreach components (the `scripts/sales-engine/` and `src/lib/valuation/`) have been removed from this public architectural case study to protect the intellectual property.

## Usage
This repository is published purely as an architectural reference and portfolio case study. It cannot be run as a full application due to the removal of the proprietary backend APIs and data models.
