@AGENTS.md

**Stack:** Next.js 16 (App Router) · TypeScript strict · Material UI · Axios · React Query
· React Hook Form + Zod · Google Maps. Auth is a JWT bearer token stored client-side.

## Commands

- `npm run dev` — serves on **:8003**, expects the API on **:8000** (`NEXT_PUBLIC_API_BASE_URL`)
- `npm run typecheck` — `next typegen && tsc --noEmit`
- `npm run lint` · `npm run lint:fix` — runs `--max-warnings=0`, so a warning fails like an error

## Architecture — non-negotiable

- HTTP lives **only** in `src/services/*`, always through the client in `src/api/axios.ts`.
  Components and hooks never call Axios directly.
- Server state lives **only** in React Query hooks under `src/hooks/*`. Never in
  `useState`/`useEffect`.
- **Reuse before creating** — search for an existing component, hook, service, util or type first.
- **No new top-level folders** under `src/`.

## Docs

| Read | When |
|---|---|
| `docs/API.md` | Any data work. **Authoritative** — never invent an endpoint, field or shape. |
| `docs/PRODUCT_RULES.md` | Any UI showing prices, links, weather, or data that may be absent. |
| `docs/CODING_STYLE.md` | Writing any new file. Conventions ESLint cannot check. |
| `docs/PLAN.md` | The current sprint's tasks. Archived to `docs/plans/` when the sprint closes. |
| `design/*.png` | Source of truth for UI — match it. |

## Product essentials

- We present **recommendations, not bookings**. Label actions "Find" / "View options" —
  never "Book". Prices are indicative, never quoted.
- Every nullable field in `API.md` is genuinely optional: itineraries are stored snapshots,
  so older trips return null for fields that look like they should always be there.
- **Absent data omits its element.** Never "N/A", "€0", an empty panel or a placeholder icon.
- Every price is per party except `Activity.price_eur`, which is per person.

## Workflow

- One task per session — `/clear` between tasks.
- `/start-sprint <title>` — create the sprint branch; phases get planned on it, in plan
  mode, and committed before any task work starts.
- `/next-task` — step mode: one task, never commits without explicit approval, and that
  approval covers only this one task.
- `/run-phase` — phase mode: one commit per task on a phase branch. One go on the task list
  covers every task's commit in that phase — nothing beyond it.
- `/close-sprint` — archive the finished sprint's plan and reset the placeholder.
- Never commit before `npm run typecheck && npm run lint` both pass — the guard-commit hook
  enforces this, the no-attribution-trailer rule, and the push ban itself, so a blocked
  commit or push is expected behaviour, not a bug.

## Branching

- **Never work directly on `main`.** `/start-sprint <title>` on `main` creates the sprint
  branch — named after the sprint with no `sprint-`/number prefix (e.g. `polish-hygiene`;
  the number lives only in the archive filename, `docs/plans/sprint-02-polish-hygiene.md`).
- Phase branches (`phase-<phase-name>`, e.g. `phase-codebase-hygiene`) branch off the sprint
  branch and PR into it.
- `/close-sprint` archives `docs/PLAN.md` and resets it to a placeholder once every task is
  `[x]` or explicitly deferred. The sprint branch then PRs into `main`.
- **Claude never pushes or opens a PR — that's always manual, done by the user.** `git push`
  and `gh pr create` are denied in settings; commit and stop there.

## Commits

- Conventional commit subject, one short line. That is normally the whole message.
- **Never add a `Co-Authored-By` trailer or any attribution footer.**
- Add a body only when a reviewer genuinely cannot follow the change without it. Never paste
  file contents, command output, environment values, tokens or absolute paths into a commit
  message — it is a permanent, shareable record.
