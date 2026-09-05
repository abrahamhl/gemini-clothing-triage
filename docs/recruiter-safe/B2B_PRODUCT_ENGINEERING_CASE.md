# TriajeOS: B2B Product Engineering Case Study (INTERNAL DRAFT)

**Status: VERIFIED (Architecture complete, awaiting production data integration)**

## Overview
This case study details the transformation of TriajeOS from a utility application into a self-serve B2B acquisition machine. The system integrates a localized lead qualification engine, business auditing, and personalized demo provisioning, all gated by strict privacy and consent boundaries.

## Architecture

### 1. Lead Qualification Pipeline
The system utilizes an OSINT engine to identify potential B2B clients (e.g., local second-hand and vintage stores). The data is normalized (domain matching, city disambiguation) and scored (0-100) based on observable digital maturity signals (e.g., presence of product schemas, image counts, platform detection).

### 2. The Consent Gate
The outreach architecture strictly enforces a consent gate. Email states (DISCOVERED, QUALIFIED, AUDITED, CONSENT_PENDING) are maintained locally. Automated outreach drafts are generated into a decoupled queue (\outreach-queue/\) and are only marked \SEND_ELIGIBLE\ when explicitly backed by consent evidence or lawful existing-customer basis. 

### 3. Personalized Demo Provisioning
The application provisions unguessable demo URLs (\/demo/[businessSlug]?token=...\). The onboarding flow allows users to search their business, verifying identity before entering the personalized sandbox.

### 4. Server-Authoritative Commercial Limits
The 10-item demo limit is enforced server-side, deprecating unreliable \localStorage\ barriers. Upon exhaustion, the system measures the actual time saved by the AI versus manual processing, presenting concrete ROI metrics alongside a transparent, non-manipulative pricing structure (€499 setup + €99/month).

## Technical Achievements
- **Data Boundary Design**: Successfully decoupled the Local Private CRM (which holds commercial intelligence) from the Public App Data and Server-Side Demo configuration.
- **Auditor Implementation**: Engineered a public-page auditing script that evaluates structured metadata without bypassing authentication or scraping logged-in sessions.
- **Conversion Measurement**: Built internal telemetry to track the delta between manual processing time and AI processing time to establish verifiable product value.
