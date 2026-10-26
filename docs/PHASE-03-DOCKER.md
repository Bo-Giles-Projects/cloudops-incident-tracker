# Phase 3 — Dockerize CloudOps Incident Tracker

## Goal
Run PostgreSQL, the Express API, and the React frontend using Docker Compose.

## Architecture
Browser (localhost:5173) -> Nginx (web container) -> API container (api:3001) -> PostgreSQL (db:5432)

## Build and run
1. Stop the locally running `npm.cmd run dev:web` and `npm.cmd run dev:api` processes in VS Code with Ctrl+C.
2. From the project root run `docker compose config`.
3. Run `docker compose up --build -d`.
4. Check `docker compose ps` and `docker compose logs --tail=50 api`.
5. Visit http://localhost:5173 and http://localhost:5173/api/health.
6. Create an incident, refresh, and confirm persistence.

## Notes
- The API gets its database URL from the Compose environment. `db` is the PostgreSQL service hostname inside Docker.
- Nginx serves the compiled React frontend and forwards `/api/` to the API container.
- The named PostgreSQL volume remains intact during `docker compose down` (without `-v`).
- The demo credentials in compose.yaml are for LOCAL DEVELOPMENT ONLY. Replace them with secure secret management before any public deployment.
- If you previously changed your database credentials, update the `POSTGRES_PASSWORD` value and both URLs to match the existing database volume credentials. Changing `POSTGRES_PASSWORD` alone does not modify an existing database user's password.

## Troubleshooting
- Website port busy: stop the existing Vite process using 5173.
- Database authentication error: compare API `DATABASE_URL` credentials with the EXISTING PostgreSQL user password.
- Check service logs: `docker compose logs --tail=100 api` and `docker compose logs --tail=100 web`.
- Stop containers (preserve DB): `docker compose down`.
- Never run `docker compose down -v` unless you intend to delete stored incidents.
