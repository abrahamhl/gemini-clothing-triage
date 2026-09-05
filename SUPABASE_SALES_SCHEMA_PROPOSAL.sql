-- Supabase Schema Proposal: TriajeOS Sales Engine
-- Status: PROPOSAL ONLY (Awaiting credentials and approval)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for Demo Status
CREATE TYPE demo_status AS ENUM ('active', 'expired', 'converted');

-- Table: Business Profiles (Server-Side Demo Data)
-- This table only contains the data strictly necessary for the public/semi-public demo flow.
CREATE TABLE public.business_demos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    city VARCHAR(100),
    recognized_categories TEXT[],
    demo_token UUID NOT NULL DEFAULT uuid_generate_v4(),
    analyses_limit INT NOT NULL DEFAULT 10,
    analyses_used INT NOT NULL DEFAULT 0,
    status demo_status DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '14 days'
);

-- Index for searching domains/cities in the recognition flow
CREATE INDEX idx_business_demos_lookup ON public.business_demos(slug, city);

-- RLS (Row Level Security)
ALTER TABLE public.business_demos ENABLE ROW LEVEL SECURITY;

-- Clients can only READ a demo if they have the exact token
CREATE POLICY "Allow public read with exact token" ON public.business_demos
    FOR SELECT USING (current_setting('request.jwt.claims', true)::json->>'role' = 'anon' AND demo_token = current_setting('request.headers', true)::json->>'x-demo-token');

-- Usage increments require server role
CREATE POLICY "Allow service role to increment usage" ON public.business_demos
    FOR UPDATE USING (auth.role() = 'service_role');
