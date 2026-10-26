# CloudOps Incident Tracker

A full-stack operational incident tracker designed to evolve into a **Cloud/DevOps portfolio project**.

## Current functionality
- Create incidents with severity levels
- View incident counts and activity
- Transition incidents between open, investigating, and resolved
- API health endpoint (`GET /api/health`)
- PostgreSQL-backed storage, parameterized queries, input validation
- Automated API tests and frontend build workflow

> The current application is a **local development starter**, not a production incident-management system. It does not yet have authentication, fine-grained authorization, monitoring, hardened database credentials, or cloud deployment.

## Requirements
- Node.js 22 or later with npm
- Docker Desktop (with Docker Compose)
- VS Code recommended

## Run locally
1. Unzip and open this folder in VS Code.
2. Copy `.env.example` to `.env` (from project root).
3. Run `docker compose up -d` to start PostgreSQL.
4. Run `npm install` in the project root.
5. In one terminal: `npm run dev:api`.
6. In another terminal: `npm run dev:web`.
7. Open http://localhost:5173 in your browser.
8. Verify API health at http://localhost:3001/api/health.

The demo database password is only for local development. Never reuse it for internet-facing services.

## Test and build
```bash
npm test
npm run build
```

## API routes
| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness response |
| GET | `/api/incidents` | List incidents |
| POST | `/api/incidents` | Create an incident (`title`, `severity`) |
| PATCH | `/api/incidents/:id` | Update incident status |

## Development roadmap
- **Stage 1:** Local functional app (this starter)
- **Stage 2:** Dockerize frontend and API; complete Compose stack
- **Stage 3:** CI/CD with tests, linting, container builds and security scans
- **Stage 4:** AWS deployment with Terraform, networking and Secrets Manager
- **Stage 5:** CloudWatch alerts, monitoring, backup/recovery, cost controls

## Evidence for your portfolio
Capture screenshots of the UI, health endpoint, CI runs, Docker containers, AWS architecture, and monitoring alerts. Store annotated screenshots under `docs/`.

## Security notes
Before deployment, add authentication and authorization, rate limiting, production CORS policy, security headers, deployment secrets, database TLS, and separate database roles. Do not expose the development Postgres port publicly. Set AWS budgets and cost alerts before provisioning any paid services.
