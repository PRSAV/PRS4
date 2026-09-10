# Version 4.2 access-control rules

- Identity comes from an individual email, password hash, and 256-bit random session token.
- Lalit sir's protected platform-admin account is provisioned automatically from `LALIT_ADMIN_EMAIL` and `LALIT_ADMIN_PASSWORD`; he never uses public signup.
- Lalit sir's plaintext password is never placed in the application files and is converted to a salted password hash in D1.
- Later signups store a salted password hash in a pending request and receive no session or company access.
- Only Lalit sir can approve or reject pending signup requests. Approval attaches the user to the currently selected company as Verifier.
- The protected platform administrator is attached as Admin and cannot be demoted or deleted.
- Only the platform administrator can create a company.
- Direct member-account creation is disabled; new users must complete signup and approval.
- A user cannot change their own role, including indirectly through the role-assignment screen.
- The final active Admin cannot be demoted or deleted.
- The Admin system role always retains the complete permission set.
- Role and member changes are written to the existing audit trail with actor, target, previous role, new role, and time.
- Approved users sign in with the private password they chose during signup.
- Changing a password invalidates every other active session for that user.
- Company data remains isolated by the existing D1 company ID checks; photos remain in the existing R2 bucket.
- Backup restore remaps secure accounts after restoring V2 members and keeps the protected administrator attached.
