---
name: close-sprint
description: Archive the finished sprint's docs/PLAN.md, reset it to the placeholder, and propose (never open) a PR from the sprint branch into main.
disable-model-invocation: true
---

## 1. Require the sprint branch, clean

Current branch must be the sprint branch — its name is `docs/PLAN.md`'s header, kebab-cased,
no prefix, the same derivation `/run-phase` and `/next-task` use. Not `main`, not a
`phase-*` branch. `git status --porcelain` must be empty. Otherwise say what's wrong and stop.

## 2. Every task accounted for

Every task in every phase in `docs/PLAN.md` must be `[x]`, or explicitly moved into the
Deferred section. List anything that's neither and stop — don't guess whether an unfinished
task should be deferred.

## 3. Verify

Run `npm run typecheck`, `npm run lint`, then `npx next build`.

- **typecheck or lint fail:** stop. These are real problems — report them and don't proceed.
- **`next build` fails for an environment reason** (can't reach the network, can't fetch a
  font, no backend to talk to — nothing about the code itself): report it as **unverified**,
  with the reason, and continue. Don't block the sprint close on something this skill can't
  fix.
- **`next build` fails any other way:** treat it like a typecheck/lint failure — stop.

## 4. Archive the plan

`git mv docs/PLAN.md docs/plans/sprint-NN-<branch-name>.md` (zero-padded sprint number, e.g.
`sprint-03-<branch-name>.md`) — `git mv` first, so the file's history follows it, then edit
its content in the new location:

- Title becomes `# Sprint N — <Title> (archived)`.
- Add an **Archived** callout: this sprint is closed, `docs/PLAN.md` is where the current
  sprint lives now, and durable rules that outlived this sprint are in `docs/PRODUCT_RULES.md`
  / `docs/CODING_STYLE.md`.
- Keep the sprint's own approach/stack description, past-tensed since it's now done.
- Replace **Architecture Principles** with a one-line pointer: "Governed this sprint; still
  governs. Current copy: `docs/PLAN.md`."
- Keep the **Product rules** pointer verbatim — it's already sprint-agnostic.
- Trim the **Legend** to just the status marks — drop the step/phase-mode workflow bullets;
  those live in `CLAUDE.md` and the skills now, not in a per-sprint copy.
- Keep every phase verbatim, exactly as written, with whatever structure the sprint actually
  used (a Sprint 1-style `# Part` grouping isn't required if the sprint didn't have one).
- No Deferred / Definition of Done / Sprint history sections in the archive — those belong
  in the live `docs/PLAN.md`, not duplicated here.

Match `docs/plans/sprint-01-mvp.md`'s structure for this — it's the reference for what an
archived sprint plan looks like.

## 5. Reset `docs/PLAN.md` to the placeholder

Write a fresh `docs/PLAN.md`:

```
# No active sprint

Run `/start-sprint <title>` on `main` to begin the next sprint.
```

Then, unchanged from the sprint that just closed: **Architecture Principles** (full text,
not the archive's pointer), the **Product rules** pointer, the full **Legend**, **Deferred**,
and **Definition of Done**. In **Sprint history**, add a line for the sprint that just
closed, matching the existing entry style — `- **Sprint N — Title**
(\`docs/plans/sprint-NN-<branch-name>.md\`): Phase <range>, done.`

## 6. Confirm, then commit

Show the archived file and the new placeholder. **Wait for approval.** Then commit both
together as `docs: close sprint N — <title>`.

## 7. Propose the PR — never open it

Sprint branch into `main`. Title: the sprint's theme. Description: one line per phase, plus
anything that was moved to Deferred. No attribution of any kind. This is text to hand the
user — **never push, never run `gh pr create`.** Pushing and PRs are always manual.

## 8. Stop there

Don't plan, write, or scaffold anything for the next sprint. That's `/start-sprint`'s job,
run separately, later.
