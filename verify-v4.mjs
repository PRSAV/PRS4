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
for (const id of ['welcomeView','welcomeSignupBtn','welcomeLoginBtn','openSignupBtn','signupModal','signupEmail','signupPassword','pendingSignupPanel','loginEmail','verifyView','userModal']) {
  check(ids.includes(id), `Required UI element exists: ${id}`);
}
check(manifest.name === 'PRS.AssetVerify 4.2', 'PWA manifest identifies Version 4.2');
check(sw.includes("prs-assetverify-4-2-admin-login"), 'Service worker uses the Version 4.2 cache');
check(sw.includes("./app.js?v=420-admin-login"), 'Service worker caches the Version 4.2 app asset');
check(!html.toLowerCase().includes('request access'), 'Welcome page has no Request access button');
check(html.indexOf('id="openSignupBtn"') < html.indexOf('id="openLoginBtn"'), 'Sign up is shown before Login');
check(app.includes("'/auth/signup'"), 'Frontend submits mandatory signup credentials');
check(app.includes("'/signup-requests'"), 'Frontend loads Lalit sir’s pending approvals');
check(app.includes('Approve as Verifier'), 'Frontend shows explicit Verifier approval');
check(app.includes("'/auth/change-password'"), 'Frontend enforces first-sign-in password change');
check(app.includes("'/auth/select-company'"), 'Frontend supports authorised company selection');
check(app.includes("'/companies'"), 'Frontend uses the protected company-creation route');
check(worker.includes("path.startsWith('/public/')"), 'Worker blocks every public company route');
check(worker.includes('async function loginV4'), 'Worker has individual account login');
check(worker.includes('async function authenticateV4'), 'Worker validates individual session tokens');
check(worker.includes('async function ensureLalitAdmin'), 'Worker provisions Lalit sir before login');
check(worker.includes('env.LALIT_ADMIN_EMAIL'), 'Worker reads Lalit sir email from a secret');
check(worker.includes('env.LALIT_ADMIN_PASSWORD'), 'Worker reads Lalit sir password from a secret');
check(worker.includes('async function signupV42'), 'Worker has approval-based public signup');
check(!worker.includes('SIGNUP_EMAIL'), 'Worker requires no email-service binding');
check(worker.includes('async function decideSignupRequest'), 'Worker has protected approval and rejection endpoints');
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
for (const table of ['v20_companies','v20_members','v4_users','v4_user_memberships','v4_sessions','v4_login_attempts','v4_signup_requests','v4_signup_rate_limits']) {
  check(schemaTables.includes(table), `SQLite schema creates ${table}`);
}
db.close();

console.log(`Version 4.2 static verification passed: ${checks.length} checks.`);
