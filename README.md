# Task Tracker — Frontend

A calm, focused way to plan your time. Put tasks on a calendar, see what's next, and reschedule with a drag.

Built with React, TypeScript, Vite, Chakra UI and FullCalendar, with a clean cal.com-inspired design. The API lives in [task-tracker-backend](https://github.com/S07K/task-tracker-backend).

## Features

- **Sign up and sign in**, with email verification handled by the backend
- **Upcoming**: tasks grouped by day, with Upcoming / Past tabs and search
- **Calendar**: month, week and day views
  - Click a day or drag across hours to create a task
  - Drag or resize a task to reschedule it (saved automatically)
- **Task dialog**: title, all-day or timed, date and time pickers, and a color
- **Account**: update your name and change your password
- Responsive layout with a sidebar on desktop and a bottom tab bar on mobile

## Getting started

### Prerequisites

- Node.js **20.19+ or 22.12+** (required by Vite 8)
- The [backend](https://github.com/S07K/task-tracker-backend) running locally or deployed

### Setup

```bash
npm ci
cp example.env .env.local   # then point the URLs at your backend
npm run dev
```

Open `http://localhost:5173`.

For email verification links to work locally, the backend's `APP_URL` should be `http://localhost:5173`, which is also the backend's allowed CORS origin.

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_USER_API_URL` | Users API base URL, e.g. `http://localhost:5001/users` |
| `VITE_EVENTS_API_URL` | Events API base URL, e.g. `http://localhost:5001/events` |

`.env` and `.env.local` are git-ignored. Vite embeds these values at **build time**, so they are public in the browser bundle and a rebuild is needed after changing them. Never put secrets in `VITE_*` variables.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint (currently reports existing `no-explicit-any` errors) |

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | Landing page | Signed out (signed-in users go to `/home`) |
| `/login` | Sign in | Signed out |
| `/register` | Create an account | Anyone |
| `/home` | Upcoming and past tasks | Signed in |
| `/home/calendar` | Calendar | Signed in |
| `/home/account` | Account settings | Signed in |
| `/error` | Not found | Anyone; unknown paths redirect here |

Signed-out visitors to `/home` routes are redirected to `/login`. The login token is kept in `localStorage`, and the user is logged out when the API reports it as invalid or expired (tokens last 1 hour).

## Deployment

Deployed on Vercel from the `develop` branch.

1. Set the Node.js version to **22.x** (Settings → Build and Deployment).
2. Add `VITE_USER_API_URL` and `VITE_EVENTS_API_URL`, pointing at the deployed backend.
3. Redeploy after changing environment variables, since they are baked in at build time.

`vercel.json` rewrites every path to `/`, so client-side routes like `/home/calendar` load correctly on refresh.

## Project structure

```
src/
├── main.tsx                  # App entry: Chakra theme, Redux store, router
├── AppRouter.tsx             # Routes and auth redirects
├── App.tsx                   # Signed-in layout: sidebar, data loading, task dialog
├── theme.ts                  # Chakra UI theme (colors, buttons, inputs)
├── LandingPage.tsx
├── Login.tsx
├── Register.tsx
├── error-page.tsx
├── pages/
│   ├── UpcomingPage.tsx
│   ├── CalendarPage.tsx
│   └── AccountPage.tsx
├── components/
│   ├── AuthLayout.tsx
│   ├── Logo.tsx
│   ├── dashboard/            # Sidebar, page header, task dialog, shared context
│   └── ui/                   # DatePicker, TimePicker
├── lib/
│   ├── api.ts                # Axios clients for the users and events APIs
│   ├── date.ts               # Local date/time helpers
│   └── color.ts              # Task color palette helpers
└── redux/                    # Auth token and user id state
```

## Tech stack

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Chakra UI](https://v2.chakra-ui.com) and [Framer Motion](https://motion.dev)
- [FullCalendar](https://fullcalendar.io)
- [React Router](https://reactrouter.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Axios](https://axios-http.com)
