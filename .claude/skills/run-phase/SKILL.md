---
name: run-phase
description: Orchestrate a whole phase of docs/PLAN.md — delegate each task to a subagent, run design-reviewer itself, commit per task on a phase branch named after the phase, and stop for the user on any open question.
disable-model-invocation: true
argument-hint: "[phase number, e.g. 10 — the branch it creates is named after the phase, not the number]"
---

Run all of phase **$ARGUMENTS** from `docs/PLAN.md`.

## 1. You are the orchestrator

You **do not implement tasks yourself.** You select, delegate, verify, commit, and report.
Writing task code in this session defeats the point — each task gets a clean context. You
also run **design-reviewer** yourself — it's never delegated to the implementing subagent
(see step 5).

## 2. Require the sprint branch, clean

Before reading task lists or doing anything else: read `docs/PLAN.md`'s header
(`# Sprint N — Title`) and derive its branch name (kebab-cased title, no prefix). The
current branch must match it exactly.

- **On `main`:** point to `/start-sprint` and stop.
- **On anything else that isn't the sprint branch** (including a stale `phase-*` branch from
  a different run): say what the sprint branch should be and stop.
- **Uncommitted changes** (`git status --porcelain` non-empty — e.g. a plan `/start-sprint`
  wrote but never got committed): say so and ask the user to commit first. Don't start on an
  uncommitted plan.

## 3. List the work, then wait

List every `[ ]` task in phase $ARGUMENTS in dependency order, with its Goal and Commit
message. Flag any task blocked by an unmet dependency outside the phase.

**Wait for the user's go.** Do not start.

## 4. Branch

Derive the phase branch name from the phase's own title, not its number: read the phase
heading (`## Phase $ARGUMENTS — <Title>`) and kebab-case `<Title>` — e.g. Phase 10, "Polish,
Motion & Responsiveness", becomes `phase-polish-motion-responsiveness`. Create it from the
current (sprint) branch if it does not exist; reuse it if it does.

## 5. Per task

Mark the task `[~]` in `docs/PLAN.md`, then delegate to an **implementing subagent** with:

- the task's full text — Goal, Files, Depends, Commit,
- `docs/CODING_STYLE.md` and `docs/PRODUCT_RULES.md` as required reading,
- any `design/*.png` the task references,
- the **Definition of Done** from `docs/PLAN.md`.

The implementing subagent's job is to implement the task and run `npm run typecheck` and
`npm run lint` until both are clean — **not** to run design-reviewer itself. It returns:

1. the files it changed,
2. the Definition of Done walked item by item, each with evidence,
3. any open question.

**Design review is yours to run, not the subagent's.** When the task references a design:

1. Run **design-reviewer** yourself against the relevant route and design.
2. If it reports real differences, delegate a **new** implementing subagent with the task
   text plus the reviewer's report, asking it to fix exactly those differences. Then run
   design-reviewer again.
3. After **two rounds** still showing real differences, stop and ask the user — don't keep
   looping on your own judgment of what "real" means past that point.

## 6. Stop on anything unresolved

Stop and ask the user — do not guess — when:

- the subagent returns an open product or design question,
- `typecheck` or `lint` will not come clean,
- the task's Files list does not survive contact with the code,
- design-reviewer reports the app or backend is not running,
- two design-review rounds still show real differences (step 5).

## 7. Otherwise, close the task

Mark it `[x]` in `docs/PLAN.md`. Add an **Outcome:** line under it if a decision was made
that the plan did not specify. **Run `npm run typecheck` and `npm run lint` yourself** —
don't rely solely on the implementing subagent's report; the guard-commit hook enforces this
too, but the orchestrator checks first rather than finding out from a blocked commit. Then
commit with the task's own **Commit** message — one commit per task, nothing batched, the
`[x]`/Outcome edit landing in the same commit as the code.

## 8. Before the final report

Once every task in the phase is closed, run `npx next build` once.

- **Fails for an environment reason** (no network, can't fetch a font, no backend) — report
  it as unverified with the reason, don't block on it.
- **Fails any other way** — treat it like a failing typecheck/lint: stop and ask.

## 9. Final report

One entry per task:

- commit hash,
- what changed, in a sentence,
- **what the user should check visually** — the route to open and what to look at.

End with anything deferred or left open, then propose a PR for merging this phase branch
into the sprint branch:

- **Title:** the phase's own theme, not a copy of one task's commit subject.
- **Description:** one line per task (not a wall of prose), plus anything deferred or left
  open. Same rule as commit messages — no `Co-Authored-By` or attribution footer of any kind.

This skill never pushes or opens a PR itself — pushing and merging are always manual, done
by the user once every task is committed. The proposal above is only text to hand them.
