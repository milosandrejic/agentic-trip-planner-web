# Plan — Frontend (agentic-trip-planner-web)

> **Approach:** Build a production-grade Next.js (App Router) frontend for the AI Travel Planner,
> matching the exported Figma screens in `/design` and the conventions in `docs/CODING_STYLE.md`
> exactly. Work proceeds **one task at a time**: each task has a clear goal, a bounded set of
> files, explicit dependencies, and is sized for a single reviewable Git commit. After each task
> we **stop, review, adjust, then commit** before moving on. The API layer is wired strictly
> against `docs/API.md` — no endpoints are invented. Where the design shows data the API does not
> expose, the gap is documented (see *Design ↔ API reconciliations*) and handled without new
> backend calls.

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

## Design ↔ API reconciliations (no endpoints invented)

This is the primary reference for interpreting the backend contract (`docs/API.md`). The design occasionally shows richer data than the API exposes; in every such case we derive from existing responses rather than invent endpoints.

1. **Activity time** is a bucket (`"Morning" | "Afternoon" | "Evening"`), not a clock time as the mockups suggest — render the bucket label.
2. **Budget** is not in the API. The budget panel is **estimated client-side** from `flights[].price` + `hotels[].total_price` + `activities[].price_eur`, labeled as an estimate.
3. **Weather** has no endpoint. The weather panel is **derived from** `day.weather_summary` strings (first few days); it is not a real multi-day forecast feed.
4. **Recent-trips list** (`GET /threads`) exposes only title, slug, status, timestamps — **no destination or thumbnail**. The sidebar shows title + status chip + date; thumbnails/destinations from the design are not available without per-thread fetches (out of scope, no new endpoint).
5. **Trip hero image** is not a field. Use the first hotel `photo_url` (direct URL) or first activity photo, with a static fallback.
6. **Activity photos** require `GET /places/photos/{ref}` (bearer-protected, 302). `<img>` can't send the token, so photos are fetched client-side into object URLs via `PlacePhoto`. Hotel `photo_url` is a plain URL and renders directly.
7. **Registration** needs `first_name` + `last_name`; the "Full name" field is split on submit.
8. **Status mapping** (trip → chip): `ready → Active`, `draft`/`generating → Planning`, `completed → Completed`, `archived → Archived`.
9. **Regenerate** sends a follow-up message via `POST /threads/{id}/messages`; there is no dedicated regenerate endpoint.

---

## Legend

- `[ ]` not started · `[~]` in progress · `[x]` done
- Each task lists: **Goal**, **Files** (primary paths under `src/`), **Depends**, **Commit** (suggested message).
- `🔒` = requires the OpenAPI-backed API layer (Phase 3).
- Every task = exactly one logical commit. Do **not** start the next task before the current one is reviewed and committed.

---

# Part A — Foundation

## Phase 1 — Project Setup

- [x] **1.1 Scaffold Next.js App Router + TypeScript (strict)**
  - **Goal:** Bootstrap the app with strict TS, `@/*` → `src/*` path alias, and the folder skeleton from `CODING_STYLE.md` (`api, assets, components, config, constants, context, hooks, layouts, services, theme, types, utils`) plus `app/` for routing.
  - **Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx` (placeholder), folder `.gitkeep`s.
  - **Depends:** —
  - **Commit:** `chore: scaffold next.js app router + typescript strict`

- [x] **1.2 Lint / format / editor config**
  - **Goal:** Enforce the style guide: ESLint (Next + TS), Prettier matching the JSX/import rules (kebab-case files, named exports, multiline imports), `.editorconfig`.
  - **Files:** `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `.editorconfig`.
  - **Depends:** 1.1
  - **Commit:** `chore: add eslint + prettier config per coding style`

- [x] **1.3 Environment & config module**
  - **Goal:** Typed runtime config for API base URL and Google Maps key; `.env.example` documenting required vars (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`). Never commit real secrets.
  - **Files:** `src/config/env.ts`, `.env.example`.
  - **Depends:** 1.1
  - **Commit:** `chore: add typed env config and .env.example`

- [x] **1.4 Install core dependencies + root providers skeleton**
  - **Goal:** Add MUI (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/lab`), React Query (+ devtools), Axios, React Hook Form, Zod, `@hookform/resolvers`, `dayjs`. Wire `CssBaseline`, a React Query provider, and a placeholder ThemeProvider into the root layout with the Emotion cache for the App Router. (Google Maps dep added in Phase 8.)
  - **Files:** `package.json`, `src/components/providers/app-providers.tsx`, `src/components/providers/emotion-cache.tsx`, `src/app/layout.tsx`.
  - **Depends:** 1.1
  - **Commit:** `chore: add core deps and root providers`

## Phase 2 — Theme & Layout

- [x] **2.1 Palette & design tokens**
  - **Goal:** Encode the design system: navy primary, teal secondary, warm-orange accent, off-white background, and status colors (Active / Planning / Completed / Archived).
  - **Files:** `src/theme/palette.ts`.
  - **Depends:** 1.4
  - **Commit:** `feat(theme): add palette and status color tokens`

- [x] **2.2 Typography, shape & spacing**
  - **Goal:** Font family + type scale matching the screens; border-radius and spacing tokens.
  - **Files:** `src/theme/typography.ts`, `src/theme/shape.ts`, `src/app/layout.tsx` (font wiring via `next/font`).
  - **Depends:** 2.1
  - **Commit:** `feat(theme): add typography, shape and spacing`

- [x] **2.3 Component overrides + theme assembly**
  - **Goal:** MUI overrides for Button, Card, Chip (status variants), Dialog, TextField, AppBar, Accordion; assemble `createTheme`.
  - **Files:** `src/theme/overrides/*`, `src/theme/index.ts`; replace placeholder ThemeProvider in `app-providers`.
  - **Depends:** 2.2
  - **Commit:** `feat(theme): add component overrides and assemble theme`

- [x] **2.4 Shared UI atoms**
  - **Goal:** Reusable primitives used across screens: `Logo`, `StatusChip` (maps trip/thread status → label + color), `SectionHeading`, an icon helper.
  - **Files:** `src/components/logo/`, `src/components/status-chip/`, `src/components/section-heading/`, `src/components/iconify/`.
  - **Depends:** 2.3
  - **Commit:** `feat(components): add shared ui atoms`

- [x] **2.5 Layout shells**
  - **Goal:** `MarketingLayout` (navbar + footer) for the landing area and `WorkspaceLayout` (responsive 3-column shell) for the app.
  - **Files:** `src/layouts/marketing-layout/`, `src/layouts/workspace-layout/`.
  - **Depends:** 2.4
  - **Commit:** `feat(layouts): add marketing and workspace layout shells`

## Phase 3 — API Layer & Data Types

- [x] **3.1 Domain types from `API.md`**
  - **Goal:** TypeScript interfaces for the API contract: `User`, `Trip`, `TripStatus`, `ThreadSummary`, `ThreadStatus`, `Message`, `PlannerResult` (discriminated union `itinerary | clarification`), `Itinerary`, `Day`, `Activity`, `Flight`, `Hotel`, `Source`, plus request/response envelopes and pagination (`cursor`/`next_cursor`).
  - **Files:** `src/types/api.ts`, `src/types/itinerary.ts`, `src/types/auth.ts`.
  - **Depends:** 1.1
  - **Commit:** `feat(types): add api and itinerary domain types`

- [x] **3.2 Axios instance + interceptors**
  - **Goal:** Single Axios client (base URL from config). Request interceptor attaches `Authorization: Bearer <token>`; response interceptor normalizes errors and handles `401` (clear token + surface auth-required). Token storage util.
  - **Files:** `src/api/axios.ts`, `src/utils/token-storage.ts`, `src/api/errors.ts`.
  - **Depends:** 1.3, 3.1
  - **Commit:** `feat(api): add axios client with auth + error interceptors`

- [x] **3.3 React Query keys + client tuning**
  - **Goal:** Centralized query-key factory and sensible defaults (retry/stale/gc) for the query client.
  - **Files:** `src/api/query-keys.ts`, `src/components/providers/app-providers.tsx` (client config).
  - **Depends:** 1.4, 3.1
  - **Commit:** `feat(api): add query key factory and client config`

- [ ] **3.4 Resource services (thin API functions)**
  - **Goal:** One function per endpoint in `API.md`: `auth` (register, login, me), `trips` (create), `threads` (list, get, sendMessage, delete). No React here.
  - **Files:** `src/services/auth-service.ts`, `src/services/trips-service.ts`, `src/services/threads-service.ts`.
  - **Depends:** 3.2
  - **Commit:** `feat(services): add api service functions`

- [ ] **3.5 Place-photo resolution strategy**
  - **Goal:** Helper for authenticated `GET /places/photos/{ref}` (302 redirect) that `<img>` cannot call with a bearer header. Implement client-side fetch → object URL (with cache) behind a small `PlacePhoto` component; document the alternative Next route-handler proxy in code comments. Hotel `photo_url` (plain URL) renders directly.
  - **Files:** `src/components/place-photo/`, `src/services/places-service.ts`.
  - **Depends:** 3.2
  - **Commit:** `feat(places): add authenticated place-photo resolver`

---

# Part B — Auth & Core Experience

## Phase 4 — Authentication 🔒

- [ ] **4.1 Auth schemas (Zod) + form types**
  - **Goal:** `signInSchema` (email, password) and `signUpSchema` (fullName → split to first/last on submit, email, password ≥ 8, optional country). Kept next to the form.
  - **Files:** `src/components/auth/auth-schemas.ts`.
  - **Depends:** 3.1
  - **Commit:** `feat(auth): add zod schemas for sign in / sign up`

- [ ] **4.2 Auth mutations (React Query hooks)**
  - **Goal:** `useLogin`, `useRegister`, `useMe` hooks wrapping the auth service; persist token on success.
  - **Files:** `src/hooks/use-auth-mutations.ts`.
  - **Depends:** 3.4, 4.1
  - **Commit:** `feat(auth): add login/register/me query hooks`

- [ ] **4.3 Auth context + session hydration**
  - **Goal:** `AuthProvider` + `useAuth`: hydrate token on load, expose `user`, `isAuthenticated`, `login`, `logout` (client-side token clear). Open/close control for the auth modal.
  - **Files:** `src/context/auth-context.tsx`, `src/hooks/use-auth.ts`.
  - **Depends:** 4.2
  - **Commit:** `feat(auth): add auth context and session hydration`

- [ ] **4.4 Auth modal UI**
  - **Goal:** Centered modal with segmented **Sign In / Create Account** toggle, RHF + Zod fields, password reveal, inline errors, loading state — matching `design/auth-*.png`.
  - **Files:** `src/components/auth/auth-dialog.tsx`, `src/components/auth/sign-in-form.tsx`, `src/components/auth/sign-up-form.tsx`.
  - **Depends:** 4.3, 2.4
  - **Commit:** `feat(auth): add sign in / create account modal`

- [ ] **4.5 Auth gate**
  - **Goal:** Guard the workspace and the landing "Start Planning" / prompt-submit actions — open the auth modal when unauthenticated, then continue the intended action.
  - **Files:** `src/components/auth/require-auth.tsx`, `src/hooks/use-require-auth.ts`.
  - **Depends:** 4.3
  - **Commit:** `feat(auth): gate protected actions behind auth modal`

## Phase 5 — Landing Page

- [ ] **5.1 Marketing navbar + footer**
  - **Goal:** Sticky navbar (logo, nav links, "Start Planning" CTA) and footer, wired into `MarketingLayout`.
  - **Files:** `src/components/landing/navbar.tsx`, `src/components/landing/footer.tsx`.
  - **Depends:** 2.5
  - **Commit:** `feat(landing): add navbar and footer`

- [ ] **5.2 Hero + prompt**
  - **Goal:** Hero heading, subtitle, prompt input with suggestion chips, and the destination image; submit routes through the auth gate then creates a trip.
  - **Files:** `src/components/landing/hero.tsx`, `src/components/landing/prompt-box.tsx`.
  - **Depends:** 5.1, 4.5, (uses 6.x trip creation hook — stub navigation until Phase 6, then connect)
  - **Commit:** `feat(landing): add hero and prompt section`

- [ ] **5.3 How-it-works section**
  - **Goal:** Four connected steps.
  - **Files:** `src/components/landing/how-it-works.tsx`.
  - **Depends:** 5.1
  - **Commit:** `feat(landing): add how-it-works section`

- [ ] **5.4 Live product preview**
  - **Goal:** Static browser-framed mock of the workspace.
  - **Files:** `src/components/landing/product-preview.tsx`.
  - **Depends:** 5.1
  - **Commit:** `feat(landing): add product preview section`

- [ ] **5.5 Feature grid**
  - **Goal:** Eight feature cards (Flights, Hotels, Maps, Attractions, Restaurants, Weather, Events, AI Recommendations).
  - **Files:** `src/components/landing/feature-grid.tsx`, `src/constants/landing.ts`.
  - **Depends:** 5.1
  - **Commit:** `feat(landing): add feature grid`

- [ ] **5.6 Stats + testimonials**
  - **Goal:** Navy section with stats and testimonial cards.
  - **Files:** `src/components/landing/stats.tsx`, `src/components/landing/testimonials.tsx`.
  - **Depends:** 5.1
  - **Commit:** `feat(landing): add stats and testimonials`

- [ ] **5.7 Final CTA + page assembly**
  - **Goal:** Orange final CTA; compose all sections in the landing route.
  - **Files:** `src/components/landing/final-cta.tsx`, `src/app/page.tsx`.
  - **Depends:** 5.2–5.6
  - **Commit:** `feat(landing): add final cta and assemble landing page`

## Phase 6 — Chat Workspace 🔒

- [ ] **6.1 Trip / thread hooks + PlannerResult handling**
  - **Goal:** `useCreateTrip` (`POST /trips`), `useSendMessage` (`POST /threads/{id}/messages`), `useThread` (`GET /threads/{id}` with message pagination). Normalize the `itinerary | clarification` union for the UI; expose the latest itinerary snapshot.
  - **Files:** `src/hooks/use-trips.ts`, `src/hooks/use-thread.ts`, `src/utils/planner-result.ts`.
  - **Depends:** 3.4, 4.3
  - **Commit:** `feat(workspace): add trip/thread query hooks`

- [ ] **6.2 Workspace routes + shell wiring**
  - **Goal:** `/trips` (new/empty state) and `/trips/[threadId]` routes rendering `WorkspaceLayout`; loading/error boundaries.
  - **Files:** `src/app/trips/page.tsx`, `src/app/trips/[threadId]/page.tsx`, `src/app/trips/[threadId]/loading.tsx`.
  - **Depends:** 2.5, 6.1
  - **Commit:** `feat(workspace): add workspace routes and shell`

- [ ] **6.3 Left sidebar**
  - **Goal:** Logo, "New Trip" button, recent-trips list (from `GET /threads`: title + status chip + updated date — see gap #4), and user profile menu with logout.
  - **Files:** `src/components/workspace/sidebar/workspace-sidebar.tsx`, `src/components/workspace/sidebar/recent-trips.tsx`, `src/components/workspace/sidebar/user-menu.tsx`.
  - **Depends:** 6.2, 7.1
  - **Commit:** `feat(workspace): add left sidebar with recent trips`

- [ ] **6.4 Message renderer**
  - **Goal:** Trip header + message list rendering user bubbles, the "Trip Created" banner, and **clarification** messages (from the `clarification` union branch). Presentation only — receives messages, emits no I/O.
  - **Files:** `src/components/workspace/chat/message-list.tsx`, `src/components/workspace/chat/message-bubble.tsx`, `src/components/workspace/chat/clarification-message.tsx`.
  - **Depends:** 6.1, 6.2
  - **Commit:** `feat(workspace): add chat message renderer`

- [ ] **6.5 Chat input**
  - **Goal:** Composer with Enter-to-send / Shift+Enter newline, wired to the create/send mutations with loading + disabled states.
  - **Files:** `src/components/workspace/chat/chat-input.tsx`, `src/components/workspace/chat/chat-panel.tsx` (composes list + input).
  - **Depends:** 6.1, 6.4
  - **Commit:** `feat(workspace): add chat input composer`

- [ ] **6.6 Itinerary summary cards**
  - **Goal:** 2×2 summary grid (Flights / Hotels / Itinerary / Places) derived from the itinerary snapshot; each opens its dialog via `useDialog` (Phase 8).
  - **Files:** `src/components/workspace/itinerary/summary-cards.tsx`.
  - **Depends:** 6.4
  - **Commit:** `feat(workspace): add itinerary summary cards`

- [ ] **6.7 Day-by-day timeline**
  - **Goal:** Accordions per `Day` with a timeline of activities (uses `time` bucket text — gap #1 — icon, description, duration, location); "Expand all".
  - **Files:** `src/components/workspace/itinerary/day-accordion.tsx`, `src/components/workspace/itinerary/activity-item.tsx`.
  - **Depends:** 6.4
  - **Commit:** `feat(workspace): add day-by-day itinerary timeline`

- [ ] **6.8 Right sidebar (trip overview)**
  - **Goal:** Hero image (gap #5), meta (dates from `day.date` range / duration = `total_days` / travelers), weather (derived from `day.weather_summary` — gap #3), budget (estimated from flights + hotels + activity `price_eur` — gap #2), and Quick Actions (Export / Map / Share / Regenerate) triggering dialogs via `useDialog`.
  - **Files:** `src/components/workspace/overview/trip-overview.tsx`, `src/components/workspace/overview/budget-panel.tsx`, `src/components/workspace/overview/weather-panel.tsx`, `src/components/workspace/overview/quick-actions.tsx`, `src/utils/budget.ts`.
  - **Depends:** 6.4
  - **Commit:** `feat(workspace): add right sidebar trip overview`

## Phase 7 — Trip History 🔒

- [ ] **7.1 Threads list hook (paginated)**
  - **Goal:** `useThreads` with keyset pagination (`cursor`/`next_cursor`) for the recent-trips list.
  - **Files:** `src/hooks/use-threads.ts`.
  - **Depends:** 3.4
  - **Commit:** `feat(history): add paginated threads list hook`

- [ ] **7.2 Open existing thread + delete**
  - **Goal:** `/trips/[threadId]` loads the thread snapshot (metadata + latest itinerary) with loading/empty/error states; `useDeleteThread` (`DELETE /threads/{id}`) with confirm + cache invalidation.
  - **Files:** `src/app/trips/[threadId]/page.tsx`, `src/hooks/use-delete-thread.ts`.
  - **Depends:** 6.1, 6.2, 7.1
  - **Commit:** `feat(history): load existing thread and support delete`

---

# Part C — Feature Dialogs & Polish

## Phase 8 — Dialogs & Modals

- [ ] **8.1 Dialog manager**
  - **Goal:** Central dialog state so workspace components never own open/close logic. `DialogProvider` holds the active dialog + payload; `useDialog` exposes `open(name, payload)` / `close()`; a single `DialogHost` renders the active dialog. Covers Flights, Hotels, Map, Export, Share. Registered once in the app providers.
  - **Files:** `src/context/dialog-context.tsx`, `src/hooks/use-dialog.ts`, `src/components/dialogs/dialog-host.tsx`, `src/components/providers/app-providers.tsx`.
  - **Depends:** 1.4
  - **Commit:** `feat(dialogs): add central dialog manager (provider + useDialog)`

- [ ] **8.2 Flights dialog**
  - **Goal:** List `itinerary.flights` (airline, stops, duration, dates, price, "BEST VALUE" chip on cheapest, book link) — `design/flights-dialog.png`. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/flights-dialog.tsx`.
  - **Depends:** 8.1, 6.6
  - **Commit:** `feat(dialogs): add flights dialog`

- [ ] **8.3 Hotels dialog**
  - **Goal:** List `itinerary.hotels` (photo via direct `photo_url`, rating, area, nightly/total price, amenities where available, "RECOMMENDED" chip, book link) — `design/hotels-dialog.png`. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/hotels-dialog.tsx`.
  - **Depends:** 8.1, 6.6
  - **Commit:** `feat(dialogs): add hotels dialog`

- [ ] **8.4 Map dialog (Google Maps)**
  - **Goal:** Add `@react-google-maps/api`; plot markers from activity + hotel coordinates, colored by type (Hotel / Attraction / Restaurant via `categories`) with a legend — `design/map-dialog.png`. Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/map-dialog.tsx`, `src/utils/map-markers.ts`, `package.json`.
  - **Depends:** 8.1, 6.6, 1.3
  - **Commit:** `feat(dialogs): add google maps dialog`

- [ ] **8.5 Export dialog (UX only)**
  - **Goal:** Full export UX with no backend/logic: trigger button → confirm → progress → success (download CTA) → error states — `design/export-dialog-*.png`. Wire the state machine; the actual export is deferred. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/export-dialog.tsx`, `src/hooks/use-export-flow.ts`.
  - **Depends:** 8.1, 6.8
  - **Commit:** `feat(dialogs): add export dialog ux (no backend)`

- [ ] **8.6 Share trip (UX only)**
  - **Goal:** Copy-link share affordance (uses trip `slug` / thread id); no share endpoint. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/share-trip.tsx`.
  - **Depends:** 8.1, 6.8
  - **Commit:** `feat(dialogs): add share trip copy-link ux`

## Phase 9 — Polish, Responsiveness & Cleanup

- [ ] **9.1 Responsive workspace**
  - **Goal:** Collapse the 3-column layout to stacked panels / drawers on tablet and mobile; responsive landing.
  - **Files:** `src/layouts/workspace-layout/`, landing components.
  - **Depends:** Phases 5–8
  - **Commit:** `feat(responsive): adapt workspace and landing for mobile`

- [ ] **9.2 Loading, empty & error states**
  - **Goal:** Skeletons for chat/itinerary/lists, empty states, and route error boundaries.
  - **Files:** `src/app/error.tsx`, `src/app/not-found.tsx`, `src/components/**/skeletons`.
  - **Depends:** Phases 5–8
  - **Commit:** `feat(ux): add skeletons, empty and error states`

- [ ] **9.3 Accessibility**
  - **Goal:** Focus management in dialogs, ARIA labels, keyboard nav, reduced-motion.
  - **Files:** across dialogs and interactive components.
  - **Depends:** Phases 5–8
  - **Commit:** `feat(a11y): improve focus, aria and keyboard support`

- [ ] **9.4 Final consistency pass**
  - **Goal:** Audit against `CODING_STYLE.md` (imports, JSX formatting, named exports, no `any`), remove dead code, update `README.md` with setup/run instructions.
  - **Files:** repo-wide, `README.md`.
  - **Depends:** all
  - **Commit:** `chore: final consistency pass and readme`

---

## Deferred / future (not in this plan)

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
- [ ] No TypeScript errors (`tsc --noEmit`, strict).
- [ ] No ESLint warnings or errors.
- [ ] Matches the corresponding Figma screen in `/design`.
- [ ] Responsive where applicable.
- [ ] Reuses existing components/hooks/services/utils/types instead of duplicating them.
- [ ] Scoped to a single logical commit and reviewed before committing.
