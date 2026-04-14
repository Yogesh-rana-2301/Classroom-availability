# UX Screenshot Capture Guide

This folder stores screenshot evidence for the UI audit pain-point list in `docs/tasks/ui-audit-report.md`.

## Why this exists

Automated screenshot capture was attempted in-session but was skipped, so this guide provides a repeatable command path.

## Prerequisites

1. Backend running on `http://localhost:4000`
2. Frontend running on `http://127.0.0.1:5173`
3. Seeded credentials available:
   - `admin@pec.local`
   - `DevPass@123`

## Capture script

Create the script file:

```bash
cat > /tmp/capture-ui-audit.mjs <<'EOF'
import { chromium, devices } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = '/Users/sameerrana/Documents/GitHub/Classroom-availability';
const outDir = path.join(root, 'docs/tasks/ux-screenshots');
const base = 'http://127.0.0.1:5173';

async function ensureDir() {
  await fs.mkdir(outDir, { recursive: true });
}

async function desktopFlow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '01-login-page.png'), fullPage: true });

  await page.getByLabel('Email').fill('admin@pec.local');
  await page.getByLabel('Password').fill('DevPass@123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, '02-dashboard-empty.png'), fullPage: true });

  await page.goto(`${base}/classrooms`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '03-classrooms-dense-filters.png'), fullPage: true });

  const availabilityLinks = page.locator('a', { hasText: 'View Availability' });
  if (await availabilityLinks.count()) {
    await availabilityLinks.first().click();
    await page.waitForURL('**/availability');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '04-room-availability-grid-density.png'), fullPage: true });
  }

  await page.goto(`${base}/bookings/my`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '05-my-bookings-table.png'), fullPage: true });

  await page.goto(`${base}/admin/timetable`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '06-admin-timetable-json-first.png'), fullPage: true });

  await page.goto(`${base}/admin/maintenance`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '07-admin-maintenance-scan-load.png'), fullPage: true });

  await page.goto(`${base}/admin/audit-logs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '08-admin-audit-table-density.png'), fullPage: true });

  await browser.close();
}

async function mobileFlow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 12'] });
  const page = await context.newPage();

  await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill('admin@pec.local');
  await page.getByLabel('Password').fill('DevPass@123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');

  await page.goto(`${base}/classrooms`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '09-classrooms-mobile-density.png'), fullPage: true });

  await page.goto(`${base}/admin/audit-logs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '10-admin-audit-mobile-density.png'), fullPage: true });

  await browser.close();
}

await ensureDir();
await desktopFlow();
await mobileFlow();
console.log(`Saved screenshots to ${outDir}`);
EOF
```

Run capture:

```bash
npx -y -p playwright node /tmp/capture-ui-audit.mjs
```

## Expected files

- `01-login-page.png`
- `02-dashboard-empty.png`
- `03-classrooms-dense-filters.png`
- `04-room-availability-grid-density.png`
- `05-my-bookings-table.png`
- `06-admin-timetable-json-first.png`
- `07-admin-maintenance-scan-load.png`
- `08-admin-audit-table-density.png`
- `09-classrooms-mobile-density.png`
- `10-admin-audit-mobile-density.png`
