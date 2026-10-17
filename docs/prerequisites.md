# Prerequisites

What to install before anything else, in the order that avoids discovering a missing tool
halfway through a setup step. Written because the setup docs used to mention each CLI
inline, mid-procedure, so a fresh machine found them one failure at a time.

## 1. Required: nothing runs without these

| Tool | Why | Install |
|---|---|---|
| **Node.js 20 or newer** (22 LTS recommended) | Next 16 and React 19 need it | [nodejs.org](https://nodejs.org), or `winget install OpenJS.NodeJS.LTS`, or `brew install node` |
| **pnpm 10.34.7** | Pinned in `package.json` as `packageManager`. npm and yarn will fight the lockfile | `corepack enable` then `corepack prepare pnpm@10.34.7 --activate` |
| **Git** | Version control, and on Windows it also supplies the bash that runs `ops.sh` | [git-scm.com](https://git-scm.com) (Windows: keep Git Bash selected) |

That is enough to run `./ops.sh install`, `dev`, `build`, `lint`, `typecheck`, and `test`.

**Windows note:** `ops.sh` is a bash script. Run it from Git Bash, not PowerShell or cmd.
Everything else in the workflow is shell-agnostic.

## 2. Required for the actual workflow

| Tool | What it unlocks | Install |
|---|---|---|
| **Claude Code** | The point of the scaffold. Skills (`/new-query`, `/new-mutation`, `/prose`, `/todo`, and the Supabase read and write conventions), hooks, memory templates, and `launch.json` all ship in `.claude/` and only mean something with Claude Code running | `npm i -g @anthropic-ai/claude-code` |
| **GitHub CLI** (`gh`) | Repo creation and the publish flow | [cli.github.com](https://cli.github.com), or `winget install GitHub.cli`, or `brew install gh` |
| **Vercel CLI** | `ops.sh deploy`, `env-pull`, `logs`, `status` | `pnpm add -g vercel` |
| **Supabase CLI** | `ops.sh gen-types`, which is the whole premise of the typed data layer: schema, generated types, registry, hook, component | `pnpm add -g supabase` |

Authenticate each once: `gh auth login`, `vercel login`, `supabase login`.

## 3. Situational, install when you hit the need

- **Docker Desktop.** Only for a local Postgres (`supabase start`) and for verifying RLS
  policies against a real database. Skip it until you are writing RLS, at which point it
  becomes mandatory. Keep it current: an outdated install fails in ways that look like
  your code is broken.
- **An IDE with the Claude Code extension** (VS Code, JetBrains). Optional. The CLI is
  complete on its own.
- **gitleaks**, for `./ops.sh secret-scan`. Strongly recommended on any PRIVATE repo,
  because GitHub's own secret scanning is a paid add-on for private repositories, which
  leaves them uncovered by default. Install with `winget install Gitleaks.Gitleaks` or
  `brew install gitleaks`; a fresh install is only on the PATH of shells started after it.
  The command exits with instructions rather than failing confusingly if it is absent.

## 4. Accounts

| Service | Free tier enough to start | Used for |
|---|---|---|
| GitHub | yes | Repos, CI |
| Vercel | yes | Hosting, preview deploys, env storage |
| Supabase | yes | Postgres, auth, row-level security, storage |
| Anthropic API key | separate from a Claude Code subscription | Only if the app you are building calls Claude at runtime |

## Verify the setup

```bash
node -v          # v20+ 
pnpm -v          # 10.34.7
git --version
gh auth status
vercel whoami
supabase --version
claude --version
```

## Traps worth knowing before they bite

- **ESLint must stay at `^9`.** Version 10 breaks `eslint-plugin-react` under the
  `eslint-config-next` 16 pin. Decline the dependabot bump.
- **`gen-types` overwrites `lib/supabase/database.types.ts` wholesale.** That is correct
  when the file is generated. If a project has hand-maintained named unions in there, the
  generator flattens them and breaks every import. Projects in that state should guard the
  command in their own `ops.sh` and say so in `CLAUDE.md`.
- **A push does not always deploy.** Vercel projects created by CLI rather than by Git
  integration need an explicit `vercel deploy --prod`. Check which kind yours is before
  assuming a push shipped.
- **Direct Postgres hosts are IPv6-only.** On an IPv4-only network, connections to
  `db.<ref>.supabase.co` time out. Use the pooler host instead, and consider a fallback in
  any SQL runner.

## Then what

Read [`starting-a-new-project.md`](starting-a-new-project.md) for a new build, or
[`migrating-an-existing-project.md`](migrating-an-existing-project.md) to bring an
in-flight project onto these conventions. The README's "Start here" section sequences the
whole path.
