/**
 * Pull images from a Google Doc into .screenshots/from-doc-<docId>/
 * so Claude can read them via the Read tool without bloating chat
 * with inline attachments.
 *
 * Approach: export the Doc as .docx (a zip), unzip to /tmp, extract
 * word/media/* into .screenshots/.
 *
 * Usage: node scripts/pull-doc-images.mjs <docId>
 */
import { google } from "googleapis";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docId = process.argv[2];
if (!docId) { console.error("Usage: node scripts/pull-doc-images.mjs <docId>"); process.exit(1); }

const env = {};
for (const line of readFileSync(resolve(__dirname, "../.env.local"), "utf8").split("\n")) {
  if (!line || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  if (i < 0) continue;
  const key = line.slice(0, i).trim();
  let val = line.slice(i + 1);
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  env[key] = val;
}

const creds = JSON.parse(Buffer.from(env.GOOGLE_CREDENTIALS_BASE64, "base64").toString("utf8"));
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

const shortId = docId.slice(0, 12);
const outDir = resolve(__dirname, `../.screenshots/from-doc-${shortId}`);
const tmpDocx = resolve(__dirname, `../.tmp/doc-${shortId}.docx`);
const tmpUnzip = resolve(__dirname, `../.tmp/doc-${shortId}-unzip`);
mkdirSync(dirname(tmpDocx), { recursive: true });
mkdirSync(outDir, { recursive: true });

console.log(`Pulling Doc ${docId} → ${outDir}`);

// 1. Export as .docx
console.log("Exporting as .docx…");
const res = await drive.files.export(
  { fileId: docId, mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { responseType: "arraybuffer" },
);
writeFileSync(tmpDocx, Buffer.from(res.data));
console.log(`  → ${tmpDocx} (${Math.round(res.data.byteLength / 1024)}KB)`);

// 2. Unzip (docx is a zip). Rename to .zip so Windows tools accept it
if (existsSync(tmpUnzip)) rmSync(tmpUnzip, { recursive: true, force: true });
mkdirSync(tmpUnzip, { recursive: true });
const tmpZip = tmpDocx.replace(/\.docx$/, ".zip");
copyFileSync(tmpDocx, tmpZip);
try {
  const psPath = tmpZip.replace(/\\/g, "/");
  const psOut = tmpUnzip.replace(/\\/g, "/");
  execSync(`powershell -Command "Expand-Archive -LiteralPath '${psPath}' -DestinationPath '${psOut}' -Force"`, { stdio: "pipe" });
} catch (e) {
  console.error("Unzip failed:", e.message);
  process.exit(1);
}
rmSync(tmpZip, { force: true });

// 3. Copy images out
const mediaDir = resolve(tmpUnzip, "word/media");
if (!existsSync(mediaDir)) {
  console.log("No images in doc (no word/media folder).");
  // Also grab plain text content for convenience
  const docXml = existsSync(resolve(tmpUnzip, "word/document.xml")) ? readFileSync(resolve(tmpUnzip, "word/document.xml"), "utf8") : "";
  const textOnly = docXml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (textOnly) {
    writeFileSync(resolve(outDir, "text.txt"), textOnly);
    console.log(`  → text.txt (${textOnly.length} chars)`);
  }
  process.exit(0);
}

const files = readdirSync(mediaDir);
console.log(`\nFound ${files.length} image(s):`);
for (const f of files) {
  const src = resolve(mediaDir, f);
  const dst = resolve(outDir, f);
  copyFileSync(src, dst);
  console.log(`  ${f}`);
  console.log(`    → ${dst}`);
}

// Also extract text content for context
const docXmlPath = resolve(tmpUnzip, "word/document.xml");
if (existsSync(docXmlPath)) {
  const docXml = readFileSync(docXmlPath, "utf8");
  const textOnly = docXml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (textOnly) {
    writeFileSync(resolve(outDir, "text.txt"), textOnly);
    console.log(`\nAlso extracted text.txt (${textOnly.length} chars)`);
  }
}

// Clean up tmp
rmSync(tmpDocx, { force: true });
rmSync(tmpUnzip, { recursive: true, force: true });

console.log(`\nDone. Images in ${outDir}`);
