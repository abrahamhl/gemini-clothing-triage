# TriajeOS (Architectural Case Study)

> ⚠️ **Note:** This repository has been heavily sanitized to remove proprietary algorithms, business logic, and API endpoints. It is published solely as an architectural reference and portfolio case study.

TriajeOS is a highly optimized, AI-driven B2B system designed to automate the triage, valuation, and listing of high-volume clothing inventory. It leverages multi-modal AI models to extract features from images, runs heuristic valuation engines against current market data, and interfaces directly with sales channels.

## Key Technical Achievements

- **Zero-Trust AI Gateways:** AI execution is strictly confined to serverless functions, protecting billing credentials and proprietary prompts from reverse engineering.
- **Client-Side Media Optimization:** Implements Canvas-based compression in the browser to ensure high-resolution photos never hit Vercel's 4.5MB payload limit, guaranteeing robust performance even on 3G connections.
- **Serverless Architecture:** Utilizes Vercel Edge and Node functions for instantaneous horizontal scaling.

Please read [`ARCHITECTURE.md`](ARCHITECTURE.md) for a deeper dive into the system design.
