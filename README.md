# My Project

> Built with the The prior template template — Next.js + Supabase + TanStack Query + shadcn/ui

## Quick Start

```bash
cp .env.example .env.local    # Add your Supabase credentials
./ops.sh install               # Install dependencies
./ops.sh dev                   # Start dev server at localhost:3000
```

## Project CLI

All operations go through `ops.sh`:

```bash
./ops.sh dev          # Dev server
./ops.sh build        # Production build
./ops.sh check        # Lint + typecheck
./ops.sh test         # Run tests
./ops.sh deploy       # Deploy to Vercel
./ops.sh gen-types    # Regenerate Supabase DB types
./ops.sh help         # See all commands
```

## Adding Data

```bash
# Add a new query (read):
/new-query items id,name,status

# Add a new mutation (write):
/new-mutation create-item name:string status:string
```

See [CLAUDE.md](CLAUDE.md) for full architecture documentation.
