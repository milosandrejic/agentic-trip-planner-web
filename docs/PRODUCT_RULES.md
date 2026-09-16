# Product Rules — Frontend (agentic-trip-planner-web)

> **What this is.** The durable product truths behind the UI: what we are allowed to
> promise, which data is routinely absent, and where the design and the API disagree.
> These outlive any one sprint — unlike `docs/PLAN.md`, which tracks the current
> sprint's tasks and is archived when that sprint closes.

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
