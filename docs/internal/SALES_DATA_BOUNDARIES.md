# Sales Data Security Boundaries

The TriajeOS B2B Sales Engine adheres to a strict 3-tier data separation model to guarantee the security of private commercial observations, comply with repository governance, and protect client secrets.

## 1. PUBLIC APP DATA
- **Location**: Next.js client bundle and public API responses.
- **Scope**: Anonymous demo configuration, general product catalogs, aggregated market estimates, and strictly sanitized business recognition strings (e.g. searching for a city only reveals domains with active demos).
- **Security**: No PI, no lead scoring, no private notes.

## 2. SERVER-SIDE DEMO DATA
- **Location**: Server environment (Vercel Edge/Node) / Supabase (Production DB).
- **Scope**: Demo tokens, usage counters (10-item limit), server-authoritative timestamps, and business configurations explicitly consented to for the demo.
- **Security**: Cannot be queried directly by the client without an unguessable \	oken\. Counters are server-authoritative and not bypassable via \localStorage\.

## 3. LOCAL PRIVATE SALES CRM
- **Location**: Completely outside the Git repository. Stored locally on the operator's machine (e.g., \%LOCALAPPDATA%\\TriajeOS\\crm\\\).
- **Scope**: Raw lead generation data, audit findings, internal scoring (Triaje Fit Score), manual visit notes, generated email drafts (\outreach-queue\), and consent evidence.
- **Security**: Explicitly ignored in Git. NEVER deployed to Vercel. NEVER served via Next.js routes. It is the absolute source of truth for the outreach process and is physically isolated from the production app codebase.
