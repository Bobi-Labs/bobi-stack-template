/**
 * Drive library — shared by scripts/drive-cli.mjs and any test suite
 * or ingest code that needs Google Drive access.
 *
 * Uses a service account directly with the `drive` scope. The service
 * account must be shared as Editor on the folders it needs to touch.
 *
 * Required env vars in .env.local:
 *   GOOGLE_CREDENTIALS_BASE64    base64-encoded service account JSON
 *   GOOGLE_DRIVE_FOLDER_ID       (optional) project's primary root folder ID
 *
 * Projects can define additional root folder env vars as needed —
 * expose them via the `roots()` helper in this file.
 *
 * All env values are trimmed on load as defense against trailing-
 * whitespace corruption (trailing \n from vercel env pull has bitten
 * this pattern twice in production).
 */
import { google } from "googleapis";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

export const FOLDER_MIME = "application/vnd.google-apps.folder";

/** Parse .env.local into a plain object. Strips wrapping quotes + trailing
 *  whitespace on every value so nothing downstream ever sees junk. */
export function loadEnv() {
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(resolve(here, "../../.env.local"), "utf8");
  return Object.fromEntries(
    raw.split("\n")
      .filter(l => l.includes("=") && !l.startsWith("#"))
      .map(l => {
        const i = l.indexOf("=");
        const key = l.slice(0, i).trim();
        const val = l.slice(i + 1).trim().replace(/^["']|["']$/g, "").trim();
        return [key, val];
      })
  );
}

/** Drive client backed by the service account (direct auth, full drive scope). */
export function getDriveClient(env = loadEnv()) {
  if (!env.GOOGLE_CREDENTIALS_BASE64) throw new Error("Missing GOOGLE_CREDENTIALS_BASE64");
  const creds = JSON.parse(Buffer.from(env.GOOGLE_CREDENTIALS_BASE64, "base64").toString("utf8"));
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return google.drive({ version: "v3", auth });
}

/** Project root folder IDs loaded from env.
 *  Extend this per-project — add whichever root folders the project uses.
 *  Returns undefined for anything not configured. */
export function roots(env = loadEnv()) {
  return {
    primary: env.GOOGLE_DRIVE_FOLDER_ID,
    // Example — extend per project:
    // everyone: env.GOOGLE_DRIVE_EVERYONE_FOLDER_ID,
    // admin:    env.GOOGLE_DRIVE_ADMIN_FOLDER_ID,
  };
}

/** List immediate children of a folder. Returns [{id,name,mimeType,createdTime,parents}]. */
export async function listChildren(drive, parentId, { trashed = false } = {}) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and trashed = ${trashed}`,
    fields: "files(id, name, mimeType, createdTime, parents)",
    orderBy: "folder,name",
    pageSize: 500,
  });
  return res.data.files ?? [];
}

/** Find folders by exact name, optionally scoped to a parent. */
export async function findFolders(drive, name, { parentId } = {}) {
  const safe = name.replace(/'/g, "\\'");
  const q = [
    `name = '${safe}'`,
    `mimeType = '${FOLDER_MIME}'`,
    `trashed = false`,
    parentId ? `'${parentId}' in parents` : null,
  ].filter(Boolean).join(" and ");
  const res = await drive.files.list({ q, fields: "files(id, name, parents, createdTime)", pageSize: 50 });
  return res.data.files ?? [];
}

/** Get file/folder metadata. */
export async function getItem(drive, id, fields = "id, name, mimeType, parents, trashed, createdTime, modifiedTime, webViewLink") {
  const res = await drive.files.get({ fileId: id, fields });
  return res.data;
}

/** Walk up parents to build a path like ["RootName","A","B","item"]. */
export async function pathOf(drive, id) {
  const names = [];
  let cur = id;
  while (cur) {
    const meta = await getItem(drive, cur, "id, name, parents");
    names.unshift(meta.name);
    cur = meta.parents?.[0];
    if (names.length > 20) break; // safety
  }
  return names;
}

/** Recursive tree walk with depth limit. Returns [{id,name,depth,mimeType}]. */
export async function tree(drive, rootId, { maxDepth = 3 } = {}) {
  const out = [];
  async function walk(id, depth) {
    if (depth > maxDepth) return;
    const kids = await listChildren(drive, id);
    for (const k of kids) {
      out.push({ id: k.id, name: k.name, depth, mimeType: k.mimeType });
      if (k.mimeType === FOLDER_MIME) await walk(k.id, depth + 1);
    }
  }
  const root = await getItem(drive, rootId, "id, name, mimeType");
  out.push({ id: root.id, name: root.name, depth: 0, mimeType: root.mimeType });
  await walk(rootId, 1);
  return out;
}

/** Ensure a folder exists at parent/name; returns its ID. Idempotent. */
export async function ensureFolder(drive, parentId, name) {
  const existing = await findFolders(drive, name, { parentId });
  if (existing.length > 0) return existing[0].id;
  const created = await drive.files.create({
    requestBody: { name, mimeType: FOLDER_MIME, parents: [parentId] },
    fields: "id",
  });
  return created.data.id;
}

/** Create a folder unconditionally. Use ensureFolder() for idempotent creation. */
export async function createFolder(drive, parentId, name) {
  const created = await drive.files.create({
    requestBody: { name, mimeType: FOLDER_MIME, parents: [parentId] },
    fields: "id, name, parents",
  });
  return created.data;
}

/** Move a file/folder to Trash (recoverable). */
export async function trash(drive, id) {
  await drive.files.update({ fileId: id, requestBody: { trashed: true } });
}

/** Restore a file/folder from Trash. */
export async function untrash(drive, id) {
  await drive.files.update({ fileId: id, requestBody: { trashed: false } });
}

/** Hard-delete — unrecoverable. Use with care. */
export async function hardDelete(drive, id) {
  await drive.files.delete({ fileId: id });
}
