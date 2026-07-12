# Frontend Testing

This document describes the frontend test setup and all frontend test suites currently present in the repository.

## Test Stack

- Runner: `vitest`
- DOM test utilities: `@testing-library/react`
- Matchers: `@testing-library/jest-dom`
- Environment: `jsdom`

Configured script in `frontend/package.json`:

- `test`: `vitest run`

Relevant configuration in `frontend/vitest.config.js`:

- `environment: 'jsdom'`
- `globals: true`
- `reporters: ['verbose']`
- Alias `@` to `frontend/src`

## How To Run

```bash
cd frontend
npm test
```

## Existing Test Suites

- `frontend/src/lib/api.test.js`
  - Verifies API request behavior
  - Covers normal responses, token refresh flow on `419`, and refresh failure handling

- `frontend/src/middleware/routeGuards.test.jsx`
  - Verifies route guard behavior
  - Covers authenticated/unauthenticated redirects and role-based access routing

- `frontend/src/hooks/useUsers.test.jsx`
  - Verifies users hook behavior
  - Covers reset on query change, pagination append logic, and no-op when `hasNext` is false

- `frontend/src/hooks/useTicketStats.test.jsx`
  - Verifies ticket stats hook behavior
  - Covers fallback/default filling for missing status keys

- `frontend/src/hooks/usePasswordValidation.test.js`
  - Verifies password validation hook rules
  - Covers each password rule and global valid state

## Result Interpretation

- Exit code `0`: all tests passed
- Non-zero exit code: at least one test failed

## Conventions For New Frontend Tests

- Add tests close to modules in `frontend/src/` with `*.test.js` or `*.test.jsx` naming.
- Use Vitest + Testing Library for React-related tests.
- Mock API, providers, and context with `vi.mock` / `vi.hoisted` when isolation is needed.
