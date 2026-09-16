---
paths:
  - "src/hooks/**"
  - "src/services/**"
  - "src/api/**"
  - "src/types/**"
  - "src/utils/**"
---

# Data layer

- **HTTP only in `src/services/*`**, always through the client in `src/api/axios.ts`. One
  thin function per endpoint in `docs/API.md`; no React inside a service.
- **React Query owns server state.** Queries and mutations live in custom hooks under
  `src/hooks/*`, keyed from `src/api/query-keys.ts`. Never fetch in `useEffect`. A mutation
  invalidates the keys it affects.
- **Errors** normalise through `src/api/errors.ts`. Never swallow a rejection; surface a
  user-readable message. A `409` on a running turn is a wait, not a failure.
- **Types mirror `docs/API.md` exactly**, nullability included. Itineraries are stored
  snapshots, so a nullable field is genuinely null on older trips. Never widen to `any`.
- **Do not re-derive what the API returns** — `activity_type`, `cover_image_url`,
  `start_date`/`end_date`, `traveler_count`, `day.weather`, flight `origin`/`destination`.
  The one exception is the ✈/🏨 budget split, which has no API equivalent.

Detail: `docs/API.md` · `docs/PRODUCT_RULES.md`
