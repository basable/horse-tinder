# Horse Tinder

Swipe right on your future pasture-mate.

- `backend/` — Go API (stdlib `net/http` + pgx) on PostgreSQL. Creates its schema and seeds 12 horses on startup.
- `frontend/` — React + Vite + Tailwind v4 + shadcn/ui, served by nginx.
- `k8s/` — CloudNativePG operator + single-instance `app-db` cluster (apply wave -2), backend, frontend, HTTPRoute (`/api` → backend, `/` → frontend).

## API

| Method | Path | Auth | |
|---|---|---|---|
| GET | /api/health | – | liveness + DB ping |
| POST | /api/horses | – | create profile, returns `{token, horse}` |
| GET | /api/me | Bearer | your horse |
| GET | /api/feed | Bearer | horses you haven't swiped on |
| POST | /api/swipes | Bearer | `{targetId, liked}` → `{match, horse?}` |
| GET | /api/matches | Bearer | mutual likes |
