---
name: {{topic}} current state
description: {{short description of what this file tracks}}
type: project
---

<!--
  Template: rename to project_<topic>.md and fill in. Delete if not applicable.

  Use for current-state information that doesn't belong in committed docs because it
  changes too often (DB row counts as-of-a-date, active batch IDs, decisions not yet
  written up, blockers with specific reasons).

  Things that DO belong in committed docs (not here): architecture, conventions,
  scope documents, finished feature descriptions.
-->

## Current state (as of {{YYYY-MM-DD}})

<!-- Snapshot of relevant state. Update timestamp when refreshing. -->

- {{fact 1}}
- {{fact 2}}

## Known gaps

<!-- Specific things that are missing + why. -->

- {{gap}}, blocked on {{who/what}}

## Decisions made + not yet documented

<!-- Things that got decided in a call or chat but haven't landed in a committed doc yet. Move to docs/ when written up properly. -->

- {{decision}}

## Fixes applied

<!-- Changes that happened between formal doc updates. Useful for future debugging. -->

- {{change}} ({{commit SHA if applicable}})
