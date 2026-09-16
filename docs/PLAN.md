# Sprint 2 — Polish & Hygiene (agentic-trip-planner-web)

> The MVP shipped in Sprint 1 (`docs/plans/sprint-01-mvp.md`, Phases 1–9, all done). This
> sprint has two phases with no dependency between them: **Phase 10** is the polish and
> motion pass the MVP deferred; **Phase 11** is codebase hygiene found during the Claude
> Code setup review and can run first.
>
> **Stack:** Next.js (App Router) · TypeScript (strict) · Material UI · Axios · React Query
> (TanStack) · React Hook Form · Zod · Google Maps. Auth = JWT bearer, stored client-side.

---

## Architecture Principles

These rules govern every task in this plan. When a decision is ambiguous, prefer the option that best satisfies these principles and stays consistent with the existing project.

- **Presentation-focused components.** UI components render props and emit events; they do not fetch, transform, or own business logic.
- **Logic lives in hooks and services.** Business logic belongs in custom hooks (orchestration/state) and services (I/O); keep it out of components.
- **API access only through the service layer.** Components and hooks never call Axios directly — all HTTP goes through `src/services/*`.
- **React Query owns all server state.** No server data in `useState`/`useEffect`; caching, loading, and error states come from React Query.
- **Forms use React Hook Form + Zod.** Validation schemas live next to the form; never hand-roll field validation in components.
- **Composition over inheritance.** Build behavior by composing small components/hooks, not deep prop drilling or class hierarchies.
- **Reuse before creating.** Search for an existing component, hook, service, util, or type before adding a new one.
- **Keep components as stateless as reasonable.** Lift shared/derived state into hooks or context; prefer stateless presentational units.
- **Follow the existing project structure.** Place files in the established folders (`api, assets, components, config, constants, context, hooks, layouts, services, theme, types, utils`, plus `app/` for routing); no new top-level folders.
- **No speculative abstractions.** Introduce an abstraction only when it removes real duplication or provides clear value now — not for hypothetical futures.

---

## Product rules

Product framing, known gaps and the design ↔ API reconciliations live in
`docs/PRODUCT_RULES.md`. They are durable rules, not tasks, and govern every task here.

---

## Legend

- `[ ]` not started · `[~]` in progress · `[x]` done
- Each task lists: **Goal**, **Files** (primary paths under `src/`), **Depends**, **Commit** (suggested message).
- `🔒` = requires the OpenAPI-backed API layer.
- **Two ways to work a task:**
  - **Step mode** (`/next-task`): one task, stop before committing for review.
  - **Phase mode** (`/run-phase`): one commit per task on a phase branch; review happens commit by commit afterwards.
- **Outcome line.** When implementing a task involves a decision the plan didn't specify, add
  an **Outcome:** line under the task recording what was chosen and why (see 1.2 and 9.3 in
  `docs/plans/sprint-01-mvp.md` for the pattern).

---

## Phase 10 — Polish, Motion & Responsiveness

> The brief: *empty states, new conversations, animation — everything must feel nice and fluent.*
> Treat this as product work, not a cleanup pass.
>
> **The governing rule: the user must never feel stuck.** Every action acknowledges itself
> immediately, every wait says what it is waiting for, and nothing that is working looks broken.
> Planning turns run synchronously for up to 120 s, so this is the difference between the product
> feeling deliberate and feeling hung.

- [ ] **10.1 Starting a trip — from anywhere**
  - **Goal:** Starting a new trip is currently broken in two places and missing in a third.
    - **The landing send button looks disabled when it is not.** Its background is a fixed pale
      grey in both states and only opacity changes, so an enabled button still reads as dead.
      Give the enabled state a real affordance.
    - **"New Trip" in the sidebar has no handler** and does nothing at all.
    - **There is no way to start a trip from inside the workspace.** "New Trip" should open a
      composer dialog — the same prompt and suggestion chips as the landing hero — run the
      create, and navigate to the new thread when it lands.
  - **The wait is the hard part.** `POST /trips` is a synchronous request of up to 120 s. Reuse
    `PlanningProgress` so the dialog narrates what is happening; the user must never be looking
    at a frozen screen with no explanation. Disable submit for the duration and surface a
    failure without losing what they typed.
  - **Files:** `src/components/landing/prompt-box.tsx`,
    `src/components/workspace/sidebar/workspace-sidebar.tsx`,
    `src/components/dialogs/new-trip-dialog.tsx`, `src/components/dialogs/dialog-registry.tsx`,
    `src/constants/landing.ts`.
  - **Depends:** Phase 9
  - **Commit:** `feat(workspace): start a trip from the workspace and fix the landing CTA`

- [ ] **10.2 Empty states and the new-conversation experience**
  - **Goal:** Every zero state earns its screen. `/trips` with no trips at all (first-run) differs
    from `/trips` with trips but none selected. A brand-new thread should invite a first message with
    suggestions, the way the landing prompt does — not show an empty transcript. Cover: no flights, no hotels,
    no mapped places, no weather (the common case, not an edge), no activity prices, no
    `estimated_spend_eur`, a thread whose trip has not completed its first turn, and a failed thread.
    Per *Known gaps* in PRODUCT_RULES.md, absent data omits its element — the screen must still look composed with the
    sparsest realistic payload, which is what most trips will be.
  - **Files:** `src/app/trips/page.tsx`, `src/components/workspace/chat/*`,
    `src/components/workspace/**/empty-*`.
  - **Depends:** 10.1
  - **Commit:** `feat(ux): add empty states and a new-conversation experience`

- [ ] **10.3 Loading and skeletons**
  - **Goal:** Skeletons that match the shape of what is loading — trip cards, summary cards, the
    timeline, the transcript — so nothing jumps on arrival. Route error boundaries and a not-found
    page.
  - **Files:** `src/app/error.tsx`, `src/app/not-found.tsx`, `src/components/**/skeletons`.
  - **Depends:** Phase 9
  - **Commit:** `feat(ux): add skeletons and route error states`

- [ ] **10.4 Motion and the planning wait**
  - **Goal:** Make it feel fluent. Consistent transitions for dialogs, accordions, message arrival
    and panel changes, on one easing/duration scale in the theme. The centrepiece is the **≤120 s
    synchronous turn**: a staged progress narrative ("Searching flights… Comparing hotels… Building
    your day plan…") rather than a spinner, since the user is otherwise staring at nothing for two
    minutes. All of it behind `prefers-reduced-motion`.
  - **Files:** `src/theme/motion.ts`, `src/components/workspace/chat/*`, dialogs.
  - **Depends:** 10.1 (9.10 shipped in Sprint 1, `docs/plans/sprint-01-mvp.md`)
  - **Commit:** `feat(ux): add a motion scale and a staged planning wait`

- [ ] **10.5 Responsive workspace**
  - **Goal:** Collapse the 3-column shell to stacked panels / drawers on tablet and mobile; verify
    the landing page and every dialog at small widths.
  - **Files:** `src/layouts/workspace-layout/`, landing components, dialogs.
  - **Depends:** Phase 9
  - **Commit:** `feat(responsive): adapt workspace and landing for mobile`

- [ ] **10.6 Accessibility**
  - **Goal:** Focus management and return-focus in dialogs, ARIA labels, keyboard navigation through
    the timeline and trip list, visible focus rings, and reduced-motion honoured throughout.
  - **Files:** across dialogs and interactive components.
  - **Depends:** 10.3
  - **Commit:** `feat(a11y): improve focus, aria and keyboard support`

- [ ] **10.7 Final consistency pass**
  - **Goal:** Audit against `CODING_STYLE.md` (imports, JSX formatting, named exports, no `any`),
    remove dead code, refresh `README.md` with setup and run instructions.
  - **Files:** repo-wide, `README.md`.
  - **Depends:** all
  - **Commit:** `chore: final consistency pass and readme`

---

## Phase 11 — Codebase hygiene

> Found during the Claude Code setup review (`docs/CODING_STYLE.md` vs. the actual code).
> No dependency on Phase 10 or on each other — this phase can run before, after, or
> interleaved with it.

- [ ] **11.1 Replace hardcoded colors with theme tokens**
  - **Goal:** `docs/CODING_STYLE.md` says "avoid hardcoded colors"; 192 occurrences across 37
    files use a literal `rgba()`/hex inside `sx`, worst in `product-preview.tsx` (36) and
    `hero.tsx` (13). Replace with `brandColors` / theme tokens (`src/theme/palette.ts`)
    already used elsewhere in the app. No visual change — same colors, sourced from the theme.
  - **Files:** `src/components/**/*.tsx` (see the setup-review conflicts list for the full
    file set), `src/theme/palette.ts` if a used color has no existing token.
  - **Depends:** —
  - **Commit:** `refactor(ui): replace hardcoded colors with theme tokens`

- [ ] **11.2 One named import per line**
  - **Goal:** `docs/CODING_STYLE.md` says each named import gets its own line; ESLint only
    enforces that the braces break onto their own lines, not one name per line, so 11 files
    have multiple names on one interior line (e.g. `workspace-sidebar.tsx`:
    `Box, Button, Typography,`). Reformat to one name per line.
  - **Files:** `src/components/workspace/sidebar/workspace-sidebar.tsx`,
    `src/components/landing/final-cta.tsx`, `src/components/landing/hero.tsx`,
    `src/components/landing/how-it-works.tsx`, `src/components/landing/product-preview.tsx`,
    `src/components/landing/stats.tsx`, `src/components/landing/testimonials.tsx`,
    `src/components/landing/feature-grid.tsx`,
    `src/components/workspace/chat/clarification-message.tsx`,
    `src/components/workspace/chat/message-bubble.tsx`,
    `src/components/workspace/chat/message-list.tsx`.
  - **Depends:** —
  - **Commit:** `style: one named import per line`

- [ ] **11.3 Remove dead ESLint import groups**
  - **Goal:** `eslint.config.mjs`'s `perfectionist/sort-imports` `customGroups` define
    `custom-auth` (`@/auth/*`), `custom-routes` (`@/routes/*`) and `custom-sections`
    (`@/sections/*`) — none of these folders exist in `src/`. Remove the three dead groups
    (and their entries in the `groups` order array) so the config matches the real tree.
  - **Files:** `eslint.config.mjs`.
  - **Depends:** —
  - **Commit:** `chore: remove dead eslint import groups`

- [ ] **11.4 Fix stale code comments**
  - **Goal:** `src/app/trips/[threadId]/page.tsx` labels the regenerate-via-follow-up-message
    comment "Gap #9" — that reconciliation is `docs/PRODUCT_RULES.md` entry **4** ("Regenerate
    sends a follow-up..."); entry 9 is the synchronous-turn/409 one. Fix the reference.
  - **Files:** `src/app/trips/[threadId]/page.tsx`.
  - **Depends:** —
  - **Commit:** `docs: fix stale reconciliation reference in a code comment`

---

## Deferred / future (not in this plan)

- **Hotel amenities** — no such field exists and none is planned.
- **In-app booking and real ticket pricing** — we link out to searches; see *Product framing* in PRODUCT_RULES.md.
- PDF export backend integration (UX shipped in 8.5).
- Share endpoint (copy-link UX shipped in 8.6).
- Profile editing / Settings page — API exposes read-only `GET /me`; no update endpoint.
- Logout is client-side only (no server session to revoke).

---

## Definition of Done

A task is complete only when **all** of the following hold:

- [ ] Follows `docs/CODING_STYLE.md` (file naming, named exports, import + JSX formatting, no `any`).
- [ ] Respects the Architecture Principles above (logic in hooks/services, API only via services, React Query for server state).
- [ ] Builds successfully (`next build`).
- [ ] `npm run typecheck` passes (strict).
- [ ] No ESLint warnings or errors (`npm run lint`).
- [ ] Matches the corresponding Figma screen in `/design`.
- [ ] Responsive where applicable.
- [ ] Reuses existing components/hooks/services/utils/types instead of duplicating them.
- [ ] Nullable API fields are handled as genuinely optional (older trips are snapshots).
- [ ] Absent data omits its element — never "N/A", "€0", an empty panel or a placeholder icon.
- [ ] Verified against a sparse payload, not only a fully-populated one.
- [ ] Estimates are labelled as estimates and outbound links read as searches, not bookings.
- [ ] Scoped to a single logical commit, reviewed in step mode or phase mode as the Legend describes.

---

## Sprint history

- **Sprint 1 — MVP** (`docs/plans/sprint-01-mvp.md`): Phases 1–9, done.
