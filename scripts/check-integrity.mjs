/**
 * check-integrity: mechanical drift detector for permanent ongoing
 * obligations that relevance-gated context loading structurally misses.
 *
 * Run at session START (is the scaffolding consistent?) and session END
 * (did I file/update everything before the chat closes?).
 *
 * v1 scope (intentionally narrow, grows as real gaps surface):
 *   1. Unfiled raw call transcripts sitting in .tmp/
 *   2. Raw transcripts in .transcripts/ with no docs/calls/INDEX.md row
 *   3. handoff_note.md / session_history.md stale vs last git commit
 *
 * No dependencies: pure Node builtins so it's a clean template back-port.
 * Always exits 0 (advisory, never breaks a workflow). Pass --strict to
 * exit 1 when issues are found (for hook-chaining).
 *
 * Usage: node scripts/check-integrity.mjs [--strict]
 */
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import os from "os";

const STRICT = process.argv.includes("--strict");
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

const issues = [];
const passes = [];

/* ───────── 1. Unfiled raw transcripts in .tmp/ ───────── */
const tmpDir = join(repoRoot, ".tmp");
if (existsSync(tmpDir)) {
  const stray = readdirSync(tmpDir).filter((f) => /^call[-_].*\.(txt|md|vtt|srt)$/i.test(f));
  if (stray.length) {
    issues.push(
      `Unfiled raw transcript(s) in .tmp/: ${stray.join(", ")}\n` +
        `   → move to .transcripts/YYYY-MM-DD-slug.txt, add INDEX row, parse if load-bearing`,
    );
  } else {
    passes.push(".tmp/ has no unfiled call transcripts");
  }
} else {
  passes.push(".tmp/ absent (nothing to file)");
}

/* ───────── 2. .transcripts/ files missing from docs/calls/INDEX.md ───────── */
const transcriptsDir = join(repoRoot, ".transcripts");
const indexPath = join(repoRoot, "docs", "calls", "INDEX.md");
const indexText = existsSync(indexPath) ? readFileSync(indexPath, "utf8") : "";
if (existsSync(transcriptsDir)) {
  const raws = readdirSync(transcriptsDir).filter((f) => /\.(txt|md|vtt|srt)$/i.test(f));
  const unindexed = [];
  for (const f of raws) {
    const m = f.match(/(\d{4}-\d{2}-\d{2})/);
    if (!m) continue;
    if (!indexText.includes(f) && !indexText.includes(m[1])) unindexed.push(f);
  }
  if (unindexed.length) {
    issues.push(
      `Raw transcript(s) filed but absent from docs/calls/INDEX.md: ${unindexed.join(", ")}\n` +
        `   → add an INDEX row (parse to docs/calls/ if load-bearing for current work)`,
    );
  } else if (raws.length) {
    passes.push(`All ${raws.length} .transcripts/ file(s) indexed`);
  } else {
    passes.push(".transcripts/ empty (nothing to index)");
  }
} else {
  passes.push(".transcripts/ absent");
}

/* ───────── 3. handoff / session_history staleness vs last commit ───────── */
function lastCommitEpoch() {
  try {
    return parseInt(execSync("git log -1 --format=%ct", { cwd: repoRoot, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(), 10) * 1000;
  } catch {
    return null;
  }
}

function deriveSlug(p) {
  // Convention: absolute path, slashes → dashes, drive colon removed.
  // C:\dev\x → C:/dev/x → C:-dev-x → C--dev-x
  return p.replace(/\\/g, "/").replace(/\//g, "-").replace(/:/g, "");
}

function findMemoryDir() {
  const projectsRoot = join(os.homedir(), ".claude", "projects");
  const slugGuess = deriveSlug(repoRoot);
  const direct = join(projectsRoot, slugGuess, "memory");
  if (existsSync(direct)) return direct;
  // Fallback: scan for a project dir whose name ends with this repo's folder name
  if (existsSync(projectsRoot)) {
    const base = repoRoot.replace(/\\/g, "/").split("/").pop();
    for (const d of readdirSync(projectsRoot)) {
      if (d.endsWith(base)) {
        const cand = join(projectsRoot, d, "memory");
        if (existsSync(cand)) return cand;
      }
    }
  }
  return null;
}

function docEpoch(file) {
  // Prefer a `lastWritten:` frontmatter date, else file mtime.
  try {
    const txt = readFileSync(file, "utf8").slice(0, 800);
    const m = txt.match(/lastWritten:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
    if (m) return new Date(m[1] + "T23:59:59").getTime();
  } catch {}
  try {
    return statSync(file).mtimeMs;
  } catch {
    return null;
  }
}

const commitEpoch = lastCommitEpoch();
const memDir = findMemoryDir();

if (commitEpoch == null) {
  passes.push("No git history (staleness check skipped)");
} else if (!memDir) {
  issues.push(
    "Memory dir not found under ~/.claude/projects/, so handoff/session_history staleness is unverifiable\n" +
      "   → confirm the project slug dir exists (see docs/starting-a-new-project.md)",
  );
} else {
  const checks = [
    { name: "handoff_note.md", tol: 2 * HOUR },
    { name: "session_history.md", tol: 7 * DAY },
  ];
  for (const c of checks) {
    const fp = join(memDir, c.name);
    if (!existsSync(fp)) {
      issues.push(`${c.name} missing from memory dir`);
      continue;
    }
    const docTime = docEpoch(fp);
    if (docTime == null) continue;
    const behindMs = commitEpoch - docTime;
    if (behindMs > c.tol) {
      const days = (behindMs / DAY).toFixed(1);
      issues.push(
        `${c.name} is stale: last commit is ~${days}d newer than the note\n` +
          `   → update it (it's the next chat's context); see Session-END checklist in CLAUDE.md`,
      );
    } else {
      passes.push(`${c.name} current vs last commit`);
    }
  }
}

/* ───────── Report ───────── */
console.log("");
console.log("  check-integrity: permanent-obligation drift scan");
console.log("  " + "─".repeat(52));
for (const p of passes) console.log(`  ✓ ${p}`);
if (issues.length) {
  console.log("");
  for (const i of issues) console.log(`  ⚠ ${i}`);
  console.log("");
  console.log(`  ${issues.length} item(s) need attention. See the Session-START / -END`);
  console.log("  checklists in CLAUDE.md for how to resolve.");
  console.log("");
  if (STRICT) process.exit(1);
} else {
  console.log("");
  console.log("  All clear: scaffolding obligations consistent.");
  console.log("");
}
