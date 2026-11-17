#!/usr/bin/env node
// lamba update: bring this workspace's kit up to date, nothing else.
//   node lamba-update.mjs           downloads the newest kit and replaces only the kit's own files
//   node lamba-update.mjs --check   only says whether a newer kit exists
// The kit's own files: AGENTS.md, CLAUDE.md, lamba-*.mjs, lamba.d.ts, lamba.schema.json, the lamba-tv-app skill
// (.claude and .agents), .mcp.json, .codex/config.toml, lamba-kit.json, and package.json and README.md when they are the
// kit's. Your apps (any folder with a lamba.json), .lamba/, .git, node_modules and your own files are never touched.
// The site: LAMBA_URL, else the address of LAMBA_MCP_URL (staging), else https://lamba.tv.
// Made by Lamba, get the newest at https://lamba.tv/devs/kit/lamba-update.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const CHECK = process.argv.includes("--check");
let base = (process.env.LAMBA_URL || "").replace(/\/+$/, "");
if (!base && process.env.LAMBA_MCP_URL) { try { base = new URL(process.env.LAMBA_MCP_URL).origin; } catch (e) {} }
if (!base) base = "https://lamba.tv";
const BLOCKED = "Allow github.com and lamba.tv in this environment's internet access (Codex: Environment settings, Internet access, allowed domains)";

const read = f => { try { return readFileSync(join(here, f)); } catch (e) { return null; } };
let mine = 0;
try { mine = Number(JSON.parse(read("lamba-kit.json")).version) || 0; } catch (e) {}
const had = mine ? "SDK 1." + mine : "an older kit";

async function get(path) {
  let r;
  try { r = await fetch(base + path, { signal: AbortSignal.timeout(20000) }); } catch (e) { console.log(BLOCKED); process.exit(0); }
  if (r.status === 403) { console.log(BLOCKED); process.exit(0); }
  if (r.status !== 200) { console.log("Lamba can't give the kit right now (" + r.status + "). Please try again in a little while."); process.exit(0); }
  return r;
}

let latest;
try { latest = await (await get("/devs/kit/version.json")).json(); } catch (e) { console.log("Lamba can't give the kit right now. Please try again in a little while."); process.exit(0); }
const theirs = Number(latest && latest.version) || 0;
if (!theirs) { console.log("Lamba can't give the kit right now. Please try again in a little while."); process.exit(0); }
if (theirs <= mine) { console.log("Lamba SDK is up to date (1." + mine + ")"); process.exit(0); }
if (CHECK) { console.log("A newer Lamba SDK exists (1." + theirs + ", you have " + (mine ? "1." + mine : "an older one") + "): run node lamba-update.mjs"); process.exit(0); }

// the zip, read with node only (central directory, raw deflate)
function unzip(buf) {
  let e = buf.length - 22;
  while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) e--;
  if (e < 0) throw new Error("not a zip");
  const n = buf.readUInt16LE(e + 10), files = [];
  let at = buf.readUInt32LE(e + 16);
  for (let i = 0; i < n; i++) {
    if (buf.readUInt32LE(at) !== 0x02014b50) throw new Error("bad zip");
    const method = buf.readUInt16LE(at + 10), csize = buf.readUInt32LE(at + 20), nl = buf.readUInt16LE(at + 28), xl = buf.readUInt16LE(at + 30), cl = buf.readUInt16LE(at + 32), off = buf.readUInt32LE(at + 42);
    const name = buf.toString("utf8", at + 46, at + 46 + nl);
    at += 46 + nl + xl + cl;
    if (name.endsWith("/")) continue;
    const start = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28), raw = buf.subarray(start, start + csize);
    files.push({ name, data: method === 8 ? inflateRawSync(raw) : Buffer.from(raw) });
  }
  return files;
}
// the kit's own files (paths inside the workspace)
const SKILL = /^\.(claude|agents)\/skills\/lamba-tv-app\//;
const owned = r => ["AGENTS.md", "CLAUDE.md", ".mcp.json", ".codex/config.toml", "lamba.d.ts", "lamba.schema.json", "lamba-kit.json"].includes(r) || /^lamba-[a-z-]+\.mjs$/.test(r) || SKILL.test(r);
function ownFile(r) {   // package.json and README.md only while they are still the kit's
  if (r === "package.json") { const t = read(r); if (!t) return true; try { return JSON.parse(t).name === "lamba-app"; } catch (e) { return false; } }
  if (r === "README.md") { const t = read(r); return !!t && /^# Your Lamba app/.test(t.toString("utf8")); }
  return owned(r);
}

let files;
try {
  const zip = Buffer.from(await (await get("/devs/kit/starter.zip")).arrayBuffer());
  files = unzip(zip).map(f => ({ rel: f.name.split("/").slice(1).join("/"), data: f.data }));
} catch (e) { console.log("Lamba can't give the kit right now. Please try again in a little while."); process.exit(0); }

const changed = [];
for (const f of files) {
  if (!f.rel || f.rel.split("/").some(p => p === ".." || p === ".git" || p === ".lamba" || p === "node_modules") || !ownFile(f.rel)) continue;
  const to = resolve(here, f.rel);
  if (!to.startsWith(here + sep)) continue;
  const now = existsSync(to) ? readFileSync(to) : null;
  if (now && now.equals(f.data)) continue;
  mkdirSync(dirname(to), { recursive: true }); writeFileSync(to, f.data);
  if (f.rel !== "lamba-kit.json") changed.push(SKILL.test(f.rel) ? "skills" : f.rel);
}
const list = [...new Set(changed)], shown = list.slice(0, 4).join(", ") + (list.length > 4 ? " and " + (list.length - 4) + " more" : "");
console.log("Lamba SDK updated from " + had + " to 1." + theirs + (list.length ? ": " + shown : ""));
