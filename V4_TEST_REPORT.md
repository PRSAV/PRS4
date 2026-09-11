# PRS.AssetVerify 4.6 — verification report

## Automated checks

- JavaScript syntax for `app.js`, `worker.js`, and `sw.js`
- Unique HTML IDs and required mobile/invitation/password controls
- Correct Version 4.6 service-worker cache and asset references
- Mobile-number login and approval-based signup
- Lalit account migration from the previous identifier without losing company memberships
- Invitation creation restricted to Lalit sir
- Automatic Twilio WhatsApp invitations with precise safe failure messages and manual fallback
- Random, hashed, single-use invitation tokens with seven-day expiry
- New and existing invitation acceptance paths both require a password
- Invite and signup memberships forced to Verifier on the server
- Lalit password update requires the current password and revokes other sessions
- Lalit-only deletion of pending signups and invitations
- Lalit-only linked-user password reset with temporary password, forced change, and session revocation
- Existing self-role, protected-admin, and final-admin safeguards
- Version 2 Patch 16 barcode implementation retained

## Live checks required after deployment

- Cloudflare D1 and R2 bindings
- Lalit sir's mobile login
- Public signup approval
- WhatsApp invitation opening and acceptance
- Real-device camera and barcode scanning

Follow `V4_SETUP.md` one section at a time.
