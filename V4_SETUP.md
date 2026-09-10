# PRS.AssetVerify 4.1 — installation

Version 4.1 keeps the existing D1 records and R2 photos, and changes account creation to an approval workflow. Back up the D1 database before replacing the live Worker.

## 1. Configure Lalit sir's first signup

In Cloudflare, open the Worker, then **Settings > Variables and Secrets**. Add these three values as **Secret**:

- `INITIAL_ADMIN_NAME` — `Lalit Patel`
- `INITIAL_ADMIN_EMAIL` — Lalit sir's actual email address
- `INITIAL_ADMIN_PASSWORD` — a unique password of at least 10 characters

The screenshot text `Value encrypted` is correct. Cloudflare intentionally hides saved values. Confirm the third variable name is exactly `INITIAL_ADMIN_PASSWORD`; the dashboard may visually shorten it when the field is narrow.

These secrets no longer create an account automatically. Lalit sir must open the website, select **Sign up**, and enter the same email and password. Only that exact first signup becomes the protected platform administrator. Every other signup is blocked until this happens.

After Lalit sir has registered successfully, remove `INITIAL_ADMIN_PASSWORD` from Cloudflare. He then signs in using the salted password hash stored in D1. Keep `INITIAL_ADMIN_EMAIL` because signup notifications are sent there.

## 2. Configure signup email notification

Preferred Cloudflare setup:

1. In **Compute > Email Service**, onboard a domain that is managed in Cloudflare.
2. Verify Lalit sir's email as a destination address.
3. In the Worker **Bindings** tab, add a **Send Email** binding named exactly `SIGNUP_EMAIL` and restrict its destination to Lalit sir's verified email.
4. In **Variables and Secrets**, add `SIGNUP_FROM_EMAIL` with a sender address on the onboarded domain, for example `no-reply@yourdomain.com`.
5. Optionally add `APP_URL` with `https://prsav.github.io/PRS4/`.

If a Cloudflare-managed sending domain is unavailable, the Worker also supports a secret named `SIGNUP_EMAIL_WEBHOOK`. It must be an HTTPS endpoint that accepts JSON containing `to`, `subject`, and `text`, and sends the message.

If neither email option is configured, signup requests are still saved and visible to Lalit sir under **Team Members > Pending signups**, but the website truthfully warns that the email notification could not be delivered.

## 3. Deploy the backend

Replace the current Cloudflare Worker source with `worker.js`. Keep these existing bindings:

- `DB` — existing D1 database
- `Photos` — existing R2 bucket
- `OPENAI_API_KEY` — existing optional AI secret
- `SIGNUP_EMAIL` — email binding described above

The Worker creates `v4_signup_requests` and `v4_signup_rate_limits` without deleting existing operational data.

## 4. Deploy the PRS4 website

Upload these six files to the root of the GitHub repository `PRS4`:

- `index.html`
- `app.js`
- `styles.css`
- `sw.js`
- `manifest.webmanifest`
- `icon.svg`

Publish GitHub Pages from the `main` branch and `/(root)` folder. The intended URL is `https://prsav.github.io/PRS4/`.

## 5. Verify the complete flow

1. Open the Worker URL and confirm `version` is `4.1` and `initialAdminConfigured` is `true`.
2. Open the PRS4 website and select **Sign up**.
3. Register Lalit sir using the exact Cloudflare email/password. Confirm he enters as platform administrator.
4. Create or select a company.
5. In a separate signed-out browser, submit another signup with full name, email, password, and password confirmation.
6. Confirm Lalit sir receives the email notification.
7. As Lalit sir, open **Team Members > Pending signups** and approve the request into the currently selected company.
8. Confirm the approved user can sign in with the password they chose and starts as Verifier.
9. Confirm an unapproved user cannot sign in and no user can change their own role.

## Account rules

- Full name, email, password, and password confirmation are mandatory.
- Passwords are never emailed and are stored only as salted hashes.
- A pending signup receives no session and no company data access.
- Only the protected platform administrator can approve or reject signup requests.
- Every approved user starts as Verifier in the company Lalit sir currently has selected.
- Public company listing, public company creation, and self-assigned roles remain disabled.
