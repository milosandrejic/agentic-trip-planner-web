---
paths:
  - "src/components/**"
  - "src/app/**"
  - "src/layouts/**"
---

# UI

- **Conditional JSX**: `{` on its own line, the condition then `&&` on the same line, the
  component indented below, `}` on its own line. No ternary unless it has 0–1 props.
- **`"use client"` only when required** — hooks, browser APIs, event handlers, or a context
  provider. A purely presentational component stays a server component.
- **Theme, never literals** — colours, spacing and typography come from `src/theme/*`.
  No hardcoded `rgba()`/hex in `sx`.
- **Sparse-first**: build the empty case as the default, not the edge. Absent data omits its
  element — never "N/A", "€0", an empty panel or a placeholder icon. Weather is null on
  *every* day for trips beyond ~16 days, and activity prices are usually null.
- **Prices** are per party except `Activity.price_eur` (per person). Show one against
  `traveler_count`, or say "total" when the count is null.
- **Honest labels**: "Find" / "View options" / "Search" — never "Book". Mark
  `estimated_spend_eur`, `price_is_estimated` and `is_estimated` as estimates.
- Match the screen in `design/*.png`.

Detail: `docs/CODING_STYLE.md` · `docs/PRODUCT_RULES.md`
