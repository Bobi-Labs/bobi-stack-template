#!/usr/bin/env node
/**
 * Drive CLI — quick inspection + safe mutations against the project Drive.
 *
 * All operations use the service account creds in .env.local. Trimmed by the
 * library before use, so trailing-whitespace env corruption can't break this.
 *
 * Usage:
 *   node scripts/drive-cli.mjs <command> [args] [--json]
 *
 * Commands:
 *   roots                         Show configured root folder IDs from env
 *   list   <parentId>             List immediate children of a folder
 *   tree   <rootId>  [--depth N]  Recursive tree (default depth 3)
 *   find   <name>    [--parent ID] Find folders by exact name (optionally scoped)
 *   get    <id>                   File/folder metadata
 *   path   <id>                   Full path from root (walks parents up)
 *   mkdir  <parentId> <name>      Create folder (idempotent — returns existing ID if present)
 *   trash  <id>                   Move to Trash (recoverable)
 *   untrash <id>                  Restore from Trash
 *   rm     <id>  --yes            Hard-delete (UNRECOVERABLE — requires --yes)
 *
 *   help                          Show this help
 *
 * Global flags:
 *   --json                        Emit JSON output (for scripting)
 */
import {
  getDriveClient, roots, listChildren, findFolders, getItem, pathOf,
  tree, ensureFolder, trash, untrash, hardDelete, FOLDER_MIME,
} from "./lib/drive.mjs";

const argv = process.argv.slice(2);
const JSON_MODE = argv.includes("--json");
const args = argv.filter(a => a !== "--json");
const cmd = args[0];

function flag(name) { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; }
function hasFlag(name) { return args.includes(name); }
function emit(obj) { JSON_MODE ? console.log(JSON.stringify(obj, null, 2)) : null; }
function line(s) { if (!JSON_MODE) console.log(s); }
function icon(m) { return m === FOLDER_MIME ? "📁" : "📄"; }

async function main() {
  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    const me = import.meta.url.split("/").pop();
    console.log(`Usage: node scripts/${me} <command> [args]

Commands:
  roots                          Show root folder IDs
  list   <parentId>              List children
  tree   <rootId>  [--depth N]   Recursive tree (default depth 3)
  find   <name>    [--parent ID] Find folders by exact name
  get    <id>                    Metadata
  path   <id>                    Path from root
  mkdir  <parentId> <name>       Create folder (idempotent)
  trash  <id>                    Move to Trash
  untrash <id>                   Restore from Trash
  rm     <id>  --yes             Hard-delete (UNRECOVERABLE)

Flags:
  --json                         JSON output
`);
    process.exit(0);
  }

  const drive = getDriveClient();

  switch (cmd) {
    case "roots": {
      const r = roots();
      emit(r);
      line(`everyone : ${r.everyone}`);
      line(`admin    : ${r.admin}`);
      line(`tracker  : ${r.tracker}`);
      break;
    }

    case "list": {
      const id = args[1];
      if (!id) return fail("list requires <parentId>");
      const kids = await listChildren(drive, id);
      emit(kids);
      for (const k of kids) line(`${icon(k.mimeType)} ${k.name}  (${k.id})`);
      line(`— ${kids.length} items`);
      break;
    }

    case "tree": {
      const id = args[1];
      if (!id) return fail("tree requires <rootId>");
      const depth = parseInt(flag("--depth")) || 3;
      const nodes = await tree(drive, id, { maxDepth: depth });
      emit(nodes);
      for (const n of nodes) line(`${"  ".repeat(n.depth)}${icon(n.mimeType)} ${n.name}  (${n.id})`);
      line(`— ${nodes.length} items, depth ${depth}`);
      break;
    }

    case "find": {
      const name = args[1];
      if (!name) return fail("find requires <name>");
      const parentId = flag("--parent") || undefined;
      const hits = await findFolders(drive, name, { parentId });
      emit(hits);
      for (const h of hits) line(`📁 ${h.name}  (${h.id})  parent=${h.parents?.[0] || "?"}`);
      line(`— ${hits.length} hits`);
      break;
    }

    case "get": {
      const id = args[1];
      if (!id) return fail("get requires <id>");
      const m = await getItem(drive, id);
      emit(m);
      line(`${icon(m.mimeType)} ${m.name}`);
      line(`  id       : ${m.id}`);
      line(`  type     : ${m.mimeType}`);
      line(`  trashed  : ${m.trashed}`);
      line(`  parents  : ${m.parents?.join(", ") || "(root)"}`);
      line(`  created  : ${m.createdTime}`);
      line(`  modified : ${m.modifiedTime}`);
      if (m.webViewLink) line(`  link     : ${m.webViewLink}`);
      break;
    }

    case "path": {
      const id = args[1];
      if (!id) return fail("path requires <id>");
      const p = await pathOf(drive, id);
      emit({ path: p });
      line(p.join(" / "));
      break;
    }

    case "mkdir": {
      const parentId = args[1], name = args[2];
      if (!parentId || !name) return fail("mkdir requires <parentId> <name>");
      const id = await ensureFolder(drive, parentId, name);
      emit({ id, name, parentId });
      line(`📁 ${name}  (${id})  parent=${parentId}`);
      break;
    }

    case "trash": {
      const id = args[1];
      if (!id) return fail("trash requires <id>");
      await trash(drive, id);
      emit({ trashed: id });
      line(`🗑  trashed ${id} (recoverable via untrash)`);
      break;
    }

    case "untrash": {
      const id = args[1];
      if (!id) return fail("untrash requires <id>");
      await untrash(drive, id);
      emit({ untrashed: id });
      line(`♻️  untrashed ${id}`);
      break;
    }

    case "rm": {
      const id = args[1];
      if (!id) return fail("rm requires <id>");
      if (!hasFlag("--yes")) return fail("rm is UNRECOVERABLE — pass --yes to confirm");
      await hardDelete(drive, id);
      emit({ deleted: id });
      line(`💥 hard-deleted ${id}`);
      break;
    }

    default:
      fail(`unknown command: ${cmd}. run 'help' for usage.`);
  }
}

function fail(msg) {
  if (JSON_MODE) console.log(JSON.stringify({ error: msg }, null, 2));
  else console.error(`error: ${msg}`);
  process.exit(1);
}

main().catch(e => fail(e.message));
