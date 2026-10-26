<!-- When prompted, complete tasks from the list below.
     Before starting work, mark the item as pending [~] so parallel agents don't collide. -->

## Backlog: Setup

- [ ] Run /bobi-stack to auto-fill CLAUDE.md with real project data
- [ ] Create Supabase project and add env vars to .env.local
- [ ] Run ./ops.sh gen-types to generate database types
- [ ] Add first query with /new-query
- [ ] Add first mutation with /new-mutation
- [ ] Set up Vercel project and deploy preview
- [ ] Configure RLS policies in Supabase

## Backlog: Features

- [ ] **Data-sync rule for the stack's conventions:** a field the upstream source may fill in or change later never belongs in a dedupe or identity key. A sync that skips rows "by key" will double-count when the source back-fills that field. Add this to the data-layer skill, with a test that replays a back-filled row.

- [ ] Replace this with your first real task
