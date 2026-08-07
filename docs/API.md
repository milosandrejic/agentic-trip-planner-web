## Authentication

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

---

## Health

### `GET /health`
Service liveness check. No auth required.

**Response `200`**
```json
{ "status": "ok", "service": "trip-planner" }
```

---

### `GET /health/db`
Database reachability check. No auth required.

**Response `200`**
```json
{ "status": "ok", "database": "reachable" }
```

---

## Auth

### `POST /auth/register`
Register a new user account.

**Request body**
```json
{
  "email": "user@example.com",
  "password": "min8chars",
  "first_name": "Jane",
  "last_name": "Doe",
  "country": "DE"        // optional, ISO 2-letter code
}
```

**Response `201`**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "country": "DE",
  "created_at": "2026-08-07T10:00:00Z"
}
```

**Errors:** `409` — email already registered

---

### `POST /auth/login`
Authenticate and receive a JWT.

**Request body**
```json
{
  "email": "user@example.com",
  "password": "min8chars"
}
```

**Response `200`**
```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

**Errors:** `401` — invalid credentials

---

## Users

### `GET /me` 🔒
Get the authenticated user's profile.

**Response `200`**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "country": "DE",
  "created_at": "2026-08-07T10:00:00Z"
}
```

---

## Trips

### `POST /trips` 🔒
Create a new trip and run the first AI planning turn. This is the entry point for starting a trip conversation.

**Request body**
```json
{
  "query": "7 days in Tokyo, budget €2000, mid-September"  // 10–1000 chars
}
```

**Response `201`**
```json
{
  "trip": {
    "id": "uuid",
    "title": "Tokyo Adventure",
    "slug": "tokyo-adventure",
    "destination": "Tokyo, Japan",
    "status": "ready",          // draft | generating | ready | completed | archived
    "created_at": "...",
    "updated_at": "..."
  },
  "thread_id": "uuid",
  "result": { /* PlannerResult — see below */ }
}
```

---

## Threads

### `GET /threads` 🔒
List the current user's threads (newest first), with keyset pagination.

**Query params**
| Param | Default | Description |
|-------|---------|-------------|
| `cursor` | — | Opaque string from previous `next_cursor` |
| `limit` | `20` | 1–100 |

**Response `200`**
```json
{
  "threads": [
    {
      "id": "uuid",
      "title": "Tokyo Adventure",
      "slug": "tokyo-adventure",
      "status": "ready",        // pending | running | ready | failed | deleted
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "next_cursor": "opaque-string-or-null"
}
```

---

### `GET /threads/{thread_id}` 🔒
Get thread metadata and a paginated page of messages (newest first).

**Path param:** `thread_id` — UUID

**Query params**
| Param | Default | Description |
|-------|---------|-------------|
| `cursor` | — | Opaque string from previous `next_cursor` |
| `limit` | `20` | 1–100 |

**Response `200`**
```json
{
  "thread": { /* ThreadSummary */ },
  "messages": [
    {
      "id": "uuid",
      "role": "user | assistant",
      "content": "plain text message",
      "itinerary": { /* Itinerary or null */ },
      "created_at": "..."
    }
  ],
  "next_cursor": "opaque-string-or-null"
}
```

**Errors:** `404` — thread not found, `403` — not the owner

---

### `POST /threads/{thread_id}/messages` 🔒
Send a follow-up message to an existing thread and get an updated AI result.

**Path param:** `thread_id` — UUID

**Request body**
```json
{
  "query": "Can you add a day trip to Nikko?"  // 1–1000 chars
}
```

**Response `200`**
```json
{
  "result": { /* PlannerResult — see below */ }
}
```

**Errors:** `404` — thread not found, `403` — not the owner

---

### `DELETE /threads/{thread_id}` 🔒
Soft-delete a thread and all its messages. Irreversible from the API.

**Response `204` No Content**

**Errors:** `404` — thread not found, `403` — not the owner

---

## Places

### `GET /places/photos/{photo_reference}` 🔒
Resolve a Google Places photo reference into a real image. The server redirects `302` to a signed CDN URL (keyless for the client). The `photo_reference` value comes from `Activity.photo_url` fields inside an itinerary.

**Query params**
| Param | Default | Description |
|-------|---------|-------------|
| `max_width_px` | `800` | Max image width in pixels |

**Response `302` Redirect** → signed Google CDN image URL

**Errors:** `502` — photo unavailable from Google

---

## Shared Types

### `PlannerResult` (discriminated union)

Every AI turn returns one of two shapes identified by the `type` field:

**`type: "itinerary"`** — the agent produced a full plan:
```json
{
  "type": "itinerary",
  "itinerary": {
    "destination": "Tokyo, Japan",
    "total_days": 7,
    "summary": "A 7-day cultural and culinary journey...",
    "days": [
      {
        "day": 1,
        "date": "2026-09-14",
        "location": "Shinjuku",
        "weather_summary": "Sunny, 24°C",
        "activities": [
          {
            "id": "uuid",
            "time": "Morning",
            "description": "Visit Shinjuku Gyoen",
            "duration_hours": 2.0,
            "place_id": "ChIJ...",
            "latitude": 35.685,
            "longitude": 139.710,
            "address": "11 Naitomachi, Shinjuku",
            "rating": 4.6,
            "user_rating_count": 18000,
            "opening_hours": ["Monday: 9:00–18:00", "..."],
            "price_level": "PRICE_LEVEL_INEXPENSIVE",
            "price_eur": 2.50,
            "ticket_url": "https://...",
            "photo_url": "places/ChIJ.../photos/...",   // pass to GET /places/photos/...
            "website_url": "https://...",
            "phone": "+81-3-...",
            "business_status": "OPERATIONAL",
            "categories": ["park", "tourist_attraction"],
            "editorial_summary": "A peaceful garden oasis...",
            "google_maps_url": "https://maps.google.com/...",
            "sources": [{ "title": "Tokyo Tourism", "url": "https://..." }]
          }
        ]
      }
    ],
    "flights": [
      {
        "id": "uuid",
        "airline": "ANA",
        "stops": 0,
        "duration_min": 720,
        "price": 620.00,
        "currency": "EUR",
        "outbound_date": "2026-09-14",
        "return_date": "2026-09-21",
        "booking_url": "https://...",
        "sources": []
      }
    ],
    "hotels": [
      {
        "id": "uuid",
        "name": "Hotel Gracery Shinjuku",
        "area": "Shinjuku",
        "rating": 4.2,
        "nightly_price": 95.00,
        "is_estimated": false,
        "total_price": 665.00,
        "currency": "EUR",
        "latitude": 35.694,
        "longitude": 139.703,
        "booking_url": "https://...",
        "photo_url": "https://...",
        "sources": []
      }
    ],
    "sources": [{ "title": "...", "url": "https://..." }]
  }
}
```

**`type: "clarification"`** — the agent needs more info before planning:
```json
{
  "type": "clarification",
  "clarification": {
    "message": "Could you tell me your approximate budget and travel dates?",
    "missing_fields": ["budget", "travel_dates"]
  }
}
```

When you receive `type: "clarification"`, display `clarification.message` to the user and send their answer as a follow-up via `POST /threads/{thread_id}/messages`.

---

> **Note on `photo_url` in activities:** the value is a Google Places photo resource path (e.g. `places/ChIJ.../photos/AUc7t...`). Pass it verbatim as the path param to `GET /places/photos/{photo_reference}` to get the actual image via redirect.

Created 2 todos