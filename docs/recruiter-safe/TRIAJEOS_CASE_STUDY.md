# TriajeOS Case Study (INTERNAL DRAFT)

**Status: VERIFIED (Code deployed on Vercel)**

## Overview
A Next.js 16 (App Router) B2B SaaS application tailored for the Dutch second-hand/vintage clothing market. The product digitizes the intake process for thrift stores by applying AI image recognition to estimate market value.

## Problem
- **UNVERIFIED**: Store owners spend excess time manually researching prices.
- **VERIFIED**: The original Gemini API implementation encountered rate limits, stalling application performance.

## Solution
- **VERIFIED**: Migrated the AI backend to Google Cloud Vision API, authenticating securely via server-side JWTs.
- **VERIFIED**: Developed a localized market intelligence onboarding flow using React and Tailwind, prompting users to establish a geographical baseline for their business.
