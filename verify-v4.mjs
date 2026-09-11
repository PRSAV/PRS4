import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const read = name => fs.readFileSync(new URL(name, import.meta.url), 'utf8');
const html = read('index.html');
const app = read('app.js');
const worker = read('worker.js');
const sw = read('sw.js');
const manifest = JSON.parse(read('manifest.webmanifest'));

const checks = [];
const check = (condition, message) => {
  if (!condition) throw new Error(message);
  checks.push(message);
};

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
check(ids.length === new Set(ids).size, 'HTML IDs are unique');
for (const id of ['welcomeView','welcomeSignupBtn','welcomeLoginBtn','openSignupBtn','signupModal','signupMobile','signupPassword','pendingSignupPanel','loginMobile','verifyView','userModal','inviteUserBtn','inviteUserModal','inviteFirstName','inviteLastName','inviteMobile','inviteCompany','inviteShareResult','inviteDeliveryTitle','inviteDeliveryStatus','inviteWhatsAppBtn','copyInviteLinkBtn','acceptInviteModal','inviteAcceptMobile','inviteAcceptPassword','resetAdminPasswordBtn','adminPasswordModal','memberPasswordResetModal','memberTemporaryPassword','copyMemberTemporaryPasswordBtn']) {
  check(ids.includes(id), `Required UI element exists: ${id}`);
}
check(manifest.name === 'PRS.AssetVerify 4.6', 'PWA manifest identifies Version 4.6');
check(sw.includes("prs-assetverify-4-6-admin-controls"), 'Service worker uses the Version 4.6 cache');
check(sw.includes("./app.js?v=460-admin-controls"), 'Service worker caches the Version 4.6 app asset');
check(!html.toLowerCase().includes('request access'), 'Welcome page has no Request access button');
check(html.indexOf('id="openSignupBtn"') < html.indexOf('id="openLoginBtn"'), 'Sign up is shown before Login');
check(app.includes("'/auth/signup'"), 'Frontend submits mandatory signup credentials');
check(app.includes('mobile:$'), 'Frontend sends mobile-number account payloads');
check(app.includes("'/signup-requests'"), 'Frontend loads Lalit sir’s pending approvals');
check(app.includes('Approve as Verifier'), 'Frontend shows explicit Verifier approval');
check(app.includes("'/auth/change-password'"), 'Frontend enforces first-sign-in password change');
check(app.includes("'/auth/accept-invitation'"), 'Frontend accepts one-time invitation links');
check(app.includes("'/invitations'"), 'Frontend sends company-specific invitations');
check(app.includes("'/auth/admin/change-password'"), 'Frontend exposes Lalit-only password reset');
check(app.includes("'/auth/select-company'"), 'Frontend supports authorised company selection');
check(app.includes("'/companies'"), 'Frontend uses the protected company-creation route');
check(worker.includes("path.startsWith('/public/')"), 'Worker blocks every public company route');
check(worker.includes('async function loginV4'), 'Worker has individual account login');
check(worker.includes('async function authenticateV4'), 'Worker validates individual session tokens');
check(worker.includes('async function ensureLalitAdmin'), 'Worker provisions Lalit sir before login');
check(worker.includes('env.LALIT_ADMIN_MOBILE'), 'Worker reads Lalit sir mobile number from configuration');
check(worker.includes('env.LALIT_ADMIN_PASSWORD'), 'Worker reads Lalit sir password from a secret');
check(worker.includes('const USER_PBKDF2_ITERATIONS = 100000;'), 'User passwords use Cloudflare-compatible PBKDF2 iterations');
check(worker.includes("version: '4.6'"), 'Worker health endpoint identifies Version 4.6');
check(worker.includes('async function signupV44'), 'Worker has mobile approval-based public signup');
check(!worker.includes('RESEND_API_KEY'), 'Worker requires no Resend API key');
check(!worker.includes('INVITE_FROM_EMAIL'), 'Worker requires no invitation sender address');
check(!worker.includes('sendInvitationEmail'), 'Worker contains no invitation email sender');
check(worker.includes('async function decideSignupRequest'), 'Worker has protected approval and rejection endpoints');
check(worker.includes('async function createInvitation'), 'Worker has Lalit-only invitation creation');
check(worker.includes('async function acceptInvitation'), 'Worker has invitation acceptance for new and existing users');
check(worker.includes('async function changeLalitPassword'), 'Worker has protected Lalit password reset');
check(worker.includes('async function deleteSignupRequest'), 'Worker lets only Lalit delete pending signup requests');
check(worker.includes('async function deleteInvitation'), 'Worker lets only Lalit delete pending invitations');
check(worker.includes('async function resetMemberPassword'), 'Worker lets only Lalit reset linked user passwords');
check(worker.includes('must_change_password=1'), 'Reset users must change the temporary password');
check(worker.includes('DELETE FROM v4_sessions WHERE user_id=?'), 'User password reset revokes active sessions');
check(worker.includes('function whatsAppInvitationUrl'), 'Worker prepares a manual WhatsApp invitation');
check(worker.includes('https://wa.me/'), 'Invitation sharing uses the WhatsApp recipient link');
check(worker.includes('async function sendTwilioWhatsAppInvitation'), 'Worker sends invitations automatically through Twilio WhatsApp');
check(worker.includes('env.TWILIO_AUTH_TOKEN'), 'Twilio authentication is read from a Worker secret');
check(worker.includes("'ContentSid'"), 'Production WhatsApp templates are supported');
check(worker.includes("'Body'"), 'Sandbox free-form WhatsApp testing is supported');
check(worker.includes('token_hash TEXT NOT NULL UNIQUE'), 'Invitation tokens are stored only as hashes');
check(worker.includes('const INVITATION_DAYS = 7;'), 'Invitation links expire after seven days');
check(worker.includes('if (!user && previousAdmin) user = previousAdmin;'), 'Lalit mobile identity migrates the existing protected account');
check(worker.includes("systemRoleByKey(env,auth.company.id,'VERIFIER')"), 'Approved accounts are forced to Verifier');
check(worker.includes('Lalit sir’s administrator account is not configured'), 'Worker blocks signups when Lalit provisioning is unavailable');
check(worker.includes('You cannot change your own role'), 'Worker rejects self role changes');
check(worker.includes('protected platform administrator'), 'Worker protects the initial administrator');
check(worker.includes('The last Admin cannot be deleted'), 'Worker protects the final administrator');
check(worker.includes('roleAssignments: plan.updates'), 'Role assignment audit includes before/after details');
check(app.includes('prsDetectCode11Direct'), 'Patch 16 native Code-11 decoder is retained');

const db = new DatabaseSync(':memory:');
for (const match of worker.matchAll(/env\.DB\.prepare\(`\s*(CREATE (?:TABLE|(?:UNIQUE )?INDEX)[\s\S]*?)`\)/g)) {
  db.exec(match[1]);
}
const schemaTables = db.prepare("SELECT name FROM sqlite_schema WHERE type='table'").all().map(row => row.name);
for (const table of ['v20_companies','v20_members','v4_users','v4_user_memberships','v4_sessions','v4_login_attempts','v4_signup_requests','v4_signup_rate_limits','v4_invitations']) {
  check(schemaTables.includes(table), `SQLite schema creates ${table}`);
}
db.close();

check(!/type="email"/i.test(html), 'Website contains no email input');
check(!/email address/i.test(html), 'Website contains no email-address instructions');
console.log(`Version 4.6 static verification passed: ${checks.length} checks.`);
