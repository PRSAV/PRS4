# PRS.AssetVerify 4.2 — installation

Version 4.2 keeps the existing D1 records and R2 photos. Lalit sir's protected account is created automatically from Cloudflare secrets; every other account starts as a pending signup. Back up the D1 database before replacing the live Worker.

## 1. Reset the Worker secrets

You may delete the older `INITIAL_ADMIN_*`, `SIGNUP_EMAIL`, `SIGNUP_FROM_EMAIL`, and `SIGNUP_EMAIL_WEBHOOK` settings. Keep `OPENAI_API_KEY`.

Add exactly these two new values under **Settings > Variables and Secrets**, selecting **Secret** for both:

- `LALIT_ADMIN_EMAIL` — Lalit sir's supplied email address
- `LALIT_ADMIN_PASSWORD` — Lalit sir's supplied password

The value shown as `Value encrypted` is correct. Never place the password in `worker.js`, GitHub, or any frontend file.

When the Worker first runs, it automatically creates or refreshes Lalit sir's D1 account as the protected platform administrator and attaches it as Admin to existing companies. Lalit sir does not use Sign up; he uses Login directly.

If either secret is missing or misspelled, Lalit sir's login cannot be provisioned. The exact variable names are case-sensitive.

## 2. Deploy the backend

Replace the current Cloudflare Worker source with `worker.js`. Keep these bindings:

- `DB` — existing D1 database
- `Photos` — existing R2 bucket
- `OPENAI_API_KEY` — existing AI secret

No email-service binding or sender-address variable is required in Version 4.2.

The Worker creates or retains the account, membership, session, pending-signup, and signup-rate-limit tables without deleting existing operational data.

## 3. Deploy the PRS4 website

Upload these six files to the root of the GitHub repository `PRS4`:

- `index.html`
- `app.js`
- `styles.css`
- `sw.js`
- `manifest.webmanifest`
- `icon.svg`

Publish GitHub Pages from the `main` branch and `/(root)` folder. The intended URL is `https://prsav.github.io/PRS4/`.

## 4. Verify the complete flow

1. Open the Worker URL and confirm `version` is `4.2` and `lalitAdminConfigured` is `true`.
2. Open the PRS4 website. Confirm the visible button order is **Sign up**, then **Login**, with no **Request access** button.
3. Lalit sir selects **Login** and enters the credentials stored in the two Cloudflare secrets.
4. Create or select a company.
5. In a separate signed-out browser, submit another signup with full name, email, password, and password confirmation.
6. Confirm the applicant cannot log in yet.
7. As Lalit sir, open **Team Members > Pending signups** and approve the request into the currently selected company.
8. Confirm the approved user can log in with the password they chose and starts as Verifier.
9. Confirm the user cannot change their own role.

## Account rules

- Lalit sir has Login access immediately after the Worker reads the two secrets; he never signs up.
- Full name, email, password, and password confirmation are mandatory for all public signups.
- Passwords are stored as salted hashes and never shown to Lalit sir.
- A pending signup receives no session and no company-data access.
- Only the protected platform administrator can approve or reject signup requests.
- Every approved user starts as Verifier in the company Lalit sir currently has selected.
- Public company listing, public company creation, and self-assigned roles remain disabled.
