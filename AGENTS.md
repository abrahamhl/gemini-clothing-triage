<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repository governance for all coding agents

These rules are mandatory for Antigravity, Jules, Claude Code, Codex, OpenCode, Grok, DeepSeek, Z.ai and any other coding agent working in this repository.

## Package manager and supply-chain policy

- JavaScript/TypeScript package manager: **pnpm only**, managed through Corepack.
- Never run or document `npm`, `npx` or Yarn commands.
- Keep an exact `packageManager` value in `package.json` and commit `pnpm-lock.yaml`.
- Do not add a dependency without first documenting why existing platform APIs/dependencies are insufficient and obtaining user approval.
- Never silently replace, remove or upgrade dependencies.

## Documentation and deployment boundary

- The repository `docs/` tree is **internal by default**. Do not expose, copy, link, or route it through the production web application unless the user explicitly approves a specific sanitized document for public use.
- Do not place session transcripts, raw AI outputs, handoff notes, local paths, lead lists, sales scripts, pricing research, threat-model details, credentials metadata, or agent scratchpads under `public/` or any web-served route.
- Do not generate duplicate `.docx` versions of Markdown documentation unless the user explicitly requests a deliverable in DOCX format.
- Session capsules may be committed only when sanitized of secrets and personal/private data. They remain internal evidence, not marketing copy.
- Never describe mock, simulated, heuristic or fallback data as live, scraped, verified, real-time or market-grounded.
- Never use manipulative or misleading product language such as "steal/spoof competitor data", "trap", "greed", "bypass" or "high-conversion" unless the user explicitly requests that wording and the underlying claim is accurate and lawful. Prefer precise technical language.
- Claims such as conversion rate, production scale, security guarantees, performance, customer adoption, users, revenue or benchmark superiority require repository evidence. Otherwise label them unverified or omit them.

## Secrets and private information

- Never read, print, commit or copy `.env.local` values, API keys, OAuth tokens, service-account private keys, passwords or access tokens.
- Environment variable names are okay; secret values are not.
- Before every commit that touches documentation or configuration, inspect the diff for secrets and personal/private data.

## Agent collaboration

- If another agent is actively modifying the same repository, work on an isolated branch and do not merge automatically.
- Record the base commit before major work.
- Do not force-push, hard-reset or clean away another agent's work.
- For long changes, finish with a PR or reviewable branch, verification commands and explicit remaining limitations.

## Truthfulness gate

Before calling work complete, distinguish:

- **VERIFIED** — supported by code/tests/CI/deployment evidence.
- **PARTIAL** — implemented but not fully verified.
- **UNVERIFIED** — claim or intended behavior without evidence.
- **STALE** — documentation no longer matches current code.

If documentation contradicts code, code is not automatically "correct": flag the contradiction and repair the documentation only after verifying current behavior.
