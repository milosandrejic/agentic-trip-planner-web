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
- `/next-task` — implement a single task, stop before committing for review.
- `/run-phase` — a whole phase, one commit per task on a phase branch named after the phase.
- Never commit before `npm run typecheck && npm run lint` both pass.
- **Never commit without explicit approval.** Present the work and wait; approval for one
  step does not carry to the next.

## Branching

- **Never work directly on `main`.** Each sprint gets its own branch, named after the sprint
  with no `sprint-`/number prefix (e.g. `polish-hygiene` — the number lives only in the
  plan's filename, `docs/plans/sprint-02-polish-hygiene.md`). Check it out before `/run-phase`.
- Phase branches (`phase-<phase-name>`, e.g. `phase-codebase-hygiene`) nest inside the sprint
  branch and PR into it. The sprint branch PRs into `main` when the sprint closes — that PR is
  where `PLAN.md` is archived and the next sprint's `PLAN.md` is written.
- **Never push while `main` is checked out** — verify the current branch before every push,
  regardless of what the settings allow; deny rules match command text and a bare `git push`
  can slip past them. Push and `gh pr create` each require explicit approval in the moment —
  use `/open-pr <target-branch>` rather than pushing by hand.
- **Never force-push.** Nothing in this workflow rewrites pushed history — every push is a
  fresh branch's first push. Force push has no legitimate use here; if one is ever genuinely
  needed, that's a deliberate one-off you run yourself, not something a skill reaches for.

## Commits

- Conventional commit subject, one short line. That is normally the whole message.
- **Never add a `Co-Authored-By` trailer or any attribution footer.**
- Add a body only when a reviewer genuinely cannot follow the change without it. Never paste
  file contents, command output, environment values, tokens or absolute paths into a commit
  message — it is a permanent, shareable record.
