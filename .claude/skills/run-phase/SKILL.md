---
name: run-phase
description: Orchestrate a whole phase of docs/PLAN.md — delegate each task to a subagent, commit per task on a phase branch, and stop for the user on any open question.
disable-model-invocation: true
argument-hint: "[phase number, e.g. 10]"
---

Run all of phase **$ARGUMENTS** from `docs/PLAN.md`.

## 1. You are the orchestrator

You **do not implement tasks yourself.** You select, delegate, verify, commit, and report.
Writing task code in this session defeats the point — each task gets a clean context.

## 2. List the work, then wait

Read `docs/PLAN.md`. List every `[ ]` task in phase $ARGUMENTS in dependency order, with
its Goal and Commit message. Flag any task blocked by an unmet dependency outside the phase.

**Wait for the user's go.** Do not start.

## 3. Branch

Work on `phase-$ARGUMENTS`. Create it from the current branch if it does not exist.

## 4. Per task

Mark the task `[~]` in `docs/PLAN.md`, then delegate to a subagent with:

- the task's full text — Goal, Files, Depends, Commit,
- `docs/CODING_STYLE.md` and `docs/PRODUCT_RULES.md` as required reading,
- any `design/*.png` the task references,
- the **Definition of Done** from `docs/PLAN.md`.

Instruct the subagent to: implement the task; run `npm run typecheck` and `npm run lint`
until both are clean; run the **design-reviewer** subagent when the task references a
design, and fix real differences. It must return:

1. the files it changed,
2. the Definition of Done walked item by item, each with evidence,
3. any open question.

## 5. Stop on anything unresolved

Stop and ask the user — do not guess — when:

- the subagent returns an open product or design question,
- `typecheck` or `lint` will not come clean,
- the task's Files list does not survive contact with the code,
- the design-reviewer reports the app or backend is not running.

## 6. Otherwise, close the task

Mark it `[x]`. Add an **Outcome:** line under it if a decision was made that the plan did
not specify. Commit with the task's own **Commit** message — one commit per task, nothing
batched.

## 7. Final report

One entry per task:

- commit hash,
- what changed, in a sentence,
- **what the user should check visually** — the route to open and what to look at.

End with anything deferred or left open.
