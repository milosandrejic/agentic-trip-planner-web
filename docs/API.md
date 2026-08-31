# Agentic Trip Planner — API Reference

Generated against the live schema on 2026-08-31. Interactive: `GET /docs`, `GET /openapi.json`.

No global prefix. Serves on `PORT` (default `8000`). CORS allows only the origins in
`CORS_ORIGINS` (default `http://localhost:8003`), with credentials.

---

## What changed — read this first

If you built against the previous version of this document, these are the differences that matter.

### Breaking

| Was | Now |
|---|---|
| `hotel.rating` | **`hotel.star_rating`** (0–5 property class) and **`hotel.guest_rating`** (0–10 review score). The ★8.9 figure in the design is `guest_rating` |
| `day.weather_summary` — a string | **`day.weather`** — `{condition, weather_code, temp_max_c, temp_min_c}` or null |
| `GET /places/photos/...` — open | **Requires a bearer token.** `<img src>` cannot send a header |
| `POST /threads/{id}/messages` | Can now return **`409`** while a turn is already running |
| Password: 8+ chars | **8–30 characters** |
| `activity.time` — free text, could be `"Morning"` | **Always `HH:MM`**, or null |

### Newly available

Fields that previously did not exist, so anything you derived client-side can now come from the API:

- **`Itinerary`** — `country_code`, `timezone`, `start_date`, `end_date`, `traveler_count`,
  `budget_eur`, `estimated_spend_eur`, `cover_image_url`
- **`DayPlan`** — `title`, and `date` is now populated
- **`Activity`** — `activity_type` (icon and map-pin key), `venue_name`, `note`,
  `price_eur` + `price_is_estimated`, `ticket_url`
- **`FlightOption`** — `origin`, `destination`, `departs_at`, `arrives_at`, plus `booking_url`
- **`HotelOption`** — `booking_url`
- **`ThreadSummary`** — `country_code`, `start_date`, `end_date`, `cover_image_url`

### Workarounds you can now delete

| Your workaround | Replaced by |
|---|---|
| Activity time treated as a bucket | `time` is a real clock time |
| Weather derived from `weather_summary` strings | `day.weather`, with `weather_code` as a stable icon key |
| Sidebar cards without destination or thumbnail | `country_code` + `cover_image_url` on `ThreadSummary` |
| Hero image taken from the first hotel or activity photo | `Itinerary.cover_image_url` |
| Flights card captioned with the cheapest airline | `origin` → `destination` IATA, plus real times |
| Hotel rating assumed 0–5 | `guest_rating` is explicitly 0–10 |
| Place categories matched by keyword | `activity_type` enum |
| Travellers row replaced with Destination | `Itinerary.traveler_count` |

**Still client-side:** the per-category budget split (✈ / 🏨) — you get `budget_eur` and
`estimated_spend_eur`, not a breakdown. Hotel amenities remain unavailable; there is no such field.

### Two things to hold onto

**Every price is for the whole party** except `activity.price_eur`, which is per person. Read them
alongside `traveler_count` or they are meaningless.

**`estimated_spend_eur` and every `booking_url` are estimates and searches, not quotes.** The spend
figure sums the cheapest flight, the cheapest hotel and model-estimated activity prices; the links
are constructed searches, because no provider exposes a bookable deep link. Label both accordingly —
a user who clicks through to a different price will not blame the wording.

---

## Authentication

Endpoints marked 🔒 require an HTTP Bearer token:

```
Authorization: Bearer <access_token>
```

HS256 JWT, valid for `JWT_EXPIRE_HOURS` (default **24 hours**). A missing, expired, malformed or
claim-less token returns `401` with `{"detail": "Invalid or expired token"}`.

Errors use `{"detail": "..."}`. Validation failures return `422` with FastAPI's array form.

---

## Health

### `GET /health`
```json
{ "status": "ok", "service": "trip-planner" }
```

### `GET /health/db`
```json
{ "status": "ok", "database": "reachable" }
```
`500` if the database is unreachable.

---

## Auth

### `POST /auth/register`

| Field | Rules |
|-------|-------|
| `email` | required, valid address. **Stored and matched lowercase** |
| `password` | required, **8–30 characters** `[1]` |
| `first_name` / `last_name` | required, 1–100 chars |
| `country` | optional, exactly 2 characters (not checked against ISO 3166) |

**`201`** → `UserResponse`: `id`, `email`, `first_name`, `last_name`, `country`, `created_at`.
**Errors:** `409` email already registered · `422` validation.

`[1]` bcrypt cannot hash beyond 72 **bytes**, so length is validated on encoded bytes as well:
30 characters of CJK or emoji exceed the byte limit and are rejected with `422`.

### `POST /auth/login`

`email` + `password` (1–30 chars). **`200`** → `{ "access_token": "<jwt>", "token_type": "bearer" }`.
**Errors:** `401` `"Invalid email or password"` — same message for unknown email and wrong password.

Email matching is case-insensitive: registering `Ada@Example.com` and logging in as
`ada@example.com` works.

---

## Users

### `GET /me` 🔒
Returns `UserResponse`. Registered at exactly `/me`, no trailing slash.

---

## Trips

### `POST /trips` 🔒

Creates a trip and its thread, then runs the first planning turn **synchronously** — expect tens of
seconds. There are no other trip endpoints; the conversation continues through `/threads`.

**Body:** `{ "query": "..." }` — 10–1000 chars.

**`201`**
```json
{
  "trip": { "id": "...", "title": "...", "slug": "...", "destination": "...",
            "status": "ready", "created_at": "...", "updated_at": "..." },
  "thread_id": "uuid",
  "result": { "type": "itinerary", "itinerary": { } }
}
```

| Field | Notes |
|-------|-------|
| `title` | `"New trip"` until a turn produces an itinerary, then the itinerary's `short_title` |
| `slug` | Always `trip-<32 hex>`. Opaque; not a lookup key on any endpoint |
| `destination` | Null until an itinerary exists |
| `status` | `draft` \| `generating` \| `ready` \| `completed` \| `archived`. `ready` after an itinerary, `draft` after a clarification |

**Errors:** `401` · `422` · `500` the planner failed or produced neither result — the trip is
rolled back and its thread marked `failed`.

---

## Threads

### `GET /threads` 🔒

Non-deleted threads, newest-updated first, keyset paginated.

**Query:** `cursor` (opaque, from a previous `next_cursor`) · `limit` (default 20, 1–100).

```json
{
  "threads": [
    { "id": "uuid", "title": "Rome Escape", "slug": "trip-3f9a…",
      "status": "ready", "country_code": "IT",
      "start_date": "2026-09-12", "end_date": "2026-09-19",
      "cover_image_url": "/places/photos/places/ChIJ…/photos/AUc7t…",
      "created_at": "...", "updated_at": "..." }
  ],
  "next_cursor": "opaque-or-null"
}
```

`country_code`, `start_date`, `end_date` and `cover_image_url` come from the linked trip and are
**null until the first turn completes** — a thread exists before it has a trip.

`status`: `pending` | `running` | `ready` | `failed` | `deleted` (deleted are filtered out).

**Pagination:** ordered on `updated_at`. `next_cursor` is non-null whenever the page is *full*, so
following it can yield one final empty page — stop on null **or** empty.

**Errors:** `400` `"Invalid pagination cursor"` · `401` · `422` limit out of range.

### `GET /threads/{thread_id}` 🔒

Thread metadata plus one page of messages, newest first. Same `cursor`/`limit` params; message
cursors key on `created_at` and are not interchangeable with thread cursors.

```json
{
  "thread": { },
  "messages": [
    { "id": "uuid", "role": "human", "content": "...", "itinerary": null, "created_at": "..." }
  ],
  "next_cursor": "opaque-or-null"
}
```

| Field | Notes |
|-------|-------|
| `role` | **`"human"` or `"assistant"`** — not `"user"` |
| `content` | The itinerary's `summary`, or the clarification's `message` |
| `itinerary` | Full `Itinerary` on assistant turns that produced a plan; null otherwise |

**Errors:** `400` · `401` · `403` `"Access denied"` · `404` `"Thread not found"` · `422`.

### `POST /threads/{thread_id}/messages` 🔒

Follow-up message; runs the agent synchronously. **Body:** `{ "query": "..." }` — 1–1000 chars.

**`200`** → `{ "result": { PlannerResult } }`

**Errors:** `401` · `403` · `404` · **`409` `"A planning turn is already running"`** `[1]` ·
`422` · `500` as for `POST /trips`.

`[1]` A thread runs one turn at a time; a second request while one is in flight is rejected rather
than queued. Retry when the thread leaves `running`.

### `DELETE /threads/{thread_id}` 🔒

Soft-deletes the thread and its messages. **`204`**, empty body.
**Errors:** `401` · `403` · `404` · `422`.

> The trip, its itinerary versions and the agent's checkpoint are **not** deleted.

---

## Places

### `GET /places/photos/{photo_reference}` 🔒

Resolves a Google Places photo reference to an image. Forwards Google's `302` to a signed CDN URL,
keeping the API key server-side.

**This endpoint requires a bearer token.** `<img src>` cannot send a header, so a client must fetch
it and create an object URL (or proxy it).

**Path:** the reference must match `places/<id>/photos/<id>` — anything else is `400`.
**Query:** `max_width_px`, default 800, **1–4800**.

**`302`** with the CDN URL in `Location`.
**Errors:** `400` `"Invalid photo reference"` · `401` · `422` width out of range ·
`502` `"Photo unavailable"`.

Both `Activity.photo_url` and `ThreadSummary.cover_image_url` are already full paths for this
endpoint (`/places/photos/places/…/photos/…`) — prefix with the API base and request directly. Do
**not** pass them back in as `{photo_reference}`.

---

## Shared types

### `PlannerResult`

Discriminated on `type`.

**`type: "clarification"`** — the planner needs more before it can plan:
```json
{ "type": "clarification",
  "clarification": { "message": "How long, and how many of you?",
                     "missing_fields": ["duration", "traveler_count"] } }
```

`missing_fields` is authoritative and drawn from `destination` · `duration` · `traveler_count`.
**Budget is asked for in the message but never blocks.** Send the answer to
`POST /threads/{id}/messages`; a partial answer produces another clarification rather than a plan.

**`type: "itinerary"`** — a full plan. See below.

### `Itinerary`

| Field | Type | Notes |
|---|---|---|
| `destination` | `string` | required |
| `total_days` | `int` | required |
| `short_title` | `string` | 2–3 words; becomes the trip and thread title |
| `summary` | `string` | required, 2–4 sentences; never mentions prices or providers |
| `country_code` | `string \| null` | ISO 3166-1 alpha-2, resolved from the destination |
| `timezone` | `string \| null` | IANA, e.g. `"Europe/Rome"` |
| `start_date` / `end_date` | `string \| null` | ISO dates, derived from the flights |
| `traveler_count` | `int \| null` | Party size **every price below is for** |
| `budget_eur` | `float \| null` | Total budget the user stated |
| `estimated_spend_eur` | `float \| null` | `[1]` |
| `cover_image_url` | `string \| null` | Photo path for the destination |
| `days` | `DayPlan[]` | required |
| `flights` / `hotels` / `sources` | arrays | default `[]` |

`[1]` **An estimate, not a total.** Cheapest flight + cheapest hotel stay + every priced activity —
flights and hotels are alternatives, so one of each counts. Activity prices are model estimates.
Null when nothing is priced. Label it as an estimate in the UI.

### `DayPlan`

| Field | Type | Notes |
|---|---|---|
| `day` | `int` | required, 1-based |
| `date` | `string \| null` | ISO; `start_date + (day − 1)` |
| `title` | `string \| null` | e.g. `"Arrival & Trastevere"`. Falls back to `location` |
| `location` | `string` | required |
| `weather` | `DayWeather \| null` | Null beyond the ~16-day forecast horizon |
| `activities` | `Activity[]` | required |

### `DayWeather`

`condition` (`"Clear"`, `"Partly cloudy"`, `"Rain"`, …) · `weather_code` (WMO, stable icon key) ·
`temp_max_c` · `temp_min_c`. All nullable.

### `Activity`

Guaranteed: `id`, `description`, `activity_type`. Everything else is nullable; list fields default
to `[]` and are never null.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Server-assigned UUID, stable across turns |
| `time` | `string \| null` | **Always `HH:MM`** on a 24-hour clock, or null |
| `activity_type` | enum | `flight` `train` `transfer` `hotel` `meal` `cafe` `drinks` `museum` `landmark` `church` `walk` `nature` `viewpoint` `shopping` `class` `nightlife` `other` — icon and map-pin key |
| `description` | `string` | required |
| `venue_name` | `string \| null` | The specific place, e.g. `"Da Enzo al 29"` |
| `note` | `string \| null` | One short tip, e.g. `"Book tickets in advance"` |
| `duration_hours` | `float \| null` | |
| `price_eur` | `float \| null` | Per person |
| `price_is_estimated` | `bool` | **Always `true` when `price_eur` is set** `[1]` |
| `ticket_url` | `string \| null` | Venue website, else a ticket search `[2]` |
| `photo_url` | `string \| null` | Path for `GET /places/photos/...` |
| `place_id`, `latitude`, `longitude`, `address`, `rating`, `user_rating_count`, `price_level`, `website_url`, `phone`, `business_status`, `editorial_summary`, `google_maps_url` | nullable | From Google Places |
| `opening_hours`, `categories`, `sources` | arrays | default `[]` |

`[1]` No provider prices activities, so any figure is model-supplied. The flag is forced, not
trusted — a guess can never be presented as a quoted price.
`[2]` `rating` here is a Google 0–5 place rating. Unrelated to hotel ratings.

### `FlightOption`

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | UUID, stable across turns |
| `airline` | `string` | required |
| `stops` | `int` | required, 0 = direct |
| `origin` / `destination` | `string \| null` | IATA, e.g. `"LHR"` → `"FCO"` |
| `departs_at` / `arrives_at` | `string \| null` | ISO datetimes for the outbound leg; arrival is the **last** segment's |
| `duration_min` | `int \| null` | |
| `price` | `float \| null` | For the whole party |
| `currency` | `string \| null` | Normalised to EUR |
| `outbound_date` | `string` | required, from the offer |
| `return_date` | `string \| null` | From the offer's return leg |
| `booking_url` | `string \| null` | **A search link, not a quote** `[1]` |
| `sources` | `Source[]` | default `[]` |

### `HotelOption`

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | UUID, stable across turns |
| `name` | `string` | required |
| `area` | `string \| null` | |
| `star_rating` | `float \| null` | **Property class, 0–5** |
| `guest_rating` | `float \| null` | **Guest review score, 0–10** — the ★8.9 figure |
| `nightly_price` / `total_price` | `float \| null` | |
| `is_estimated` | `bool` | `nightly_price` is an estimate, not a quoted rate |
| `currency` | `string \| null` | |
| `latitude` / `longitude` | `float \| null` | |
| `booking_url` | `string \| null` | **A search link, not a quote** `[1]` |
| `photo_url` | `string \| null` | Absolute provider URL — *not* the photo proxy |
| `sources` | `Source[]` | default `[]` |

`[1]` No provider exposes a bookable deep link, so these are constructed searches. The price shown
is not guaranteed at the far end — do not present them as a booking.

### `Source`

`{ "title": "...", "url": "https://..." }`. Entries without an `http(s)` URL are dropped server-side.

---

## Notes for clients

- **Long requests.** `POST /trips` and `POST /threads/{id}/messages` run the agent inline, with a
  120-second ceiling. No streaming or polling endpoint. Combined with the `409` above, don't let a
  user fire a second message while one is running.
- **Cursors are opaque.** Base64 `(timestamp, id)`. Never construct or mutate one; malformed is `400`.
- **Prices are per party**, not per person — read them alongside `traveler_count`. Activity
  `price_eur` is the exception and is per person.
- **Stable ids.** `Activity.id`, `FlightOption.id` and `HotelOption.id` survive across turns; safe
  keys for diffing and list rendering.
- **Older trips lack newer fields.** Itineraries are stored as snapshots, so a trip planned before a
  field existed returns null for it rather than failing. Treat every nullable field as genuinely
  optional.
