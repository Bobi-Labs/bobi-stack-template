/**
 * audit-security: mechanical detector for the failure classes that took a
 * live client system down (and open) for months without anyone noticing.
 *
 * Every check here exists because it actually happened, not because it is
 * theoretically possible. Source: a real post-mortem, held privately. The
 * rule that produced this file: a convention stated in a README is a
 * request; a check that fails is a rule.
 *
 * Checks:
 *   1. Prefix-wide auth exemptions in middleware (the vulnerability generator)
 *   2. Service-role/admin client in a route with no visible caller check
 *   3. Webhook routes with no shared-secret verification
 *   4. Privilege downgrade on failure (falling back to the anon key)
 *   5. Supabase auth `lock` override (breaks cross-tab token refresh)
 *   6. Unexplained infinite caches (workarounds that outlive their defect)
 *   7. Service worker skipWaiting/clientsClaim with no deploy-skew guard
 *
 * No dependencies. Advisory by default (exit 0); --strict exits 1 for CI
 * and hook chaining. Findings are heuristic: read the code before believing
 * or dismissing one. A false positive costs a comment; a false negative
 * cost this project three weeks of a client thinking the app was flaky.
 *
 * Usage: node scripts/audit-security.mjs [--strict] [path-to-repo]
 *        (defaults to this repo; pass a path to audit another project)
 */
import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { resolve, dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const STRICT = process.argv.includes("--strict");
const pathArg = process.argv.slice(2).find((a) => !a.startsWith("--"));
const repoRoot = pathArg
  ? resolve(pathArg)
  : resolve(dirname(fileURLToPath(import.meta.url)), "..");

const findings = [];
const passes = [];
const skipped = [];

const rel = (p) => relative(repoRoot, p).replace(/\\/g, "/");

function walk(dir, filter, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", ".tmp", "out", "dist", ".vercel"].includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, filter, out);
    else if (filter(entry)) out.push(full);
  }
  return out;
}

// Production code only. Test files legitimately name these patterns while
// asserting against them, and flagging them trains people to ignore the tool.
const isTestFile = (p) => /(^|\/)(__tests__|tests?)\/|\.(test|spec)\.[tj]sx?$/.test(p);
const sourceFiles = walk(repoRoot, (f) => /\.(ts|tsx|mjs|js)$/.test(f)).filter(
  (f) => !rel(f).startsWith("scripts/") && !isTestFile(rel(f))
);
const routeFiles = sourceFiles.filter((f) => /app[\\/].*route\.(ts|js)$/.test(rel(f)));

/* ── 1. Prefix-wide auth exemptions ─────────────────────────────────
   That bypass traced entirely to one growing list of exempt path
   prefixes. Each addition was locally reasonable; the tree meant every
   route added under it later inherited an exemption nobody re-read. */
/* The exemption list is wherever the middleware delegates to, which is
   frequently NOT middleware.ts. Find it by shape: a file containing
   several /api path tests in a row. */
const exemptions = []; // { path, file, line, documented }
for (const file of sourceFiles) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  const hits = [];
  lines.forEach((line, i) => {
    const m =
      line.match(/startsWith\(\s*["'`](\/api\/[^"'`]*)["'`]/) ||
      line.match(/pathname\s*===\s*["'`](\/api\/[^"'`]*)["'`]/);
    if (m) hits.push({ path: m[1], line: i + 1, raw: line });
  });
  if (hits.length < 2) continue; // a lone check is not an exemption list
  for (const h of hits) {
    exemptions.push({
      path: h.path,
      file: rel(file),
      line: h.line,
      // The rule: each entry names the caller that cannot hold a session
      // AND the check that replaces it. A trailing comment is that record.
      documented: /\/\/|\/\*/.test(h.raw),
    });
  }
}

if (!exemptions.length) {
  skipped.push("no auth-exemption list found, skipped exemption checks");
} else {
  const undocumented = exemptions.filter((e) => !e.documented);
  if (undocumented.length) {
    findings.push({
      rule: "undocumented auth exemption",
      detail:
        `${undocumented.map((e) => `${e.path} (${e.file}:${e.line})`).join(", ")}\n` +
        `   → every exemption must name, in a comment, the caller that cannot\n` +
        `     hold a session AND the check that replaces it. An exemption\n` +
        `     justified by nothing is the shape that grows into a bypass.`,
    });
  } else {
    passes.push(`${exemptions.length} auth exemption(s), each documented with its compensating control`);
  }
}

const isExempt = (routePath) =>
  exemptions.some((e) => routePath === e.path || routePath.startsWith(e.path));

/* ── 2. Service-role client with no caller check ────────────────────
   Any route holding the admin client must authenticate AND authorize its
   caller itself: RLS is not enforcing anything on that connection. */
const ADMIN_HINTS = /createAdminClient|SERVICE_ROLE|service_role|serviceRoleKey/;
// Deliberately broad: a false negative here is a hole, but a false positive
// trains people to ignore the tool, and that is worse. Anything that reads
// like a caller check counts, including project-specific helpers
// (isIngestAuthorized, requireOperator, assertSignedIn, ...).
const AUTHZ_HINTS =
  /getUser|getSession|CRON_SECRET|bearer|authorization|x-[\w-]*secret|secret_token|SECRET|authoriz|isOperator|is_operator|requireAuth|requireOperator|assertAuth|checkAuth|verifySignature|constructEvent/i;

let adminRoutes = 0;
let middlewareCovered = 0;
for (const file of routeFiles) {
  const src = readFileSync(file, "utf8");
  if (!ADMIN_HINTS.test(src)) continue;
  adminRoutes++;
  if (AUTHZ_HINTS.test(src)) continue;

  // Derive the URL path from the file path: app/api/x/route.ts -> /api/x
  const routePath =
    "/" +
    rel(file)
      .replace(/^src\//, "")
      .replace(/^app\//, "")
      .replace(/\/route\.(ts|js)$/, "")
      .replace(/\/\([^)]+\)/g, "");

  if (isExempt(routePath) || !exemptions.length) {
    // Exempt from the session check AND holding a service-role client AND
    // carrying no check of its own: this is exactly the shape that let an
    // anonymous caller mint a confirmed admin account in a live system.
    findings.push({
      rule: "CRITICAL: exempt service-role route with no caller check",
      detail:
        `${rel(file)} (${routePath}) uses a service-role client, is exempt\n` +
        `   from the middleware session check, and contains no recognisable\n` +
        `   check of its own. RLS does not constrain a service-role connection,\n` +
        `   so this route is open to anonymous callers.`,
    });
  } else {
    middlewareCovered++;
  }
}
if (adminRoutes) {
  const critical = findings.filter((f) => f.rule.startsWith("CRITICAL")).length;
  if (!critical) {
    passes.push(
      `${adminRoutes} service-role route(s): none both exempt and unchecked` +
        (middlewareCovered
          ? ` (${middlewareCovered} rely on the middleware session check; own-checks would be defence in depth)`
          : "")
    );
  }
}
if (!routeFiles.length) skipped.push("no API routes found, skipped route checks");

/* ── 2b. Authentication mistaken for authorization ──────────────────
   The quiet variant of the same habit. Four routes in a live system
   verified that a caller was signed in and then did nothing with the
   answer, so any role could write records meant to be restricted and spend
   money on
   a paid AI endpoint. getUser() answers "is this someone?"; the question
   is "is this someone who may do THIS?" */
const ROLE_CHECK =
  /requireRole|app_metadata|\brole\b\s*(===|!==|==|!=)|\.includes\(\s*role|allowedRoles|hasRole|is_operator|isOperator|\brole\s*(!==|===)/;
const MUTATES = /\b(POST|PUT|PATCH|DELETE)\b/;

for (const file of routeFiles) {
  const src = readFileSync(file, "utf8");
  const authenticates = /getUser\(|getSession\(/.test(src);
  if (!authenticates) continue;
  if (ROLE_CHECK.test(src)) continue;
  if (!MUTATES.test(src)) continue;
  // Authenticating and then querying through the RLS-BOUND client is a
  // legitimate pattern: RLS is the authorization layer. The dangerous
  // shape is authenticating and then reaching for the service role, which
  // bypasses RLS entirely, so nothing is left to constrain the caller.
  if (!ADMIN_HINTS.test(src)) continue;
  findings.push({
    rule: "authentication without authorization",
    detail:
      `${rel(file)} verifies that someone is signed in, then uses a\n` +
      `   service-role client (which bypasses RLS) without ever checking\n` +
      `   WHICH role they hold. Any signed-in account of any role can call it.\n` +
      `   → use requireRole(...) from lib/auth/require-role.ts. getUser()\n` +
      `     alone is the easy half of the check.`,
  });
}

/* ── 3. Webhooks without secret verification ────────────────────────
   And the secret must fail CLOSED: an unset secret is a broken deploy,
   not an open door. */
for (const file of routeFiles) {
  const path = rel(file);
  // OAuth callbacks under /auth are a different animal: they carry a code
  // exchanged against the provider, not a shared secret.
  if (/\/auth\//.test(path)) continue;
  const src = readFileSync(file, "utf8");
  const namedWebhook = /webhook/i.test(path);
  // A provider name alone is not enough: an operator-initiated route that
  // CALLS Stripe is not a webhook. Only treat it as one if it also has no
  // caller check at all, which is the shape that matters anyway.
  const looksInbound = /telegram|stripe/i.test(path) && !AUTHZ_HINTS.test(src);
  if (!namedWebhook && !looksInbound) continue;
  const verifies = /secret|signature|constructEvent|verify/i.test(src);
  if (!verifies) {
    findings.push({
      rule: "webhook without secret verification",
      detail:
        `${path} looks like a webhook and verifies no shared secret.\n` +
        `   → verify a secret on every request, and fail closed when the\n` +
        `     secret is unconfigured.`,
    });
  } else if (/process\.env\.[A-Z_]*SECRET[A-Z_]*\s*(\|\||\?\?)/.test(src)) {
    findings.push({
      rule: "webhook secret fails open",
      detail:
        `${path} appears to default its secret when unset (\`|| \` or \`?? \`).\n` +
        `   → an unset secret must reject every request, not accept them.`,
    });
  }
}

/* ── 4. Privilege downgrade on failure ──────────────────────────────
   Falling back to the anon key turned a broken app into an EMPTY one:
   HTTP 200 + [] cached as success. Months undiagnosed. */
for (const file of sourceFiles) {
  const src = readFileSync(file, "utf8");
  if (!/ANON_KEY|anonKey/.test(src)) continue;
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    if (!/ANON_KEY|anonKey/.test(line)) return;
    if (!/(\|\||\?\?|catch|timeout|fallback|else)/i.test(line)) return;
    // `const KEY = process.env.X ?? ""` is module-level config reading, not
    // a runtime privilege downgrade.
    if (/^\s*(const|let|var)\s+[A-Z_]+\s*=\s*process\.env\./.test(line)) return;
    // Guarded fallback: a throw close below means the code refuses to
    // proceed unprivileged, which is the correct shape.
    if (/\bthrow\b/.test(lines.slice(i + 1, i + 8).join("\n"))) return;
    findings.push({
      rule: "privilege downgrade on failure",
      detail:
        `${rel(file)}:${i + 1} may fall back to the anon key.\n` +
        `   → never downgrade privilege on timeout or error. Throw. A\n` +
        `     lower-privilege read returns 200 with an empty array, which\n` +
        `     caches as success and renders as "no data" rather than a fault.`,
    });
  });
}

/* ── 5. Supabase auth lock override ─────────────────────────────────
   navigator.locks is cross-tab leader election for token refresh.
   Replacing it means every tab refreshes, one wins, the rest sign out. */
for (const file of sourceFiles) {
  const src = readFileSync(file, "utf8");
  if (/createClient|createBrowserClient/.test(src) && /\block\s*:/.test(src)) {
    findings.push({
      rule: "Supabase auth lock override",
      detail:
        `${rel(file)} passes a custom \`lock\` to a Supabase client.\n` +
        `   → do not override it. It is cross-tab leader election for refresh\n` +
        `     tokens; without it every tab refreshes independently and all but\n` +
        `     one get refresh_token_already_used, which signs them out.`,
    });
  }
}

/* ── 6. Unexplained infinite caches ─────────────────────────────────
   A workaround for a bug that was later fixed, left in place, became its
   own bug: the board could never recover from one failed fetch. */
for (const file of sourceFiles) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    if (!/staleTime\s*:\s*Infinity|gcTime\s*:\s*Infinity|cacheTime\s*:\s*Infinity/.test(line)) return;
    const context = lines.slice(Math.max(0, i - 3), i + 1).join("\n");
    if (/\/\/|\/\*|\*/.test(context.replace(line, ""))) return; // has a nearby comment
    findings.push({
      rule: "unexplained infinite cache",
      detail:
        `${rel(file)}:${i + 1} sets an Infinity cache with no comment above it.\n` +
        `   → every workaround must cite the defect it compensates for, so it\n` +
        `     can be removed when that defect is fixed. An unexplained Infinity\n` +
        `     is permanent by default.`,
    });
  });
}

/* ── 7. Service worker deploy skew ──────────────────────────────────
   skipWaiting + clientsClaim purges the previous build's chunks and then
   claims tabs still running it: the next lazy import 404s and clicks do
   nothing. Every deploy silently breaks every open tab. */
for (const file of sourceFiles) {
  const src = readFileSync(file, "utf8");
  if (!/skipWaiting/.test(src) || !/clientsClaim/.test(src)) continue;
  const guarded = /controllerchange|updatefound|deployment|skew|reload/i.test(src);
  if (!guarded) {
    findings.push({
      rule: "service worker deploy skew",
      detail:
        `${rel(file)} uses skipWaiting + clientsClaim with no visible reload guard.\n` +
        `   → add a controllerchange reload (hidden tabs reload, visible tabs\n` +
        `     prompt) and a chunk-error self-heal, or every deploy breaks every\n` +
        `     open tab until the user hard-refreshes.`,
    });
  }
}

/* ── report ─────────────────────────────────────────────────────────── */
const line = "─".repeat(64);
console.log(`\n${line}\n audit-security\n${line}`);

if (findings.length) {
  console.log(`\n  ${findings.length} finding(s):\n`);
  for (const f of findings) console.log(`  ⚠  ${f.rule}\n     ${f.detail}\n`);
} else {
  console.log("\n  No findings.\n");
}

if (passes.length) {
  console.log("  Passed:");
  for (const p of passes) console.log(`  ✓  ${p}`);
  console.log("");
}
if (skipped.length) {
  console.log("  Not applicable:");
  for (const s of skipped) console.log(`  ·  ${s}`);
  console.log("");
}

console.log(
  `  These checks are heuristic and cover only what can be grepped. The\n` +
    `  full checklist, including the parts a script cannot see, is in\n` +
    `  docs/recipes/security-and-failure-modes.md.\n`
);

process.exit(STRICT && findings.length ? 1 : 0);
