/**
 * Quick .docx → plain text extractor. Unzips, reads word/document.xml,
 * strips tags. Usage: node scripts/extract-docx-text.mjs <path-to-docx>
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from "fs";
import { execSync } from "child_process";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const src = process.argv[2];
if (!src) { console.error("usage: node scripts/extract-docx-text.mjs <path-to-docx>"); process.exit(1); }

const zip = src.replace(/\.docx$/, ".zip");
const outdir = src.replace(/\.docx$/, "-unzip");

copyFileSync(src, zip);
rmSync(outdir, { recursive: true, force: true });
mkdirSync(outdir, { recursive: true });

const psZip = zip.replace(/\\/g, "/");
const psOut = outdir.replace(/\\/g, "/");
execSync(`powershell -Command "Expand-Archive -LiteralPath '${psZip}' -DestinationPath '${psOut}' -Force"`, { stdio: "pipe" });

const docXmlPath = resolve(outdir, "word/document.xml");
const xml = readFileSync(docXmlPath, "utf8");

// Extract text within <w:t> nodes, preserve paragraph breaks via <w:p>
const paragraphs = xml.split(/<w:p[^>]*>/).slice(1).map((p) => {
  const textNodes = p.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) ?? [];
  return textNodes.map((n) => n.replace(/<[^>]+>/g, "")).join("");
}).filter((p) => p.trim() !== "");

console.log(paragraphs.join("\n"));

rmSync(zip, { force: true });
