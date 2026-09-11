# PRS.AssetVerify 4.6

Version 4.6 keeps the mobile-number-only account flow and automatic company-invitation delivery through Twilio WhatsApp. It adds clear Twilio delivery errors, Lalit-only deletion of pending signup/invitation records, and secure user-password reset with session revocation and a one-time temporary password.

Highlights:

- Login and signup use mobile number plus password
- Lalit sir signs in with his protected mobile account and never uses public signup
- Public signups stay pending until Lalit sir approves them
- Lalit sir can invite a person to a selected company and share the one-time link through WhatsApp
- New invitees create a password; existing users enter their current password
- Every approved or invited account starts as Verifier
- Only Lalit sir can update the protected administrator password in the portal
- Existing company data, D1 records, R2 photos, offline queue, Excel exports, backup/restore, AI assistance, and the Patch 16 barcode scanner remain intact

Start with `V4_SETUP.md`.
