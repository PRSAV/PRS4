# PRS.AssetVerify 4.1

Version 4.1 combines the stable Version 2 Patch 16 audit/scanner application with a responsive blue-and-white interface and approval-based individual accounts.

Highlights:

- Welcome page based on the supplied PRS design reference
- Responsive layouts for laptop, iPhone, and Android
- Individual email/password sign-in and secure session tokens
- Lalit sir completes the first signup using the email/password stored as Worker secrets
- Every later signup is pending until Lalit sir approves it inside the selected company
- Signup notifications can be emailed through a Cloudflare Email binding or webhook
- Email and a user-chosen password are mandatory; approved users start as Verifier
- Server-side self-role, protected-admin, and final-admin safeguards
- Detailed audit events for role changes
- Existing D1 records, R2 photos, offline queue, Excel exports, backup/restore, AI assistance, and Patch 16 barcode scanner retained

Start with `V4_SETUP.md`. Security behavior is summarized in `V4_SECURITY.md`.
