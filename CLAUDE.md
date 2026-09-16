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
- `/run-phase` — a whole phase, one commit per task on a phase branch.
- Never commit before `npm run typecheck && npm run lint` both pass.
- **Never commit without explicit approval.** Present the work and wait; approval for one
  step does not carry to the next.

## Commits

- Conventional commit subject, one short line. That is normally the whole message.
- **Never add a `Co-Authored-By` trailer or any attribution footer.**
- Add a body only when a reviewer genuinely cannot follow the change without it. Never paste
  file contents, command output, environment values, tokens or absolute paths into a commit
  message — it is a permanent, shareable record.
