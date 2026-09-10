# PRS.AssetVerify 4.1 — verification report

## Automated checks

- JavaScript syntax: `app.js`, `worker.js`, and `sw.js`
- 41 Version 4.1 static/schema assertions passed with `verify-v4.mjs`
- All Worker `CREATE TABLE` and `CREATE INDEX` statements execute successfully in SQLite
- Frontend asset references and service-worker cache version
- HTML element IDs referenced during application startup
- Public company endpoints remain blocked; public signup is limited to account applications
- First administrator signup must match the Cloudflare email and password secrets
- Pending signup, notification, protected approval, and rejection routes are present
- Direct member-account creation is blocked and approval forces Verifier on the server
- Signup request and rate-limit tables execute successfully in SQLite
- Self-role-change, protected-admin, and final-admin guards present
- Audit payload records role assignment before/after details
- Version 2 Patch 16 barcode implementation retained

## Deployment checks still required

Cloudflare D1/R2 integration, outbound email delivery, and real-device camera scanning require the user's live bindings and should be tested in staging before production deployment. Follow `V4_SETUP.md`.
