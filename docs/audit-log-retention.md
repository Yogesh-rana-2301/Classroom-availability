# Audit Log Data Retention Policy (Staging and Production)

This policy defines how long audit records are kept and how old records are pruned safely.

## Policy Scope

- Table: `AuditLog`
- Environments: staging and production
- Retention key: `createdAt`

## Retention Windows

- Staging: retain 90 days of audit events
- Production: retain 365 days of audit events

Rows older than the environment retention window are eligible for deletion.

## Execution Model

Use the backend retention command:

```bash
cd backend
npm run audit:retention
```

This command runs in dry-run mode by default and prints candidate row counts.

To apply deletion:

```bash
cd backend
AUDIT_LOG_RETENTION_DAYS=365 npm run audit:retention -- --apply
```

Staging example:

```bash
cd backend
AUDIT_LOG_RETENTION_DAYS=90 npm run audit:retention -- --apply
```

## Scheduling

- Run daily at off-peak hours (recommended: 02:30 UTC)
- Suggested orchestrators: platform cron job, CI scheduled workflow, or host scheduler

Example cron expression:

```text
30 2 * * *
```

## CI Automation (GitHub Actions)

Automated workflow file:

- `.github/workflows/audit-log-retention.yml`

Configured schedules:

- Staging prune apply: `30 2 * * *` (UTC)
- Production prune apply: `0 3 * * *` (UTC)

Manual execution:

- Use **Run workflow** in GitHub Actions.
- Select target: `staging`, `production`, or `both`.
- Set `apply=false` for dry-run, `apply=true` to delete eligible rows.

Required repository secrets:

- `DATABASE_URL_STAGING`
- `DATABASE_URL_PRODUCTION`

The workflow will fail fast if the required secret for a selected target is missing.

## Safety Controls

Before each `--apply` run:

1. Ensure a valid database backup exists from the last 24 hours.
2. Run dry-run and record candidate row count.
3. Confirm retention days match target environment.

After each `--apply` run:

1. Capture deleted row count from command output.
2. Verify remaining oldest audit timestamp:

```sql
SELECT MIN("createdAt") FROM "AuditLog";
```

## Legal Hold / Incident Exception

If audit rows must be retained beyond policy (for investigation or compliance):

1. Export required rows before pruning.
2. Store export in approved encrypted evidence storage.
3. Record incident/reference ID and operator in retention log.

Example export:

```sql
\copy (
  SELECT *
  FROM "AuditLog"
  WHERE "createdAt" < NOW() - INTERVAL '365 days'
) TO 'auditlog_legal_hold_export.csv' CSV HEADER;
```

## Monitoring and Alerts

Track and review monthly:

- Total `AuditLog` row count
- Rows pruned per run
- Oldest retained `createdAt`
- Job failures and retry outcomes

Alert if:

- Scheduled retention job fails for 2 consecutive days
- `AuditLog` growth exceeds expected threshold week-over-week

## Operational References

- Backup/restore runbook: `docs/backup-restore.md`
- Database task tracker: `docs/tasks/database.md`
- Retention command source: `backend/prisma/scripts/prune-audit-logs.js`
