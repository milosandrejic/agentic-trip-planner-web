# Coding Style Guide

## Enforced by ESLint — run `npm run lint:fix`

`npm run lint` runs with `--max-warnings=0`, so a warning fails the build exactly like an
error. Do not hand-format for these; `lint:fix` does it. Every rule below was verified
against `eslint.config.mjs`.

- **kebab-case filenames** under `src/` — `check-file/filename-naming-convention`
- **Named exports only** under `src/`; `export default` is allowed *only* in Next route
  files (`page` `layout` `error` `loading` `not-found` `template`) — `import/no-default-export`
- **No relative parent imports** (`../`); use `@/` — `import/no-relative-parent-imports`
- **Import groups and order** — external → `@mui/*` → `@/hooks` → `@/utils` → internal →
  `@/components` → `@/types` → relative, each group sorted by line length ascending —
  `perfectionist/sort-imports`, `perfectionist/sort-named-imports`
- **2+ named imports break across lines** — `{` and `}` each on their own line —
  `object-curly-newline`
- **Never `any`** — `@typescript-eslint/no-explicit-any`
- **Ternaries stay on one line** — `@stylistic/multiline-ternary: never`
- **One JSX prop per line** when the tag is multiline, first prop on its own line —
  `@stylistic/jsx-max-props-per-line`, `@stylistic/jsx-first-prop-new-line`
- **Self-closing components**, no `={true}`, no `{"string"}` braces — `react/self-closing-comp`,
  `react/jsx-boolean-value`, `react/jsx-curly-brace-presence`
- **Braces on every control statement** — `curly`
- **Double quotes, semicolons, 2-space indent, trailing commas on multiline, arrow parens
  always, spaces inside object braces**
- **No unused imports or variables** (`_` prefix to opt out), newline after the import block,
  no trailing whitespace, max one consecutive blank line, file ends in a newline
- **`consistent-return`** and **`no-shadow`**

Everything below this point is convention ESLint *cannot* check. That is the part worth
your attention.

## File & Component Naming

- **Component exports**: Use named exports only (`export function ComponentName() {}`)
- **Component organization**: One component per file unless tightly coupled

## "use client" Directive (Next.js)

**Only add "use client" when explicitly required** - Next.js components are Server Components by default.

### When "use client" IS required:
- Using React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, etc.)
- Using browser-only APIs (`window`, `document`, `localStorage`, etc.)
- Using event handlers that require interactivity (`onClick`, `onChange`, etc.)
- Using Context providers that manage state
- Using third-party libraries that depend on client-side features

### When "use client" is NOT needed:
- Pure presentational components with no interactivity
- Components that only render static content
- Components using only Server Component features

✅ **Correct:**
```tsx
// No "use client" - purely presentational
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <Box>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="body1">{subtitle}</Typography>
    </Box>
  );
}

// "use client" required - uses useState hook
"use client";

export function ChatPanel() {
  const [draft, setDraft] = useState("");

  return <ChatInput value={draft} onChange={setDraft} />;
}
```

❌ **Avoid:**
```tsx
// Unnecessary "use client" for static component
"use client";

export function SectionHeading({ title }: SectionHeadingProps) {
  return <Typography variant="h2">{title}</Typography>;
}
```

## Import Conventions

### Tree-Shaking Optimized Imports
**ALWAYS use named imports** for third-party libraries to enable tree-shaking:

✅ **Correct:**
```tsx
// Next.js
import NextLink from "next/link";
import { usePathname } from "next/navigation";

// Material-UI - grouped named imports
import {
  Box,
  Button,
  Typography,
} from "@mui/material";

// React & data layer - named imports
import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// Internal - absolute imports with @ prefix
import { useThreads } from "@/hooks/use-threads";
import { getFlagEmoji } from "@/utils/country";
import { StatusChip } from "@/components/status-chip/status-chip";

// Types last, as type imports
import type { ThreadSummary } from "@/types/api";
```

❌ **Avoid:**
```tsx
// Prevents tree-shaking
import * as MUI from "@mui/material";
import * as React from "react";

// Relative parent imports
import { StatusChip } from "../../components/status-chip/status-chip";
```

### Import Formatting
- **Single import**: `import { Component } from "library"`
- **Multiple imports (2+)**: Use multiline format with each import on its own line:
```tsx
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
```
- **Closing brace** `}` should be on its own line
- Each named import should be on a separate line for better readability and git diffs

> ESLint enforces only that the braces break onto their own lines, not that each name gets
> its own line. `{ Box, Button, Typography }` collapsed onto one interior line passes lint
> and still violates this rule. Keep one name per line yourself.

## JSX Formatting Rules

### Conditional Rendering
- **NO ternary operators** in JSX unless component has 0-1 props
- **Use guard clauses** and `&&` operator with proper formatting
- **Opening brace** `{` always on its own line
- **Condition** on its own line, followed by `&&` on the same line
- **Component** on the next line with proper indentation

✅ **Correct:**
```tsx
export function AlertComponent({ message, isVisible, type }: AlertComponentProps) {
  if (!message) return null;

  return (
    <div>
      {
        isVisible &&
        <Alert
          type={type}
          message={message}
        />
      }

      {
        type === "error" &&
        <Iconify
          icon="eva:alert-circle-fill"
          color="error.main"
        />
      }
    </div>
  );
}
```

✅ **Allowed (simple ternary with 0-1 props):**
```tsx
return (
  <div>
    {
      isReady ? <LoadingScreen /> : <EmptyContent />
    }
  </div>
);
```

### Multiline JSX
- **2+ props**: Always use multiline formatting
- **Props alignment**: Each prop on its own line, properly indented
- **Closing tag**: Self-closing components end with `/>` on the last prop line
- **Empty line spacing**: Add empty line between sibling components at the same level for better readability

```tsx
<Button
  variant="contained"
  size="large"
  onClick={handleSubmit}
  disabled={isSubmitting}
>
  Sign In
</Button>

<TextField
  id="sign-in-password"
  type="password"
  placeholder="••••••••"
  autoComplete="current-password"
/>
```

✅ **Correct spacing between sibling components:**
```tsx
<Box sx={{ textAlign: "center" }}>
  <Typography
    variant="h2"
    component="h2"
    sx={{
      fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
      fontWeight: 700,
      mb: 3,
    }}
  >
    Ready to get started?
  </Typography>

  <Typography
    variant="h6"
    sx={{
      fontSize: { xs: "1.1rem", md: "1.2rem" },
      mb: 4,
      opacity: 0.95,
    }}
  >
    Plan your next trip in minutes
  </Typography>

  <Button
    variant="contained"
    size="large"
    endIcon={<ArrowForward />}
    sx={{
      px: 5,
      py: 2,
    }}
  >
    Get Started
  </Button>
</Box>
```

### Loop Rendering
- **Opening brace** `{` on its own line
- **Map function** starts on next line with proper indentation
- **Arrow function** with parentheses when returning JSX
- **Component** properly indented inside the map

```tsx
{
  items.map((item) => (
    <MenuItem
      key={item.id}
      value={item.value}
      onClick={() => handleSelect(item)}
    >
      {item.label}
    </MenuItem>
  ))
}
```

✅ **Correct - with multiple statements:**
```tsx
{
  features.map((feature, index) => {
    const Icon = feature.icon;

    return (
      <Grid size={{ xs: 12, md: 4 }} key={index}>
        <Card>
          <Icon />
          <Typography>{feature.title}</Typography>
        </Card>
      </Grid>
    );
  })
}
```

## Function & Component Spacing

### Spacing Rules
- **Empty line before return** unless function starts with return
- **Empty line after variable declarations** before logic
- **Empty line before if conditions** unless function starts with if
- **Empty line around conditional rendering blocks** when not first/last child

✅ **Correct:**
```tsx
export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box>
      {
        errors.root &&
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {errors.root.message}
        </Alert>
      }

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <TextField
          {...register("email")}
          id="sign-in-email"
          placeholder="you@example.com"
        />
      </form>
    </Box>
  );
}
```

## TypeScript Conventions

### Component Structure
```tsx
// Standard component pattern
export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Hook declarations first
  const [state, setState] = useState(initialValue);
  const { data } = useThread(threadId);

  // Derived values
  const computedValue = useMemo(() => expensiveComputation(state), [state]);

  // Event handlers
  const handleClick = useCallback((event: MouseEvent) => {
    // handler logic
  }, [dependencies]);

  // Early returns/guards
  if (!data) return <LoadingSkeleton />;

  return (
    <Box>
      {/* Component JSX */}
    </Box>
  );
}
```

## Types

- Never use `any`.
- Prefer `unknown` over `any`.
- Prefer explicit interfaces for component props.
- Reuse existing types whenever possible.

## Project Structure

Follow the existing project structure.

Do NOT reorganize the application into a feature-based architecture.

Current structure:

```text
src/
├── api/
├── app/
├── assets/
├── components/
├── config/
├── constants/
├── context/
├── hooks/
├── layouts/
├── services/
├── theme/
├── types/
├── utils/
```

Rules:

- Place new files into the appropriate existing folder.
- Do not introduce new top-level folders unless explicitly requested.
- Follow the existing architecture.
- Prefer extending existing modules over creating new abstractions.

### Function Preferences
- **Function declarations** preferred over arrow functions for components
- **Named exports only** - no default exports
- **Absolute imports** required for `@/` paths (@ = src)

## API Layer

Never call APIs directly from components.

Always place API logic inside:

- api/
- services/

Components should consume hooks or service functions only.

Example:

❌ Avoid

```tsx
useEffect(() => {
  axios.get("/trips");
}, []);
```

✅ Correct

```tsx
const { data } = useThreads();
```

## React Query

- Server state belongs in React Query.
- Never fetch data manually inside useEffect.
- Queries should live inside custom hooks.
- Mutations should be reusable.

Example:

```tsx
export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTripRequest) => createTrip(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
    },
  });
}
```

## Material UI

- Prefer MUI components over custom HTML.
- Use theme spacing.
- Use theme typography.
- Avoid hardcoded colors.
- Reuse existing design tokens.

## Error Handling

- Never silently ignore errors.
- Display user-friendly messages.
- Log unexpected errors.
- Never ignore rejected promises.

## Performance

- Don't optimize prematurely.
- Use useMemo only when necessary.
- Use useCallback only when necessary.
- Avoid unnecessary re-renders.

## AI Assistant Rules

Before creating anything new:

1. Search for an existing component.
2. Search for an existing hook.
3. Search for an existing service.
4. Search for an existing utility.
5. Search for an existing type.

Do NOT duplicate functionality.

Do NOT redesign the project architecture.

Do NOT introduce a new folder structure.

Always follow the existing project conventions.

If multiple solutions are possible, choose the one that is most consistent with the current codebase.

## Forms

- Use React Hook Form for all forms.
- Use Zod for validation.
- Never manually validate form fields inside components.
- Keep validation schemas close to the form.

## Golden Rule

Every new file should feel like it has always been part of this project.

Consistency is more important than cleverness.
