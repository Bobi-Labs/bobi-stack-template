---
name: cli-first
description: Convention for using CLI tools and environment variables when interacting with third-party services like AWS, Vercel, Supabase, Stripe, GitHub, and Google Cloud. Read this when working on external services, deployments, infrastructure, or API integrations.
user-invocable: true
---

# CLI-First Development Convention

Always prefer CLI tools over web dashboards, REST APIs, or connector plugins when interacting with external platforms.

## Why

- Direct terminal control without navigating GUIs
- Scriptable, repeatable, automatable
- CLI tools are typically more current and capable

## Credential Management

Before using any CLI tool, check `.env*` files in priority order:

1. `.env.local` (highest priority, gitignored)
2. `.env`
3. Environment-specific: `.env.development`, `.env.production`

Never hardcode credentials. Use `./ops.sh env-pull` to sync from Vercel.

## Workflow

1. Check if the CLI tool is available (`which vercel`, `which supabase`, etc.)
2. Read `.env*` files for credentials and project IDs
3. Confirm authentication (`vercel whoami`, `supabase status`, etc.)
4. Execute the operation via CLI
5. If the tool isn't installed, suggest installation rather than working around it

## Common CLI Tools

| Service | CLI | Typical Use |
|---------|-----|-------------|
| Vercel | `vercel` | Deploy, env vars, logs, domains |
| Supabase | `supabase` or `npx supabase` | Gen types, migrations, DB access |
| GitHub | `gh` | PRs, issues, releases, actions |
| AWS | `aws` | S3, Lambda, CloudFront |
| Stripe | `stripe` | Webhooks, test payments |
| Google Cloud | `gcloud` | Service accounts, storage |
