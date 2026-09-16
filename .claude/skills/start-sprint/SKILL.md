---
name: start-sprint
description: Create the sprint branch for docs/PLAN.md and, if it's the placeholder, write the new sprint's header — the first step of a new sprint.
disable-model-invocation: true
argument-hint: "[sprint title]"
---

## 1. Require `main`, clean

Current branch must be `main` and `git status --porcelain` must be empty. Otherwise say
exactly what's wrong and stop — do not switch branches or stash anything yourself.

## 2. Sync with origin

`git fetch origin`. Compare `main` against `origin/main`:

- **Behind:** run `git pull --ff-only` (not on the allow list, so this asks for permission
  in the moment — that's expected).
- **Diverged:** stop and say so. Don't guess how to reconcile it.
- **Up to date or ahead:** continue.

## 3. Read `docs/PLAN.md` and classify it

- **Placeholder** (header `# No active sprint`): require `$ARGUMENTS` as the sprint title —
  if missing, ask for it and stop. The sprint number is one more than the highest number
  found in `docs/plans/sprint-*.md` (zero-padded, e.g. `sprint-02-...` → next is 3).
- **A sprint with every task `[ ]`**: a plan already written but not yet started. Use its
  own title and number from the `# Sprint N — Title` header. Ignore `$ARGUMENTS` — the plan
  already says what this sprint is.
- **Anything else** (any task `[~]` or `[x]`): the previous sprint was never closed. Say so,
  name the file and its state, and stop. Don't touch it.

## 4. Derive and check the branch name

Kebab-case the title with no `sprint-`/number prefix (e.g. "Polish & Hygiene" →
`polish-hygiene`). Check both locations:

- `git branch --list <name>`
- `git ls-remote --heads origin <name>` (fetch already ran in step 2)

If it exists in either place, say where and stop.

## 5. Confirm, then branch

Show the sprint number, title, and derived branch name. **Wait for confirmation** before
touching anything. Then `git checkout -b <name>`.

## 6. Write the header, if this came from the placeholder

Only when `docs/PLAN.md` was the placeholder (case 1 above): replace the `# No active
sprint` header and the "Run `/start-sprint`..." line with `# Sprint N — <Title>`. Keep
every other section exactly as it was — Architecture Principles, Product rules pointer,
Legend, Deferred, Definition of Done, Sprint history — verbatim, not rewritten. Commit as
`docs: start sprint N — <title>`.

If `docs/PLAN.md` was already a written plan (case 2), there's nothing to edit or commit
here — its header already matches.

## 7. Report the next step

- **No phases yet in the plan:** plan them now, in plan mode, on this branch, using the
  existing task format (Goal, Files, Depends, Commit). Commit the finished plan before any
  task work starts — nothing gets implemented against an uncommitted plan.
- **Phases already exist:** point to `/run-phase <n>` or `/next-task`.
