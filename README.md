# IT Ticketing Manager

![Node](https://img.shields.io/badge/node-20%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/express-5-000000?logo=express&logoColor=white)

Full-stack IT helpdesk portal to open, assign, track, and update support tickets.

The project is split into:

- `backend/`: Express REST API + MongoDB
- `frontend/`: React SPA + Vite

## Main Features

- Email/password authentication with JWT tokens and server-side sessions (`connect.sid` cookie)
- Google OAuth 2.0 sign-in via Passport redirect flow (`/api/auth/google` -> `/api/auth/google/callback`)
- Safe OAuth policy: if a Google email already belongs to a local account, sign-in is blocked
- `user` / `admin` roles with backend authorization checks
- Ticket management with search, filters, sorting, grouping, and pagination
- Controlled ticket lifecycle (`open`, `in_progress`, `on_hold`, `resolved`)
- Ticket comments
- Admin endpoints for users and ticket stats
- Theme switch between light and dark

## Requirements And Prerequisites

- Node.js 20+
- npm
- MongoDB (local or Atlas)

Required environment variables:

- Backend: see `backend/.env.example`
- Frontend: see `frontend/.env.example`

Backend example (`backend/.env`):

```env
NODE_ENV=development
PORT=4545
MONGODB_CONNECTION_STRING=xxxxxxxxx

API_RATE_LIMIT_WINDOW_MINUTES=15
API_RATE_LIMIT_MAX_REQUESTS=500

AUTH_RATE_LIMIT_WINDOW_MINUTES=15
AUTH_RATE_LIMIT_MAX_REQUESTS=5

JWT_SIGN_SECRET=xxxxxxxxx
JWT_DURATION=15m

SESSION_SECRET=xxxxxxxxx
SESSION_TIMEOUT_MINUTES=20

FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_LOGIN_PATH=/auth/login
FRONTEND_OAUTH_CALLBACK_PATH=/auth/callback

GOOGLE_CLIENT_ID=xxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:4545/api/auth/google/callback
```

Frontend example (`frontend/.env`):

```env
VITE_API_SERVER=http://localhost:4545
```

## Installation And Setup

1. Clone the repository:

```bash
git clone https://github.com/GentilOfficial/IT-ticketing-manager.git
cd IT-ticketing-manager
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Create `.env` files in `backend/` and `frontend/` from the `.env.example` files.

## Local Development

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Project Structure

```text
IT-ticketing-manager/
|- backend/
|  |- config/         # bootstrap server, db, session, rate limit, docs
|  |- controllers/    # endpoint logic (auth, ticket, comment, user)
|  |- middleware/     # route protection, authorization, validation, errors
|  |- models/         # Mongoose schemas (User, Ticket, Comment)
|  |- routes/         # REST endpoint definitions
|  |- utils/          # helpers (custom errors, response, token, pagination)
|  |- test/           # backend tests with Node test runner
|  `- docs/           # OpenAPI spec
|- frontend/
|  |- public/
|  `- src/
|     |- components/  # UI components
|     |- context/     # auth state
|     |- hooks/       # data-fetching/form logic and related tests
|     |- layouts/
|     |- lib/         # API client, utilities
|     |- middleware/  # client-side route guards
|     |- pages/
|     `- providers/
`- README.md
```

## API Documentation (OpenAPI + Scalar)

OpenAPI specification file:

- `backend/docs/openapi.yaml`

Scalar interactive UI is served by the backend at:

- `http://localhost:4545/docs`

Spec raw:

- `http://localhost:4545/docs/openapi.yaml`

Command to start the backend with docs available:

```bash
cd backend
npm run docs
```

Authentication notes:

- Protected endpoints require **both** `Authorization` header with the raw JWT token (no `Bearer` prefix) and `connect.sid` session cookie.
- `POST /api/auth/refresh` requires a valid session cookie and does not require a token header.
- Google OAuth endpoints are redirect-based (browser navigation), not JSON API calls.

## Testing

Detailed testing docs are now split by project:

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

## API Endpoint Summary

Prefix: `/api`

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/google`
- `GET /auth/google/callback`

Tickets:

- `GET /tickets`
- `GET /tickets/stats`
- `POST /tickets`
- `GET /tickets/:id`
- `PUT /tickets/:id`
- `GET /tickets/:id/comments`
- `POST /tickets/:id/comments`

Users:

- `GET /users/me`
- `GET /users/all` (admin)
- `GET /users/admin` (admin)
- `PUT /users/:id` (admin)

## Author

**Federico Gentili**
GitHub: [@GentilOfficial](https://github.com/GentilOfficial)
