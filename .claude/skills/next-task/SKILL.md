---
name: next-task
description: Implement one task from docs/PLAN.md — plan, get approval, implement, verify, report against the Definition of Done, and stop before committing.
disable-model-invocation: true
argument-hint: "[task number, e.g. 10.2 — omit to take the next ready task]"
---

Implement exactly **one** task from `docs/PLAN.md`. Stop before committing.

## 1. Not `main`

If the current branch is `main`, point to `/start-sprint` and stop. (Full branch validation
happens in step 2, once the task — and so its phase — is known.)

## 2. Select the task, then confirm the branch

Read `docs/PLAN.md`. Take task **$ARGUMENTS** if given; otherwise take the first `[ ]` task
whose **Depends** are all `[x]`. If a dependency is unmet, say which and stop.

Now validate the branch: derive the sprint branch (`docs/PLAN.md`'s header, kebab-cased, no
prefix) and this task's own phase branch (its phase heading, kebab-cased the same way `/run-
phase` does — e.g. task 10.1 needs `phase-polish-motion-responsiveness`, not just any
`phase-*` branch). The current branch must be one of those two. If it's neither — including
a phase branch for a *different* phase — say which two branches would work and stop.

State the task number, its Goal, and its Commit message before going further.

## 3. Read only what the task needs

- The task's own **Files** list — those paths only.
- Any `design/*.png` the task references.
- The parts of `docs/PRODUCT_RULES.md` that bear on it (prices, links, absent data).
- `docs/API.md` for any field you touch. Never invent an endpoint, field or shape.

Do not read the whole codebase. If the Files list is wrong or incomplete, say so.

## 4. Plan, then wait

Present a short plan: what changes in each file, and any decision the task does not settle.
**Wait for approval.** Do not write code yet.

## 5. Implement

Mark the task `[~]` in `docs/PLAN.md`, then implement it. Stay inside the task's scope —
anything else you notice goes in the report, not the diff.

## 6. Verify

Run `npm run typecheck`, `npm run lint`, and `npx next build`. Fix and re-run typecheck/lint
until both are clean. For the build: a failure for an environment reason (no network, can't
fetch a font, no backend) is reported as unverified with the reason, not treated as failing;
any other build failure is fixed like a typecheck/lint failure. Never report a task done on
failing checks.

## 7. Design check

If the task references a `design/*.png`, run the **design-reviewer** subagent against the
relevant route and that design. Fix real differences. If it reports the app or backend is
not running, say so — do not claim the design was verified.

## 8. Report

Walk the **Definition of Done** in `docs/PLAN.md` item by item, each with evidence:
command output, the design-reviewer result, or the specific line that satisfies it. Mark
anything you could not verify as unverified — never as passing.

## 9. Stop

**Do not commit yet.** Present:

- the files changed,
- the task's **Commit** message as the proposed message,
- an **Outcome:** line if you made a decision the plan did not specify — a one-line record
  of what you chose and why, to sit under the task (see `docs/PLAN.md`'s Legend, or 1.2 /
  9.3 in `docs/plans/sprint-01-mvp.md`, for the pattern).

Then wait. **Once the user approves: tick the task to `[x]`, add the Outcome line if there
is one, and commit — all three in that order, landing in the one commit.** Approval covers
exactly this one task; it doesn't carry to the next.
