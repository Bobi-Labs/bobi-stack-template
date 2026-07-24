# New Project Setup: Step by Step

Copy this template folder, then follow these steps to wire up a fully connected project.

---

## Step 1: Copy & Rename

```bash
# Copy the template
cp -r bobi-stack my-new-project
cd my-new-project

# Update project name in two files:
# - package.json → "name": "my-new-project"
# - ops.sh → PROJECT_NAME="my-new-project"
```

## Step 2: Initialize Git + GitHub

```bash
# Initialize local repo
git init
git add -A
git commit -m "Initial scaffold from bobi-stack template"

# Create GitHub repo (requires gh CLI: https://cli.github.com)
gh repo create your-org/my-new-project --private --source=. --push

# Or manually:
# 1. Go to github.com → New Repository
# 2. Create empty repo (no README, no .gitignore, since you already have both)
# 3. Then:
git remote add origin https://github.com/your-org/my-new-project.git
git push -u origin main
```

## Step 3: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Choose your org, name it, pick a region (US West for Pacific NW), set DB password
4. Wait for it to provision (~2 min)
5. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (optional, server-side only)

```bash
# Create your local env file
cp .env.example .env.local

# Paste the values into .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

## Step 4: Connect Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Link to Vercel (creates .vercel/ folder)
vercel link

# Or create a new Vercel project:
vercel

# Push env vars to Vercel so deploys work:
vercel env add NEXT_PUBLIC_SUPABASE_URL        # paste your URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY   # paste your anon key

# Optional: add service role key for server-side features
vercel env add SUPABASE_SERVICE_ROLE_KEY       # paste service role key

# Pull env vars back down (confirms everything is synced)
./ops.sh env-pull
```

### Auto-deploy from GitHub

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New → Project**
3. Import your GitHub repo
4. Framework preset: **Next.js** (auto-detected)
5. Add the same env vars in the Vercel UI
6. Deploy: every push to `main` will auto-deploy

## Step 5: Install Dependencies & Run

```bash
./ops.sh install    # pnpm install
./ops.sh dev        # localhost:3000
```

Verify you see the starter page at http://localhost:3000.

## Step 6: Generate DB Types

After creating your first tables in Supabase:

```bash
./ops.sh gen-types
```

This writes `lib/supabase/database.types.ts`. All your SDK calls are now typed.

## Step 7: Run /bobi-stack

Open Claude Code in the project folder and run:

```
/bobi-stack
```

This auto-fills CLAUDE.md with real project data, configures ops.sh, and populates TODO.md.

## Step 8: Add shadcn/ui Components

```bash
# Add components you need (they go into components/ui/)
pnpm dlx shadcn@latest add button card input select dialog
pnpm dlx shadcn@latest add form label textarea toast
pnpm dlx shadcn@latest add table tabs dropdown-menu popover
```

## Step 9: Start Building

```
# Add your first query:
/new-query users id,name,email,role

# Add your first mutation:
/new-mutation create-user name:string email:string role:string

# Run tests to verify wiring:
./ops.sh test
```

---

## Claude Kickoff Prompt

Copy-paste this into your first Claude session for a new project:

```
I just created this project from the bobi-stack template. Help me set it up:

1. Update package.json name and ops.sh PROJECT_NAME to "[your-project-name]"
2. Initialize git and create a GitHub repo at [your-org]/[your-project-name]
3. I've already created a Supabase project. Here are my credentials:
   - URL: [paste URL]
   - Anon key: [paste key]
   Set up .env.local with these.
4. Link to Vercel and push env vars
5. Install deps and verify the dev server runs
6. Run /bobi-stack to fill in CLAUDE.md
```

---

## Quick Reference: What Goes Where

| Service | How to connect | Env var |
|---------|---------------|---------|
| Supabase | Dashboard → Settings → API | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Vercel | `vercel link` or Vercel dashboard | Auto via `vercel env add` |
| GitHub | `gh repo create` or github.com | Git remote |
| Domain | Vercel dashboard → Domains | N/A |

## Checklist

- [ ] Folder copied and renamed
- [ ] `package.json` name updated
- [ ] `ops.sh` PROJECT_NAME updated
- [ ] Git initialized + pushed to GitHub
- [ ] Supabase project created
- [ ] `.env.local` has Supabase credentials
- [ ] Vercel linked + env vars pushed
- [ ] `./ops.sh install` runs clean
- [ ] `./ops.sh dev` shows starter page
- [ ] `/bobi-stack` run to fill CLAUDE.md
- [ ] First table created in Supabase
- [ ] `./ops.sh gen-types` generates types
- [ ] First query/mutation scaffolded
- [ ] `./ops.sh test` passes
