#!/usr/bin/env node
// lamba login: connect this computer or cloud workspace to the developer's Lamba account, with one tap, no key to copy.
//   node lamba-login.mjs            prints one link, waits for the tap, saves the key to .lamba/key (never printed)
//   node lamba-login.mjs --start    for chat AIs (Codex cloud, a phone): prints one link and exits at once; the pending
//                                   sign-in waits in .lamba/pending (kept out of git and uploads like the key)
//   node lamba-login.mjs --finish   after the tap: saves the key (waits up to 60 seconds); lamba-check.mjs does it too
//   node lamba-login.mjs --logout   deletes .lamba/key
// Device sign-in (RFC 8628): worker/oauth.js. The key lives in .lamba/key (mode 600, kept out of git and out of every
// zip); lamba-check.mjs --upload reads LAMBA_KEY first, else that file. The site: LAMBA_URL, else the address of
// LAMBA_MCP_URL (staging), else https://lamba.tv. Made by Lamba, get the newest at https://lamba.tv/devs/kit/lamba-login.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync, rmSync, appendFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = process.cwd();
const keyFile = join(here, ".lamba", "key"), pendingFile = join(here, ".lamba", "pending");
const argv = process.argv.slice(2);
if (argv.includes("--logout")) {
  if (existsSync(pendingFile)) rmSync(pendingFile);
  if (existsSync(keyFile)) { rmSync(keyFile); console.log("Disconnected: .lamba/key is deleted. To end it for good, revoke the key at https://lamba.tv/devs/keys."); }
  else console.log("Not connected here: there is no .lamba/key.");
  process.exit(0);
}
let base = (process.env.LAMBA_URL || "").replace(/\/+$/, "");
if (!base && process.env.LAMBA_MCP_URL) { try { base = new URL(process.env.LAMBA_MCP_URL).origin; } catch (e) {} }
if (!base) base = "https://lamba.tv";
// A newer kit? One quick request to /devs/kit/version.json, at most once an hour (.lamba/kit-seen.json), silent when
// offline. LAMBA_NO_KIT_CHECK=1 turns it off.
async function kitNotice(base) {
  if (process.env.LAMBA_NO_KIT_CHECK) return;
  try {
    const here = dirname(fileURLToPath(import.meta.url)), cache = join(here, ".lamba", "kit-seen.json");
    let mine = 0, seen = {};
    try { mine = Number(JSON.parse(readFileSync(join(here, "lamba-kit.json"), "utf8")).version) || 0; } catch (e) { return; }   // no lamba-kit.json: not a kit workspace
    try { seen = JSON.parse(readFileSync(cache, "utf8")); } catch (e) {}
    let latest = seen.base === base && Date.now() - seen.at < 3600000 ? Number(seen.latest) || 0 : 0;
    if (!latest) {
      const r = await fetch(base + "/devs/kit/version.json", { signal: AbortSignal.timeout(1500) });
      if (r.status !== 200) return;
      latest = Number((await r.json()).version) || 0;
      if (!latest) return;
      try { mkdirSync(dirname(cache), { recursive: true }); writeFileSync(cache, JSON.stringify({ base, at: Date.now(), latest })); } catch (e) {}
    }
    if (latest > mine) console.log("A newer Lamba SDK exists (1." + latest + ", you have " + (mine ? "1." + mine : "an older one") + "): run node lamba-update.mjs");
  } catch (e) {}
}
if (!argv.includes("--start")) await kitNotice(base);   // --start prints its one line only
const at = argv.indexOf("--name");
const name = (at >= 0 && argv[at + 1]) || process.env.LAMBA_CLIENT_NAME || "An AI tool";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const form = o => new URLSearchParams(o);
const post = async (path, body) => { const r = await fetch(base + path, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form(body) }); return { s: r.status, d: await r.json().catch(() => ({})) }; };

// the .lamba folder: mode 600 files, and .lamba/ in .gitignore
function keep(file, text) {
  mkdirSync(join(here, ".lamba"), { recursive: true });
  writeFileSync(file, text, { mode: 0o600 }); chmodSync(file, 0o600);
  const gi = join(here, ".gitignore"), have = existsSync(gi) ? readFileSync(gi, "utf8") : "";
  if (!/^\/?\.lamba\/?\s*$/m.test(have)) appendFileSync(gi, (have && !have.endsWith("\n") ? "\n" : "") + ".lamba/\n");
}
async function begin() {
  let s;
  try { s = await post("/oauth/device", { client_name: name }); } catch (e) { console.log("Lamba can't be reached (" + e.message + "). Please try again."); process.exit(1); }
  if (!s.d.device_code) { console.log("Lamba couldn't start the connection (" + s.s + "). Please try again in a little while."); process.exit(1); }
  return s.d;
}
const tokenOf = dc => post("/oauth/token", { grant_type: "urn:ietf:params:oauth:grant-type:device_code", device_code: dc });
function connected(r) {
  keep(keyFile, r.d.access_token + "\n");
  if (existsSync(pendingFile)) rmSync(pendingFile);
  console.log("Connected" + (r.d.email ? " as " + r.d.email : "") + ".");
  process.exit(0);
}
async function startPending(say) {
  const d = await begin();
  keep(pendingFile, JSON.stringify({ base, device_code: d.device_code, link: d.verification_uri_complete, interval: d.interval || 5, until: Date.now() + (d.expires_in || 600) * 1000 }) + "\n");
  console.log((say || "") + "Open " + d.verification_uri_complete + " and tap Allow");
}

if (argv.includes("--start")) { await startPending(); process.exit(0); }
if (argv.includes("--finish")) {
  let p = null;
  try { p = JSON.parse(readFileSync(pendingFile, "utf8")); } catch (e) {}
  if (!p || !p.device_code) {
    if (existsSync(keyFile)) { console.log("Already connected."); process.exit(0); }
    console.log("Nothing to finish: run node lamba-login.mjs --start first."); process.exit(1);
  }
  if (p.base) base = p.base;
  const expired = async () => { rmSync(pendingFile); await startPending("That link expired. "); process.exit(1); };
  if (Date.now() > p.until) await expired();
  let every = (p.interval || 5) * 1000;
  const stop = Math.min(p.until, Date.now() + (Number(process.env.LAMBA_FINISH_WAIT) || 60) * 1000);
  for (let first = true; first || Date.now() + every <= stop; first = false) {
    if (!first) await sleep(every);
    let r;
    try { r = await tokenOf(p.device_code); } catch (e) { continue; }
    if (r.d.access_token) connected(r);
    if (r.d.error === "authorization_pending") continue;
    if (r.d.error === "slow_down") { every += 5000; continue; }
    if (r.d.error === "access_denied") { rmSync(pendingFile); console.log("Cancelled: nothing was connected."); process.exit(1); }
    if (r.d.error === "expired_token") await expired();
    console.log("Lamba couldn't finish the connection (" + (r.d.error || r.s) + "). Run node lamba-login.mjs --start again."); process.exit(1);
  }
  console.log("Not allowed yet: tap Allow at " + p.link + ", then say done");
  process.exit(1);
}

const start = { d: await begin() };
console.log("Open " + start.d.verification_uri_complete + " and tap Allow (the code is " + start.d.user_code + ")");

let every = (start.d.interval || 5) * 1000;
const until = Date.now() + (start.d.expires_in || 600) * 1000;
while (Date.now() < until) {
  await sleep(every);
  let r;
  try { r = await tokenOf(start.d.device_code); } catch (e) { continue; }
  if (r.d.access_token) connected(r);
  if (r.d.error === "authorization_pending") continue;
  if (r.d.error === "slow_down") { every += 5000; continue; }
  if (r.d.error === "access_denied") { console.log("Cancelled: nothing was connected."); process.exit(1); }
  if (r.d.error === "expired_token") break;
  console.log("Lamba couldn't finish the connection (" + (r.d.error || r.s) + "). Please run it again."); process.exit(1);
}
console.log("That code expired. Run node lamba-login.mjs again for a new link.");
process.exit(1);
