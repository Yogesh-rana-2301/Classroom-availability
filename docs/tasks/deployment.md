# Deployment & DevOps Tasks

## Completed

- [x] Docker Compose file added for local PostgreSQL
- [x] Backend env example added
- [x] Frontend env example added
- [x] Backend npm scripts added for prisma generate/push/seed/reset

## In Progress

- [~] Standardize local startup commands for all contributors

## To Do

- [ ] Remove obsolete `version` key warning from Docker Compose file
- [ ] Add root-level scripts for one-command local setup
- [ ] Add staging and production environment variable matrix
- [ ] Add CI workflow (lint, typecheck/tests, prisma validate)
- [ ] Add deployment pipeline for frontend + backend
- [ ] Add health checks and uptime monitoring
- [ ] Add secure secret management strategy
- [ ] Add rollback instructions

## Done Criteria

- New contributor can run full stack in under 10 minutes.
- CI prevents broken deploys.
- Staging mirrors production behavior for core booking flows.
