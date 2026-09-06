# Plan — Frontend (agentic-trip-planner-web)

> **Approach:** Build a production-grade Next.js (App Router) frontend for the AI Travel Planner,
> matching the exported Figma screens in `/design` and the conventions in `docs/CODING_STYLE.md`
> exactly. Work proceeds **one task at a time**: each task has a clear goal, a bounded set of
> files, explicit dependencies, and is sized for a single reviewable Git commit. After each task
> we **stop, review, adjust, then commit** before moving on. The API layer is wired strictly
> against `docs/API.md` — no endpoints are invented. Where the design shows data the API does not
> expose, the gap is documented (see *Design ↔ API reconciliations*) and handled without new
> backend calls. **`docs/API.md` was regenerated from the live OpenAPI schema on 2026-08-31 and is
> authoritative; Phase 9 migrates the frontend onto it.**

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

## Product framing — recommendations, not bookings

This governs copy and affordances across every screen, and is easy to get wrong.

We search providers, rank results and **present options**. We never own the transaction.
No provider exposes a bookable deep link, so **every `booking_url` and `ticket_url` is a
constructed search URL** — the one exception is an activity with an official venue website.

Consequences the UI must honour:

- **The price shown is indicative, not quoted.** A user who clicks "from €158" and lands on a
  search page showing €190 has not hit a bug — but they will read it as one unless we say so.
- **Label actions "Find" / "View options" / "Search", never "Book now".** A booking verb promises a
  transaction we cannot deliver.
- **Three fields are explicitly estimates** and must be labelled as such: `estimated_spend_eur`,
  `Activity.price_is_estimated` (always `true` when a price is set — no provider prices activities),
  and `HotelOption.is_estimated`.
- **Budget is reported, not enforced.** The planner does not constrain a plan to `budget_eur`; it
  only reports spend against it. Never imply a plan "fits" a budget.

---

## Known gaps — expected, not defects

This is a **suggestion** product. The itinerary is a proposal to react to, not a booking record, so
partial data is normal and the UI must degrade gracefully rather than treat a null as an error.

> **Never render a placeholder.** No "N/A", no "€0", no broken icon, no empty panel. **Omit the
> element instead.** Build the sparse case as the default and treat fully-populated data as the
> happy path, not the reverse.

**Activity prices are usually absent.** `activity.price_eur` is null far more often than not — no
provider prices attractions, and the planner is deliberately conservative about inventing a figure.
A row with no price simply shows no price; the design's "€29 · Trenitalia" line is an enhancement,
not a requirement. `estimated_spend_eur` is likewise null when nothing is priced, in which case the
budget panel shows the budget alone rather than a spend bar reading zero. Do not build anything
that assumes a price exists.

**Weather is missing beyond ~16 days.** A trip planned a month out has **no weather on any day** —
not a few gaps, all of them — which is the common case for a planning product. The forecast panel
needs a real absent state: hide it, or say the forecast is not available yet. Never an empty panel
or a repeated placeholder icon.

**Flight times and prices are sandbox values.** The provider runs in sandbox, so `departs_at`,
`arrives_at` and `price` are synthetic — identical departure times across airlines, implausible
durations. **The fields and shapes are correct; only the values are fake.** Build against them
normally and do not work around what looks wrong; it resolves with a production key.

**Older trips predate newer fields entirely.** Itineraries are stored snapshots, so every nullable
field in `API.md` is genuinely nullable — including ones that look like they should always be there.

---

## Design ↔ API reconciliations

`docs/API.md` (regenerated from the live OpenAPI schema, 2026-08-31) is the authoritative contract.
The entries below are what remains after the backend MVP; everything else the design showed is now
a real field. **Do not re-derive client-side anything the API now returns.**

1. **Photos need a bearer token.** `GET /places/photos/{ref}` is authenticated and `<img src>` cannot
   send a header, so `Activity.photo_url` and every `cover_image_url` are fetched client-side into
   object URLs via `PlacePhoto`. Both are already full paths (`/places/photos/places/…/photos/…`) —
   prefix with the API base; do **not** pass them back in as `{photo_reference}`. `HotelOption.photo_url`
   is an absolute provider URL and renders directly.
2. **Registration** collects separate `first_name` + `last_name`. Password is **8–30 characters**;
   the server also validates encoded bytes, so 30 emoji are rejected.
3. **Status mapping** (thread/trip → chip): `ready → Active` · `draft`/`generating`/`pending`/`running
   → Planning` · `completed → Completed` · `archived`/`deleted → Archived` · `failed → Failed`.
4. **Regenerate** sends a follow-up via `POST /threads/{id}/messages`; there is no regenerate endpoint.
5. **Hotel amenities** ("Free WiFi", "Breakfast", "Spa") do not exist and are not planned. The chip row
   carries the real fields: `area`, plus an "Estimated price" marker when `is_estimated` is true.
6. **The per-category budget split** (✈ / 🏨) stays client-side — the API returns `budget_eur` and
   `estimated_spend_eur` as totals, not a breakdown. Derive the split from the cheapest flight, the
   cheapest hotel stay and summed activity prices, matching how `estimated_spend_eur` is composed.
7. **Prices are per party** except `Activity.price_eur`, which is **per person**. Any price rendered
   without `traveler_count` beside it is misleading. Older trips have a null count — say "total"
   rather than inventing a party size.
8. **Clarification loops.** `missing_fields` is drawn from `destination` · `duration` ·
   `traveler_count`; a *partial* answer returns another clarification rather than a plan. The
   clarification UI must handle repeated rounds, not a single question. Budget is requested in the
   same message but never blocks.
9. **Turns are synchronous** — up to 120 s, no streaming and no polling endpoint — and a second
   message while one is running returns **409**. The composer must be disabled for the whole turn,
   and the wait needs a real progress affordance, not a spinner with no explanation.
10. **Older trips lack newer fields.** Itineraries are stored as snapshots, so a trip planned before a
    field existed returns null rather than failing. Treat every nullable field as genuinely optional;
    `DayPlan.title` falls back to `location`.

### Resolved by the backend MVP — workarounds deleted

Kept as a record so these are not reintroduced: activity time buckets, weather parsed from free text,
sidebar cards without destination or thumbnail, hero image scavenged from the first hotel photo,
flight cards captioned with an airline instead of a route, hotel rating assumed 0–5, activity type
guessed from category keywords, and the Travellers row substituted with Destination. Each is now a
first-class field — see *Newly available* in `docs/API.md`.

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

- [x] **3.4 Resource services (thin API functions)**
  - **Goal:** One function per endpoint in `API.md`: `auth` (register, login, me), `trips` (create), `threads` (list, get, sendMessage, delete). No React here.
  - **Files:** `src/services/auth-service.ts`, `src/services/trips-service.ts`, `src/services/threads-service.ts`.
  - **Depends:** 3.2
  - **Commit:** `feat(services): add api service functions`

- [x] **3.5 Place-photo resolution strategy**
  - **Goal:** Helper for authenticated `GET /places/photos/{ref}` (302 redirect) that `<img>` cannot call with a bearer header. Implement client-side fetch → object URL (with cache) behind a small `PlacePhoto` component; document the alternative Next route-handler proxy in code comments. Hotel `photo_url` (plain URL) renders directly.
  - **Files:** `src/components/place-photo/`, `src/services/places-service.ts`.
  - **Depends:** 3.2
  - **Commit:** `feat(places): add authenticated place-photo resolver`

---

# Part B — Auth & Core Experience

## Phase 4 — Authentication 🔒

- [x] **4.1 Auth schemas (Zod) + form types**
  - **Goal:** `signInSchema` (email, password) and `signUpSchema` (separate `first_name` and `last_name`, email, password ≥ 8, optional country). Kept next to the form.
  - **Files:** `src/components/auth/auth-schemas.ts`.
  - **Depends:** 3.1
  - **Commit:** `feat(auth): add zod schemas for sign in / sign up`

- [x] **4.2 Auth mutations (React Query hooks)**
  - **Goal:** `useLogin`, `useRegister`, `useMe` hooks wrapping the auth service; persist token on success.
  - **Files:** `src/hooks/use-auth-mutations.ts`.
  - **Depends:** 3.4, 4.1
  - **Commit:** `feat(auth): add login/register/me query hooks`

- [x] **4.3 Auth context + session hydration**
  - **Goal:** `AuthProvider` + `useAuth`: hydrate token on load, expose `user`, `isAuthenticated`, `login`, `logout` (client-side token clear). Open/close control for the auth modal.
  - **Files:** `src/context/auth-context.tsx`, `src/hooks/use-auth.ts`.
  - **Depends:** 4.2
  - **Commit:** `feat(auth): add auth context and session hydration`

- [x] **4.4 Auth modal UI**
  - **Goal:** Centered modal with segmented **Sign In / Create Account** toggle, RHF + Zod fields, password reveal, inline errors, loading state — matching `design/auth-*.png`.
  - **Files:** `src/components/auth/auth-dialog.tsx`, `src/components/auth/sign-in-form.tsx`, `src/components/auth/sign-up-form.tsx`.
  - **Depends:** 4.3, 2.4
  - **Commit:** `feat(auth): add sign in / create account modal`

- [x] **4.5 Auth gate**
  - **Goal:** Guard the workspace and the landing "Start Planning" / prompt-submit actions — open the auth modal when unauthenticated, then continue the intended action.
  - **Files:** `src/components/auth/require-auth.tsx`, `src/hooks/use-require-auth.ts`.
  - **Depends:** 4.3
  - **Commit:** `feat(auth): gate protected actions behind auth modal`

## Phase 5 — Landing Page

- [x] **5.1 Marketing navbar + footer**
  - **Goal:** Sticky navbar (logo, nav links, "Start Planning" CTA) and footer, wired into `MarketingLayout`.
  - **Files:** `src/components/landing/navbar.tsx`, `src/components/landing/footer.tsx`.
  - **Depends:** 2.5
  - **Commit:** `feat(landing): add navbar and footer`

- [x] **5.2 Hero + prompt**
  - **Goal:** Hero heading, subtitle, prompt input with suggestion chips, and the destination image; submit routes through the auth gate then creates a trip.
  - **Files:** `src/components/landing/hero.tsx`, `src/components/landing/prompt-box.tsx`.
  - **Depends:** 5.1, 4.5, (uses 6.x trip creation hook — stub navigation until Phase 6, then connect)
  - **Commit:** `feat(landing): add hero and prompt section`

- [x] **5.3 How-it-works section**
  - **Goal:** Four connected steps.
  - **Files:** `src/components/landing/how-it-works.tsx`.
  - **Depends:** 5.1
  - **Commit:** `feat(landing): add how-it-works section`

- [x] **5.4 Live product preview**
  - **Goal:** Static browser-framed mock of the workspace.
  - **Files:** `src/components/landing/product-preview.tsx`.
  - **Depends:** 5.1
  - **Commit:** `feat(landing): add product preview section`

- [x] **5.5 Feature grid**
  - **Goal:** Eight feature cards (Flights, Hotels, Maps, Attractions, Restaurants, Weather, Events, AI Recommendations).
  - **Files:** `src/components/landing/feature-grid.tsx`, `src/constants/landing.ts`.
  - **Depends:** 5.1
  - **Commit:** `feat(landing): add feature grid`

- [x] **5.6 Stats + testimonials**
  - **Goal:** Navy section with stats and testimonial cards.
  - **Files:** `src/components/landing/stats.tsx`, `src/components/landing/testimonials.tsx`.
  - **Depends:** 5.1
  - **Commit:** `feat(landing): add stats and testimonials`

- [x] **5.7 Final CTA + page assembly**
  - **Goal:** Orange final CTA; compose all sections in the landing route.
  - **Files:** `src/components/landing/final-cta.tsx`, `src/app/page.tsx`.
  - **Depends:** 5.2–5.6
  - **Commit:** `feat(landing): add final cta and assemble landing page`

## Phase 6 — Chat Workspace 🔒

- [x] **6.1 Trip / thread hooks + PlannerResult handling**
  - **Goal:** `useCreateTrip` (`POST /trips`), `useSendMessage` (`POST /threads/{id}/messages`), `useThread` (`GET /threads/{id}` with message pagination). Normalize the `itinerary | clarification` union for the UI; expose the latest itinerary snapshot.
  - **Files:** `src/hooks/use-trips.ts`, `src/hooks/use-thread.ts`, `src/utils/planner-result.ts`.
  - **Depends:** 3.4, 4.3
  - **Commit:** `feat(workspace): add trip/thread query hooks`

- [x] **6.2 Workspace routes + shell wiring**
  - **Goal:** `/trips` (new/empty state) and `/trips/[threadId]` routes rendering `WorkspaceLayout`; loading/error boundaries.
  - **Files:** `src/app/trips/page.tsx`, `src/app/trips/[threadId]/page.tsx`, `src/app/trips/[threadId]/loading.tsx`.
  - **Depends:** 2.5, 6.1
  - **Commit:** `feat(workspace): add workspace routes and shell`

- [x] **6.3 Left sidebar**
  - **Goal:** Logo, "New Trip" button, recent-trips list (from `GET /threads`: title + status chip + updated date — **superseded by 9.7**, which adds cover, flag and dates), and user profile menu with logout.
  - **Files:** `src/components/workspace/sidebar/workspace-sidebar.tsx`, `src/components/workspace/sidebar/recent-trips.tsx`, `src/components/workspace/sidebar/user-menu.tsx`.
  - **Depends:** 6.2, 7.1
  - **Commit:** `feat(workspace): add left sidebar with recent trips`

- [x] **6.4 Message renderer**
  - **Goal:** Trip header + message list rendering user bubbles, the "Trip Created" banner, and **clarification** messages (from the `clarification` union branch). Presentation only — receives messages, emits no I/O.
  - **Files:** `src/components/workspace/chat/message-list.tsx`, `src/components/workspace/chat/message-bubble.tsx`, `src/components/workspace/chat/clarification-message.tsx`.
  - **Depends:** 6.1, 6.2
  - **Commit:** `feat(workspace): add chat message renderer`

- [x] **6.5 Chat input**
  - **Goal:** Composer with Enter-to-send / Shift+Enter newline, wired to the create/send mutations with loading + disabled states.
  - **Files:** `src/components/workspace/chat/chat-input.tsx`, `src/components/workspace/chat/chat-panel.tsx` (composes list + input).
  - **Depends:** 6.1, 6.4
  - **Commit:** `feat(workspace): add chat input composer`

- [x] **6.6 Itinerary summary cards**
  - **Goal:** 2×2 summary grid (Flights / Hotels / Itinerary / Places) derived from the itinerary snapshot; each opens its dialog via `useDialog` (Phase 8).
  - **Files:** `src/components/workspace/itinerary/summary-cards.tsx`.
  - **Depends:** 6.4
  - **Commit:** `feat(workspace): add itinerary summary cards`

- [x] **6.7 Day-by-day timeline**
  - **Goal:** Accordions per `Day` with a timeline of activities (uses `time`, icon, description, duration, location — **superseded by 9.3/9.8**); "Expand all".
  - **Files:** `src/components/workspace/itinerary/day-accordion.tsx`, `src/components/workspace/itinerary/activity-item.tsx`.
  - **Depends:** 6.4
  - **Commit:** `feat(workspace): add day-by-day itinerary timeline`

- [x] **6.8 Right sidebar (trip overview)**
  - **Goal:** Hero image, meta (dates / duration / travellers), weather, budget — all derived client-side at the time; **superseded by 9.6**, and Quick Actions (Export / Map / Share / Regenerate) triggering dialogs via `useDialog`.
  - **Files:** `src/components/workspace/overview/trip-overview.tsx`, `src/components/workspace/overview/budget-panel.tsx`, `src/components/workspace/overview/weather-panel.tsx`, `src/components/workspace/overview/quick-actions.tsx`, `src/utils/budget.ts`.
  - **Depends:** 6.4
  - **Commit:** `feat(workspace): add right sidebar trip overview`

## Phase 7 — Trip History 🔒

- [x] **7.1 Threads list hook (paginated)**
  - **Goal:** `useThreads` with keyset pagination (`cursor`/`next_cursor`) for the recent-trips list.
  - **Files:** `src/hooks/use-threads.ts`.
  - **Depends:** 3.4
  - **Commit:** `feat(history): add paginated threads list hook`

- [x] **7.2 Open existing thread + delete**
  - **Goal:** `/trips/[threadId]` loads the thread snapshot (metadata + latest itinerary) with loading/empty/error states; `useDeleteThread` (`DELETE /threads/{id}`) with confirm + cache invalidation.
  - **Files:** `src/app/trips/[threadId]/page.tsx`, `src/hooks/use-delete-thread.ts`.
  - **Depends:** 6.1, 6.2, 7.1
  - **Commit:** `feat(history): load existing thread and support delete`

---

# Part C — Feature Dialogs & Polish

## Phase 8 — Dialogs & Modals

- [x] **8.1 Dialog manager**
  - **Goal:** Central dialog state so workspace components never own open/close logic. `DialogProvider` holds the active dialog + payload; `useDialog` exposes `open(name, payload)` / `close()`; a single `DialogHost` renders the active dialog. Covers Flights, Hotels, Map, Export, Share. Registered once in the app providers.
  - **Files:** `src/context/dialog-context.tsx`, `src/hooks/use-dialog.ts`, `src/components/dialogs/dialog-host.tsx`, `src/components/providers/app-providers.tsx`.
  - **Depends:** 1.4
  - **Commit:** `feat(dialogs): add central dialog manager (provider + useDialog)`

- [x] **8.2 Flights dialog**
  - **Goal:** List `itinerary.flights` (airline, stops, duration, dates, price, "BEST VALUE" chip on cheapest, book link — route and times **superseded by 9.4**) — `design/flights-dialog.png`. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/flights-dialog.tsx`.
  - **Depends:** 8.1, 6.6
  - **Commit:** `feat(dialogs): add flights dialog`

- [x] **8.3 Hotels dialog**
  - **Goal:** List `itinerary.hotels` (photo via direct `photo_url`, rating, area, nightly/total price (rating split **superseded by 9.5**), "RECOMMENDED" chip, book link) — `design/hotels-dialog.png`. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/hotels-dialog.tsx`.
  - **Depends:** 8.1, 6.6
  - **Commit:** `feat(dialogs): add hotels dialog`

- [x] **8.4 Map dialog (Google Maps)**
  - **Goal:** Add `@react-google-maps/api`; plot markers from activity + hotel coordinates, colored by type (Hotel / Attraction / Restaurant via `categories` — **superseded by 9.3**, now `activity_type`) with a legend — `design/map-dialog.png`. Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/map-dialog.tsx`, `src/utils/map-markers.ts`, `package.json`.
  - **Depends:** 8.1, 6.6, 1.3
  - **Commit:** `feat(dialogs): add google maps dialog`

- [x] **8.5 Export dialog (UX only)**
  - **Goal:** Full export UX with no backend/logic: trigger button → confirm → progress → success (download CTA) → error states — `design/export-dialog-*.png`. Wire the state machine; the actual export is deferred. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/export-dialog.tsx`, `src/hooks/use-export-flow.ts`.
  - **Depends:** 8.1, 6.8
  - **Commit:** `feat(dialogs): add export dialog ux (no backend)`

- [x] **8.6 Share trip (UX only)**
  - **Goal:** Copy-link share affordance (uses trip `slug` / thread id); no share endpoint. Opened via `useDialog`.
  - **Files:** `src/components/dialogs/share-trip.tsx`.
  - **Depends:** 8.1, 6.8
  - **Commit:** `feat(dialogs): add share trip copy-link ux`

## Phase 9 — Contract migration (API v2) 🔒

> The backend MVP landed on 2026-08-31 and `docs/API.md` was regenerated from the live schema.
> This phase adopts the new contract: fix the breaking changes, delete the derivations it replaces,
> and wire the new fields into the screens that were faking them. **Run this before Phase 10** —
> polishing screens that are about to change their data source wastes the work.

- [x] **9.1 Retype against the v2 contract**
  - **Goal:** Bring `src/types/` in line with the regenerated schema. Breaking: `hotel.rating` →
    `star_rating` (0–5) + `guest_rating` (0–10); `day.weather_summary` → `day.weather`
    (`DayWeather`); `activity.time` always `HH:MM` or null. New: `Itinerary.country_code`,
    `timezone`, `start_date`, `end_date`, `traveler_count`, `budget_eur`, `estimated_spend_eur`,
    `cover_image_url`; `DayPlan.title`; `Activity.activity_type` (17-value enum), `venue_name`,
    `note`, `price_is_estimated`, `ticket_url`; `FlightOption.origin`, `destination`, `departs_at`,
    `arrives_at`, `booking_url`; `HotelOption.booking_url`; `ThreadSummary.country_code`,
    `start_date`, `end_date`, `cover_image_url`. Keep every nullable field nullable — snapshots mean
    older trips return null. Password rule becomes 8–30 in the Zod schema.
  - **Files:** `src/types/itinerary.ts`, `src/types/api.ts`, `src/components/auth/auth-schemas.ts`.
  - **Depends:** —
  - **Commit:** `feat(types): adopt the v2 api contract`

- [x] **9.2 Delete the superseded derivations** — *absorbed into the tasks that replace them*
  - **Outcome:** A standalone deletion commit is not viable — removing a derivation without its
    replacement leaves the tree uncompilable. The weather string parsing had to go in **9.1**
    (`weather_summary` no longer exists as a field); keyword category matching goes with **9.3**,
    the hero-photo fallback and client-side budget with **9.6**, and the flight date substitute
    with **9.4**. Each deletion ships alongside the field that supersedes it.
  - **Files:** `src/utils/trip-overview.ts`, `src/utils/activity-display.ts`,
    `src/utils/itinerary-summary.ts`, `src/utils/flight-display.ts`, `src/utils/hotel-display.ts`.
  - **Depends:** 9.1
  - **Commit:** `refactor: drop derivations superseded by the v2 contract`

- [x] **9.3 Activity type → icons and map pins**
  - **Goal:** Map the 17-value `activity_type` enum to timeline icons and marker colours, replacing
    the 4-way keyword guess. The enum is finer than the design's three legend groups
    (Hotel / Attraction / Restaurant), so the collapse happens here and is the single source for both
    the timeline dot and the map pin.
  - **Files:** `src/utils/activity-display.ts`, `src/utils/map-markers.ts`,
    `src/components/workspace/itinerary/activity-item.tsx`.
  - **Depends:** 9.1
  - **Commit:** `feat(itinerary): drive icons and map pins from activity_type`

- [x] **9.4 Flight card: real route and times**
  - **Goal:** Render the design as drawn — `07:15 → 11:30` from `departs_at`/`arrives_at` and
    `LHR → FCO` from `origin`/`destination`, with the connector between them. Degrade to the
    duration-only form when either is null (older trips) — omit the times, do not show a dash.
    Flight values are sandbox-synthetic (identical times across airlines); the shapes are correct,
    so build against them normally rather than working around implausible-looking data.
  - **Files:** `src/components/dialogs/flights-dialog.tsx`, `src/utils/flight-display.ts`,
    `src/components/workspace/itinerary/summary-cards.tsx`.
  - **Depends:** 9.1
  - **Commit:** `feat(dialogs): show real flight route and times`

- [x] **9.5 Hotel card: star class vs guest score**
  - **Goal:** Restore the star row from `star_rating` (0–5 property class) and the ★8.9 badge from
    `guest_rating` (0–10 review score) — two distinct fields that were previously conflated.
  - **Files:** `src/components/dialogs/hotels-dialog.tsx`, `src/utils/hotel-display.ts`,
    `src/components/workspace/itinerary/summary-cards.tsx`.
  - **Depends:** 9.1
  - **Commit:** `feat(dialogs): split hotel star class from guest score`

- [x] **9.6 Trip overview from real fields**
  - **Goal:** Travellers row from `traveler_count`; dates from `start_date`/`end_date`; weather from
    `day.weather` keyed on `weather_code`; hero from `cover_image_url` via `PlacePhoto`. Budget shows
    `estimated_spend_eur` against `budget_eur` when a budget exists — labelled as an estimate against
    a stated budget, never as a guarantee (see *Product framing*).
  - **Absent cases are the default, not the edge** (see *Known gaps*): weather is null on **every**
    day for any trip beyond ~16 days, so the panel hides entirely rather than showing placeholder
    icons; `estimated_spend_eur` is null whenever nothing is priced, so show the budget alone with no
    spend bar; a missing `traveler_count` means saying "total" rather than inventing a party size.
    Each row omits itself when its field is null — no dashes, no zeros.
  - **Files:** `src/components/workspace/overview/*`, `src/utils/budget.ts`,
    `src/utils/trip-overview.ts`.
  - **Depends:** 9.1, 9.2
  - **Commit:** `feat(workspace): build the trip overview from v2 fields`

- [x] **9.7 Sidebar trip cards**
  - **Goal:** The design's card, now that the data exists: `cover_image_url` thumbnail, country flag
    from `country_code`, and the `start_date`–`end_date` range. Handle the null case — a thread has
    no trip until its first turn completes.
  - **Files:** `src/components/workspace/sidebar/recent-trips.tsx`, `src/utils/country.ts`.
  - **Depends:** 9.1
  - **Commit:** `feat(history): show cover, flag and dates on trip cards`

- [ ] **9.8 Day titles, venue and note**
  - **Goal:** Day headers use `DayPlan.title` ("Arrival & Trastevere") falling back to `location`.
    The activity meta row splits `venue_name` from `note` — currently both collapse into `address`.
  - **Files:** `src/components/workspace/itinerary/day-accordion.tsx`,
    `src/components/workspace/itinerary/activity-item.tsx`.
  - **Depends:** 9.1
  - **Commit:** `feat(itinerary): render day titles, venue and note`

- [ ] **9.9 Honest labelling for estimates and searches**
  - **Goal:** Apply *Product framing* everywhere prices and links appear: "Find flights" / "View
    options" instead of "Book"; an estimate marker on `estimated_spend_eur`, `price_is_estimated`
    and `is_estimated`; and per-party prices shown against `traveler_count`. Copy-only, but it is
    the difference between a product that reads as honest and one that reads as broken.
  - **Files:** `src/components/dialogs/*`, `src/components/workspace/overview/budget-panel.tsx`,
    `src/components/workspace/itinerary/summary-cards.tsx`.
  - **Depends:** 9.4, 9.5, 9.6
  - **Commit:** `feat(ux): label estimates and search links honestly`

- [ ] **9.10 Clarification rounds, 409 and the long turn**
  - **Goal:** The planner asks before it plans, and a partial answer asks again — so the
    clarification UI must survive repeated rounds rather than assuming one question. Disable the
    composer for the whole turn, surface `409` as "still working" rather than an error, and give the
    ≤120 s wait a real progress affordance (see 10.3).
  - **Also fix the "Trip created" banner**, which is currently fabricated: it is hardcoded at
    `index === 1` rather than anchored to the message that actually produced an itinerary, and it
    reads only "Trip created" where the design shows `Trip Created — Rome, Italy` with a summary
    line. Anchor it to the first assistant message carrying an `itinerary` and populate it from
    `destination` and `total_days`. A thread that never produced a plan must not show it at all.
  - **Files:** `src/components/workspace/chat/*`, `src/hooks/use-thread.ts`,
    `src/utils/planner-result.ts`.
  - **Depends:** 9.1
  - **Commit:** `feat(workspace): handle clarification rounds and running turns`

## Phase 10 — Polish, Motion & Responsiveness

> The brief: *empty states, new conversations, animation — everything must feel nice and fluent.*
> Treat this as product work, not a cleanup pass.

- [ ] **10.1 Empty states and the new-conversation experience**
  - **Goal:** Every zero state earns its screen. `/trips` with no trips at all (first-run) differs
    from `/trips` with trips but none selected. A brand-new thread should invite a first message with
    suggestions, the way the landing prompt does — not show an empty transcript. Cover: no flights,
    no hotels, no mapped places, no weather, a thread whose trip has not completed its first turn,
    and a failed thread.
  - **Files:** `src/app/trips/page.tsx`, `src/components/workspace/chat/*`,
    `src/components/workspace/**/empty-*`.
  - **Depends:** Phase 9
  - **Commit:** `feat(ux): add empty states and a new-conversation experience`

- [ ] **10.2 Loading and skeletons**
  - **Goal:** Skeletons that match the shape of what is loading — trip cards, summary cards, the
    timeline, the transcript — so nothing jumps on arrival. Route error boundaries and a not-found
    page.
  - **Files:** `src/app/error.tsx`, `src/app/not-found.tsx`, `src/components/**/skeletons`.
  - **Depends:** Phase 9
  - **Commit:** `feat(ux): add skeletons and route error states`

- [ ] **10.3 Motion and the planning wait**
  - **Goal:** Make it feel fluent. Consistent transitions for dialogs, accordions, message arrival
    and panel changes, on one easing/duration scale in the theme. The centrepiece is the **≤120 s
    synchronous turn**: a staged progress narrative ("Searching flights… Comparing hotels… Building
    your day plan…") rather than a spinner, since the user is otherwise staring at nothing for two
    minutes. All of it behind `prefers-reduced-motion`.
  - **Files:** `src/theme/motion.ts`, `src/components/workspace/chat/*`, dialogs.
  - **Depends:** 9.10, 10.1
  - **Commit:** `feat(ux): add a motion scale and a staged planning wait`

- [ ] **10.4 Responsive workspace**
  - **Goal:** Collapse the 3-column shell to stacked panels / drawers on tablet and mobile; verify
    the landing page and every dialog at small widths.
  - **Files:** `src/layouts/workspace-layout/`, landing components, dialogs.
  - **Depends:** Phase 9
  - **Commit:** `feat(responsive): adapt workspace and landing for mobile`

- [ ] **10.5 Accessibility**
  - **Goal:** Focus management and return-focus in dialogs, ARIA labels, keyboard navigation through
    the timeline and trip list, visible focus rings, and reduced-motion honoured throughout.
  - **Files:** across dialogs and interactive components.
  - **Depends:** 10.3
  - **Commit:** `feat(a11y): improve focus, aria and keyboard support`

- [ ] **10.6 Final consistency pass**
  - **Goal:** Audit against `CODING_STYLE.md` (imports, JSX formatting, named exports, no `any`),
    remove dead code, refresh `README.md` with setup and run instructions.
  - **Files:** repo-wide, `README.md`.
  - **Depends:** all
  - **Commit:** `chore: final consistency pass and readme`

---

## Deferred / future (not in this plan)

- **Hotel amenities** — no such field exists and none is planned.
- **In-app booking and real ticket pricing** — we link out to searches; see *Product framing*.
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
- [ ] Nullable API fields are handled as genuinely optional (older trips are snapshots).
- [ ] Absent data omits its element — never "N/A", "€0", an empty panel or a placeholder icon.
- [ ] Verified against a sparse payload, not only a fully-populated one.
- [ ] Estimates are labelled as estimates and outbound links read as searches, not bookings.
- [ ] Scoped to a single logical commit and reviewed before committing.
