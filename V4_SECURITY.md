# PRS.AssetVerify 4.6 — security behavior

- Identity comes from an individual mobile number, salted password hash, and 256-bit random session token.
- Lalit sir's protected account is provisioned from `LALIT_ADMIN_MOBILE` and `LALIT_ADMIN_PASSWORD`; he never uses public signup.
- The first mobile-only deployment migrates the existing protected administrator account without losing company memberships.
- Public signup remains pending until Lalit sir approves it into the currently selected company.
- The server ignores all requested roles during signup and invitation acceptance. Every new membership starts as Verifier.
- Only Lalit sir can create company invitations.
- Invitations use a random, one-time token stored only as a SHA-256 hash and expire after seven days.
- Invitation acceptance requires the exact invited mobile number and a valid password.
- Existing users must prove their current password; new users create a salted password hash during acceptance.
- Twilio credentials remain in Cloudflare secrets. Failed automatic delivery reports a safe, actionable reason without exposing credentials, and manual WhatsApp sharing remains available.
- Only Lalit sir can delete pending signup requests or unused invitation links; each deletion is written to the audit trail.
- Only Lalit sir can reset another user's password. The server generates a one-time temporary password, revokes every session for that user, and forces a private password change at the next login.
- Users cannot change their own role. The protected platform administrator and the final company Admin cannot be removed.
- Only Lalit sir can use the portal password-update control; his current password is required and other sessions are revoked.
- Role, signup, invitation, member, login, and password events are written to the company audit trail.
- Plaintext passwords are never stored in D1, links, browser files, or GitHub.
