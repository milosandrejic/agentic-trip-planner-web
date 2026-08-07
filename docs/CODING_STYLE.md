# Coding Style Guide

## File & Component Naming

- **File naming**: Use kebab-case for all files (`sign-in-view.jsx`, `account-drawer.jsx`)
- **Component exports**: Use named exports only (`export function ComponentName() {}`)
- **Exception**: Next.js route files (`page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, `template.tsx`) must use `export default`
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
```javascript
// No "use client" - purely presentational
export function StaticCard({ title, description }) {
  return (
    <Card>
      <Typography>{title}</Typography>
      <Typography>{description}</Typography>
    </Card>
  );
}

// "use client" required - uses useState hook
"use client";

export function InteractiveButton() {
  const [count, setCount] = useState(0);

  return <Button onClick={() => setCount(count + 1)}>{count}</Button>;
}
```

❌ **Avoid:**
```javascript
// Unnecessary "use client" for static component
"use client";

export function StaticCard({ title }) {
  return <Card><Typography>{title}</Typography></Card>;
}
```

## Import Conventions

### Tree-Shaking Optimized Imports
**ALWAYS use named imports** for third-party libraries to enable tree-shaking:

✅ **Correct:**
```javascript
// Material-UI - grouped named imports
import { Box, Button, Typography, Card, Alert } from "@mui/material";
import { LoadingButton, DatePicker } from "@mui/lab";
import { AddIcon, EditIcon } from "@mui/icons-material";

// React & Router - named imports
import { useState, useEffect, useCallback, useMemo } from "react";
import { Navigate, useNavigate } from "react-router";

// Utilities - individual function imports
import debounce from "lodash/debounce";
import dayjs from "dayjs";

// Internal - absolute imports with @ prefix
import { useAuthContext } from "@/auth/hooks";
import { Iconify } from "@/components/iconify";
import { paths } from "@/routes/paths";
```

❌ **Avoid:**
```javascript
// Prevents tree-shaking
import * as MUI from "@mui/material";
import * as React from "react";
import _ from "lodash";

// Relative parent imports
import { Component } from "../../components/component";
```

### Import Formatting
- **Single import**: `import { Component } from "library"`
- **Multiple imports (2+)**: Use multiline format with each import on its own line:
```javascript
import {
  Component1,
  Component2,
  Component3
} from "library";
```
- **Closing brace** `}` should be on its own line
- Each named import should be on a separate line for better readability and git diffs

## JSX Formatting Rules

### Conditional Rendering
- **NO ternary operators** in JSX unless component has 0-1 props
- **Use guard clauses** and `&&` operator with proper formatting
- **Opening brace** `{` always on its own line
- **Condition** on its own line, followed by `&&` on the same line
- **Component** on the next line with proper indentation

✅ **Correct:**
```jsx
export function AlertComponent({ message, isVisible, type }) {
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
        type === 'error' &&
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
```jsx
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

```jsx
<LoadingButton
  variant="contained"
  size="large"
  onClick={handleSubmit}
  loading={isSubmitting}
>
  Sign In
</LoadingButton>

<Field
  name="email"
  label="Email address"
  placeholder="example@gmail.com"
  InputLabelProps={{ shrink: true }}
/>
```

✅ **Correct spacing between sibling components:**
```jsx
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
    Join thousands of property owners
  </Typography>

  <Button
    variant="contained"
    size="large"
    endIcon={<ArrowForward />}
    sx={{
      color: "white",
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

```jsx
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
```jsx
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
```jsx
export function SignInView() {
  const [errorMsg, setErrorMsg] = useState("");
  const password = useBoolean();

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" }
  });

  if (checkUserSession) {
    return <Navigate to={paths.dashboard} replace />;
  }

  return (
    <Card>
      {
        errorMsg &&
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {errorMsg}
        </Alert>
      }

      <Form methods={methods} onSubmit={onSubmit}>
        <Field
          name="email"
          label="Email address"
          InputLabelProps={{ shrink: true }}
        />
      </Form>
    </Card>
  );
}
```

## TypeScript Conventions

### Component Structure
```jsx
// Standard component pattern
export function ComponentName({ prop1, prop2, ...other }) {
  // Hook declarations first
  const [state, setState] = useState(initialValue);
  const { data } = useSWR(key, fetcher);

  // Derived values
  const computedValue = useMemo(() =>
    expensiveComputation(state), [state]
  );

  // Event handlers
  const handleClick = useCallback((event) => {
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
├── assets/
├── components/
├── config/
├── constants/
├── context/
├── hooks/
├── layouts/
├── pages/
├── routes/
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
const { data } = useTrips();
```

## React Query

- Server state belongs in React Query.
- Never fetch data manually inside useEffect.
- Queries should live inside custom hooks.
- Mutations should be reusable.

Example:

```tsx
export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
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