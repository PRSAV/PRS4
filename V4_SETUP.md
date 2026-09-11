# PRS.AssetVerify 4.6 — simple setup

No email account, Resend account, email domain, or Cloudflare Email Service binding is needed. Twilio WhatsApp is used only for automatic company-invitation delivery.

## 1. Cloudflare settings

Keep these bindings:

- D1 database binding: `DB`
- R2 bucket binding: `Photos`

Keep these secrets/variables:

- `OPENAI_API_KEY` — Secret
- `LALIT_ADMIN_PASSWORD` — Secret; keep the current working value
- `LALIT_ADMIN_MOBILE` — Secret or normal variable; set it to `+919712323225`
- `TWILIO_ACCOUNT_SID` — Secret; copy from Twilio
- `TWILIO_AUTH_TOKEN` — Secret; copy from Twilio and never share it
- `TWILIO_WHATSAPP_FROM` — normal variable; use the WhatsApp sender number shown by Twilio, including country code

For production, also add:

- `TWILIO_WHATSAPP_CONTENT_SID` — normal variable; the approved invitation template Content SID

Delete these settings if present:

- `LALIT_ADMIN_EMAIL`
- `RESEND_API_KEY`
- `INVITE_FROM_EMAIL`
- Any Email Service send binding created only for signup or invitations

Upload the Version 4.6 `worker.js` in Cloudflare and deploy it.

## 2. GitHub files

Replace these six website files in the `PRS4` repository:

- `index.html`
- `app.js`
- `styles.css`
- `sw.js`
- `manifest.webmanifest`
- `icon.svg`

Do not upload `worker.js`, secrets, or passwords to GitHub.

## 3. Test Lalit sir's login

1. Open the website in a fresh private/incognito window.
2. Select **Login**.
3. Enter Lalit sir's mobile number and the password stored in `LALIT_ADMIN_PASSWORD`.
4. Confirm the company list opens.

The first mobile-only request converts Lalit sir's existing protected administrator account from the old email identifier to the configured mobile number. Company memberships are preserved.

## 4. Test public signup approval

1. In a signed-out browser, select **Sign up**.
2. Enter a full name, mobile number, and password.
3. Confirm login is blocked while approval is pending.
4. As Lalit sir, open **Team Members**, select the destination company, and approve the request.
5. Confirm the new user can log in with their mobile number and password.

## 5. Test an automatic WhatsApp invitation

1. As Lalit sir, open **Team Members** and select **Invite user**.
2. Enter first name, last name, mobile number, and company.
3. Select **Create and send invitation**.
4. Confirm the recipient receives the secure link automatically.
5. The recipient opens the link and enters the same invited mobile number.
6. A new user creates a password. An existing user enters their current password.

During the Twilio trial, the recipient must join the WhatsApp Sandbox first and keep the 24-hour test session open. If automatic delivery fails, the portal shows **Send manually in WhatsApp** and **Copy invitation link** so the invitation is not lost.

For production, create an approved Twilio WhatsApp Content Template with these variables in order:

1. Recipient first name
2. Company name
3. Invitation link
4. Expiry text

The invitation link is random, stored only as a hash in D1, expires after seven days, and works once.

## 6. Test Lalit sir's password button

1. As Lalit sir, open **Team Members**.
2. Select **Reset my password**.
3. Enter the current password and a new password of at least 10 characters.
4. Confirm the new password works and other sessions are logged out.

## 7. Test pending-item deletion and user password reset

1. Under **Pending signups** or **Pending invitations**, select the red delete button and confirm the item disappears.
2. Under a linked user's team-member card, select **Reset password**.
3. Copy the temporary password shown once and give it privately to that user.
4. Confirm the user's existing sessions are logged out and the temporary password requires a new private password after login.
