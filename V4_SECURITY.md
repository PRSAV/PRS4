# Version 4.1 access-control rules

- Identity comes from an individual email, password hash, and 256-bit random session token.
- The first signup becomes the protected platform administrator only when its email and password match the Worker secrets for Lalit sir.
- Until that protected signup succeeds, every other signup is rejected.
- Later signups store a salted password hash in a pending request and receive no session or company access.
- Only Lalit sir can approve or reject pending signup requests. Approval attaches the user to the currently selected company as Verifier.
- Signup email notifications never contain the applicant's password.
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
