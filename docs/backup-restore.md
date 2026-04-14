# PostgreSQL Backup and Restore Runbook (Staging and Production)

This runbook defines safe, repeatable backup and restore procedures for hosted PostgreSQL environments used by the backend.

## Scope

- Environment targets: staging and production
- Database engine: PostgreSQL
- Data scope: full logical backup of application schema and data

## Prerequisites

- `pg_dump`, `pg_restore`, and `psql` installed on the operator machine
- Read access for backup user, and create/write access for restore user
- Network access to target database
- Environment variables loaded for the target environment

Required environment variables:

```bash
export DATABASE_URL_STAGING="postgresql://..."
export DATABASE_URL_PRODUCTION="postgresql://..."
```

## Backup Strategy

Use custom-format dumps (`-Fc`) for better compression and selective restore options.

Backup filename convention:

```text
<env>_classroom_availability_<YYYYMMDD_HHMMSS>.dump
```

Example directory convention:

```text
backups/staging/
backups/production/
```

## Create Backup

### 1) Staging Backup

```bash
mkdir -p backups/staging
ts=$(date +"%Y%m%d_%H%M%S")
pg_dump "$DATABASE_URL_STAGING" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file "backups/staging/staging_classroom_availability_${ts}.dump"
```

### 2) Production Backup

```bash
mkdir -p backups/production
ts=$(date +"%Y%m%d_%H%M%S")
pg_dump "$DATABASE_URL_PRODUCTION" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file "backups/production/production_classroom_availability_${ts}.dump"
```

## Verify Backup Integrity

Run metadata listing to ensure the dump is readable:

```bash
pg_restore --list backups/staging/<file>.dump | head
pg_restore --list backups/production/<file>.dump | head
```

If this command fails, do not treat the backup as valid.

## Restore Procedure

Always restore first to a temporary validation database before any in-place restore.

### 1) Restore to Validation Database

Create a scratch DB (example):

```bash
createdb classroom_availability_restore_check
```

Restore dump:

```bash
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname classroom_availability_restore_check \
  backups/<env>/<file>.dump
```

### 2) Validate Restored Data

Run basic checks:

```bash
psql classroom_availability_restore_check -c 'SELECT COUNT(*) FROM "User";'
psql classroom_availability_restore_check -c 'SELECT COUNT(*) FROM "Classroom";'
psql classroom_availability_restore_check -c 'SELECT COUNT(*) FROM "Booking";'
psql classroom_availability_restore_check -c 'SELECT COUNT(*) FROM "AuditLog";'
```

If validation passes, proceed with target restore.

### 3) Restore to Target Environment

Staging:

```bash
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname "$DATABASE_URL_STAGING" \
  backups/staging/<file>.dump
```

Production (maintenance window only):

```bash
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname "$DATABASE_URL_PRODUCTION" \
  backups/production/<file>.dump
```

## Post-Restore Checklist

1. Run Prisma schema check:

```bash
cd backend
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --exit-code
```

Expected: `No difference detected.`

2. Start API and run regression smoke tests:

```bash
cd backend
npm run test:api:mvp
```

3. Validate login and one booking flow manually on the target environment.

## Retention and Storage Policy

- Staging: retain 14 days of daily backups
- Production: retain 35 days of daily backups and 12 monthly snapshots
- Store backups in encrypted storage with restricted access
- Do not commit backup artifacts to Git

## Operational Safety Notes

- Never run production restore without a fresh production backup created immediately before restore.
- Perform production restore only during approved maintenance windows.
- Record operator, timestamp, source file, and validation evidence for each restore event.

## Related Runbooks

- Audit log retention policy: `docs/audit-log-retention.md`
