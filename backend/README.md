# Backend Testing

This document describes the backend test setup and all backend test suites currently present in the repository.

## Test Stack

- Runner: Node.js built-in test runner (`node:test`)
- Assertions: `node:assert/strict`
- Mocking style: `t.mock.method(...)`

Configured script in `backend/package.json`:

- `test`: `node --test`

## How To Run

```bash
cd backend
npm test
```

## Existing Test Suites

Location: `backend/test/`

- `authorized.middleware.test.js`
  - Verifies authorization middleware behavior (`adminOnly`, `requireTicketAccess`, `requireUserAccess`)
  - Covers access granted/denied paths and `TicketNotFound` handling

- `protect.middleware.test.js`
  - Verifies hybrid authentication middleware
  - Covers valid token+session flow, missing token, malformed token, and session/token mismatch

- `error.middleware.test.js`
  - Verifies error mapping strategy
  - Covers `HttpError` passthrough, Mongoose `CastError` to `InvalidObjectId`, and generic `500` fallback

- `pagination.util.test.js`
  - Verifies regex escaping and positive integer parsing helper behavior

- `ticket.controller.test.js`
  - Verifies ticket controller logic
  - Covers admin/non-admin scoping, ticket creation permissions, update restrictions, and stats filters

- `ticket.model.test.js`
  - Verifies ticket model business rules
  - Covers status transitions, required assignment before transition, and admin-only assignment rule

- `user.controller.test.js`
  - Verifies user controller logic
  - Covers search filter building and role edit flow propagation

- `user.model.test.js`
  - Verifies user role mutation rules
  - Covers admin self-role change rejection and admin editing another user

## Result Interpretation

- Exit code `0`: all tests passed
- Non-zero exit code: at least one test failed

## Conventions For New Backend Tests

- Add new files to `backend/test/` with naming `*.test.js`.
- Prefer focused tests with mocked dependencies for controller/middleware units.
- Keep using `node:test` and `node:assert/strict` to stay consistent with the existing setup.
