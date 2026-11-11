#!/usr/bin/env node
// lamba clips: record your app's clips for its page on Lamba TV, from the simulator, with nothing to film by hand.
//   node lamba-clips.mjs [my-app] [--seconds 10] [--script steps.json] [--headed]
// It needs, once, in this folder: npm install && npx playwright install chromium   (Playwright, and ffmpeg-static when
// the computer has no ffmpeg of its own)
// What it does:
//   1. opens the app in the real simulator (the one inside lamba-test.mjs, next to this script): the TV, the owner's
//      phone and guests, served from this computer
//   2. plays a short session on the phones: the taps in --script, else random taps on their buttons, the bigger ones
//      more often, and records it
//   3. writes, in the exact format an app page wants (540 x 920, H.264, <seconds> s, no sound, each with its
//      -poster.webp, the clip's first frame):
//        clips/<id>-play.mp4       the TV, and a phone below it
//        clips/<id>-phone.mp4      a phone, big
//        clips/<id>-settings.mp4   an app with settings of its own: the owner chooses, the TV changes
//   4. lists them in lamba.json "clips" and removes the starter's placeholder clips.
// Then look at each poster, and write captions in lamba.json that say what each clip shows.
//
// --script steps.json: a list played in a loop, for a session that shows the app at its best, e.g.
//   [{ "phone": "g1", "tap": "#answer-2" }, { "wait": 900 }, { "phone": "g2", "tap": ".go" }, { "phone": "owner", "tap": "#next" }]
//   phone: "g1", "g2", "g3" (guests) or "owner"; tap: a CSS selector on that phone's page; wait: milliseconds.
import { createServer } from "node:http";
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync, rmSync, mkdtempSync, unlinkSync } from "node:fs";
import { join, resolve, relative, basename, dirname, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { inflateRawSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(HERE, "lamba-clips.mjs"));
// the starter kit's placeholder clips, by their SHA-256 (the kit's build fills these in from Lamba's check)
const PLACEHOLDERS = ["5bbbd22bc3f4b056ee767a62b8ec885c6766ba38d5e57b72da4918b33e459ce0","da6fe1d5a1acee53eb96995e6e9fd43f7a7e3f0de7ecbf6d0ed3627338e33287","13dc9b09054f1df551795c2eedb74307376ac0b115a174710f497c9a9cab69f2","f58064faa1a5f2806878f48c785d194532ac89c824b04feec76673bf8d65ef05"];
const args = process.argv.slice(2), flag = f => args.includes(f);
const opt = k => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const HEADED = flag("--headed"), SECONDS = Math.max(6, Math.min(14, +opt("--seconds") || 10)), SCRIPT = opt("--script");
const named = args.filter((a, i) => !a.startsWith("-") && !["--seconds", "--script"].includes(args[i - 1]));
const wait = ms => new Promise(r => setTimeout(r, ms));
const say = (...a) => console.log(...a);
const W = 540, H = 920, BG = "0x141416", FPS = 30;

// ---------- what it needs ----------
let chromium;
try { ({ chromium } = require("playwright")); }
catch (e) { say("lamba clips: Playwright is not installed here. Run this once in this folder, then run lamba clips again:\n  npm install && npx playwright install chromium"); process.exit(2); }
function ffmpeg() {
  const has264 = bin => { try { return /libx264/.test(execFileSync(bin, ["-hide_banner", "-encoders"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })); } catch (e) { return false; } };
  if (has264("ffmpeg")) return "ffmpeg";
  try { const bin = require("ffmpeg-static"); if (bin && has264(bin)) return bin; } catch (e) {}
  return null;
}
const FF = ffmpeg();
if (!FF) { say("lamba clips: ffmpeg is needed to make H.264 clips. Run this once in this folder, then run lamba clips again:\n  npm i ffmpeg-static"); process.exit(2); }

// ---------- the simulator: the one inside lamba-test.mjs, or Lamba's repository ----------
const SIM = (() => { const f = join(HERE, "lamba-test.mjs"); if (!existsSync(f)) return null; const m = readFileSync(f, "utf8").match(/^const SIM = "([A-Za-z0-9+/=]+)";/m); return m ? m[1] : null; })();
const REPO = SIM ? null : [join(HERE, ".."), HERE].find(d => existsSync(join(d, "shell/sdk/lamba.js")) && existsSync(join(d, "devs/simulator/sim.js")));
if (!SIM && !REPO) { say("lamba clips: lamba-test.mjs (it carries the simulator) is not next to this script. Get the starter kit again: https://lamba.tv/devs/kit/starter.zip"); process.exit(2); }
const FILES = SIM ? (() => { const o = JSON.parse(inflateRawSync(Buffer.from(SIM, "base64")).toString("utf8")); for (const k in o) o[k] = Buffer.from(o[k], "base64"); return o; })() : null;
if (!SIM && !PLACEHOLDERS.length) { const m = readFileSync(join(REPO, "worker/check.js"), "utf8").match(/PLACEHOLDER_CLIPS = \[([^\]]*)\]/); if (m) PLACEHOLDERS.push(...[...m[1].matchAll(/"([0-9a-f]{64})"/g)].map(x => x[1])); }
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".ttf": "font/ttf", ".zip": "application/zip", ".mp4": "video/mp4" };
function file(p) {
  if (FILES) return FILES[p] || null;
  const f = join(REPO, p);
  if (!f.startsWith(REPO + sep) || !existsSync(f) || !statSync(f).isFile()) return null;
  return readFileSync(f);
}
function serve() {
  const server = createServer((q, r) => {
    let p = decodeURIComponent(new URL(q.url, "http://x").pathname).replace(/^\/+/, "");
    if (p === "" || p.endsWith("/")) p += "index.html";
    if (/(^|\/)\.\.?(\/|$)/.test(p)) { r.writeHead(404); r.end(); return; }
    let b = file(p);
    if (!b && !extname(p)) { p += "/index.html"; b = file(p); }
    if (!b) { r.writeHead(404, { "content-type": "text/plain" }); r.end("not found"); return; }
    r.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream", "cache-control": "no-store" }); r.end(b);
  });
  return new Promise(res => server.listen(0, "127.0.0.1", () => res(server)));
}

// ---------- the app's folder, as a zip (as lamba-test.mjs opens it) ----------
const SKIP = n => n === "node_modules" || n.startsWith(".") || n === "lamba-test-shots";
function walk(dir) { const out = []; const go = d => { for (const n of readdirSync(d)) { const f = join(d, n); if (SKIP(n)) continue; if (statSync(f).isDirectory()) go(f); else out.push(relative(dir, f).split(sep).join("/")); } }; go(dir); return out.sort(); }
const CRC = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c >>> 0; }
const crc = b => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function zipOf(dir, prefix) {
  const parts = [], central = []; let at = 0; const paths = walk(dir);
  for (const rel of paths) {
    const data = readFileSync(join(dir, rel)), name = Buffer.from(prefix + rel, "utf8"), c = crc(data);
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x800, 6); h.writeUInt32LE(c, 14); h.writeUInt32LE(data.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(name.length, 26);
    const e = Buffer.alloc(46); e.writeUInt32LE(0x02014b50, 0); e.writeUInt16LE(20, 4); e.writeUInt16LE(20, 6); e.writeUInt16LE(0x800, 8); e.writeUInt32LE(c, 16); e.writeUInt32LE(data.length, 20); e.writeUInt32LE(data.length, 24); e.writeUInt16LE(name.length, 28); e.writeUInt32LE(at, 42);
    parts.push(h, name, data); central.push(e, name); at += 30 + name.length + data.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(paths.length, 8); end.writeUInt16LE(paths.length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(at, 16);
  return Buffer.concat(parts.concat([cd, end]));
}

// ---------- driving the simulator ----------
const rigFrame = (p, rig) => p.frames().find(f => { try { return new URL(f.url()).searchParams.get("rig") === rig && /\/devs\/simulator\/(tv|phone)\.html/.test(f.url()); } catch (e) { return false; } });
async function sealed(p, rig, view, ms) {   // the app's own page inside a rig, in that view
  const end = Date.now() + (ms || 10000);
  while (Date.now() < end) {
    const r = rigFrame(p, rig);
    if (r) for (const f of p.frames()) if (f.parentFrame() === r && f.url() === "about:srcdoc") { const v = await f.evaluate(() => window.Lamba && Lamba.screen && Lamba.screen.view).catch(() => null); if (v === view) return f; }
    await wait(150);
  }
  return null;
}
const box = async (p, sel) => { const b = await p.$eval(sel, e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }).catch(() => null); return b && b.w > 20 && b.h > 20 ? b : null; };
const glass = rig => 'figure.sim-phone[data-rig="' + rig + '"] .sim-glass';

// one tap on a phone: a step of the script, else something on screen chosen at random (bigger things more often)
async function tapRandom(f) {
  const t = await f.evaluate(() => {
    const ok = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width >= 24 && r.height >= 24 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && s.visibility !== "hidden" && s.pointerEvents !== "none" && !el.disabled && !el.closest("[hidden],[aria-hidden=true]"); };
    const all = [...document.querySelectorAll("button, [role=button], input[type=range], canvas, [data-tap]")].filter(ok);
    if (!all.length) return null;
    const w = all.map(el => { const r = el.getBoundingClientRect(); return Math.sqrt(r.width * r.height) * (/\bl-main\b/.test(el.className) ? 3 : 1); });
    let n = Math.random() * w.reduce((a, b) => a + b, 0), i = 0; while (i < all.length - 1 && (n -= w[i]) > 0) i++;
    const el = all[i];
    if (el.type === "range") { const lo = +el.min || 0, hi = el.max === "" ? 100 : +el.max; el.value = String(lo + Math.random() * (hi - lo)); el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); return { done: true }; }
    el.setAttribute("data-lamba-clips", "1"); const r = el.getBoundingClientRect();
    return { canvas: el.tagName === "CANVAS", w: r.width, h: r.height };
  }).catch(() => null);
  if (!t || t.done) return;
  const position = t.canvas ? { x: t.w * (0.2 + Math.random() * 0.6), y: t.h * (0.2 + Math.random() * 0.6) } : undefined;
  await f.click("[data-lamba-clips]", { force: true, timeout: 1500, position }).catch(() => {});
  await f.evaluate(() => { const e = document.querySelector("[data-lamba-clips]"); if (e) e.removeAttribute("data-lamba-clips"); }).catch(() => {});
}
// play for ms: the script's steps in a loop, else a tap every second or so, on each player's phone in turn (the phone
// in the picture more often)
async function play(phones, main, steps, ms) {
  const end = Date.now() + ms;
  if (steps) {
    for (let i = 0; Date.now() < end; i = (i + 1) % steps.length) {
      const s = steps[i];
      if (s.wait) { await wait(Math.min(+s.wait || 0, end - Date.now())); continue; }
      const f = phones[s.phone || main]; if (f && s.tap) await f.click(s.tap, { force: true, timeout: 1500 }).catch(() => {});
      await wait(250);
    }
    return;
  }
  const order = Object.keys(phones); let k = 0;
  while (Date.now() < end) {
    const who = Math.random() < 0.55 ? main : order[k++ % order.length];
    if (phones[who]) await tapRandom(phones[who]);
    await wait(Math.min(700 + Math.random() * 700, Math.max(0, end - Date.now())));
  }
}

// the simulator's own screen, frame by frame (Chrome's screencast, sharp JPEGs to a folder): only while a clip plays
function camera(p, cdp, tmp) {
  let cur = null, n = 0;
  cdp.on("Page.screencastFrame", f => {
    cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
    if (!cur) return;
    const file = join(tmp, String(++n).padStart(6, "0") + ".jpg"); writeFileSync(file, Buffer.from(f.data, "base64"));
    cur.push({ file, t: f.metadata.timestamp || Date.now() / 1000 });
  });
  return {
    async start() { cur = []; await cdp.send("Page.startScreencast", { format: "jpeg", quality: 90, everyNthFrame: 1 }); const end = Date.now() + 3000; while (!cur.length && Date.now() < end) await wait(30); return cur.length ? cur[0].t : Date.now() / 1000; },
    async stop() { const got = cur; await cdp.send("Page.stopScreencast").catch(() => {}); cur = null; return got || []; }
  };
}
// the simulator, bigger: the phones as tall as a clip, the stage at the top of the window (the page's own sizes otherwise)
const BIG = "(function(){if(window!==top||!/\\/devs\\/simulator\\//.test(location.pathname))return;var s=document.createElement('style');"
  + "s.textContent='.sim-stage{--ph:860px!important}.dv-wrap:has(.sim){max-width:none!important}.dv-head,.dv-foot{display:none!important}';"
  + "document.addEventListener('DOMContentLoaded',function(){document.head.appendChild(s)});})();";

async function record(dir, base, browser, tmp) {
  const m = JSON.parse(readFileSync(join(dir, "lamba.json"), "utf8")), id = m.id || basename(dir);
  const pl = m.players || {}, guestsN = m.guests ? Math.max(1, Math.min(3, pl.max || 1, Math.max(2, pl.min || 1))) : 0;
  const steps = SCRIPT ? JSON.parse(readFileSync(resolve(SCRIPT), "utf8")) : null;
  if (steps && (!Array.isArray(steps) || !steps.length)) throw new Error("--script: a list of steps, like [{ \"phone\": \"g1\", \"tap\": \"#go\" }, { \"wait\": 800 }]");
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1700 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(BIG);
  const p = await ctx.newPage(), cam = camera(p, await ctx.newCDPSession(p), tmp);
  const errors = []; p.on("pageerror", e => errors.push(e.message));
  await p.goto(base + "/devs/simulator/" + (guestsN ? "?guests=" + guestsN : ""));
  await p.waitForSelector("#zipBtn", { timeout: 15000 });
  await p.setInputFiles("#zipInput", { name: id + ".zip", mimeType: "application/zip", buffer: zipOf(dir, id + "/") });
  if (!await sealed(p, "tv", "screen", 15000)) throw new Error("the TV page never said hello: run node lamba-test.mjs " + basename(dir) + " and fix what it says first");
  const rigs = guestsN ? Array.from({ length: guestsN }, (x, i) => "g" + (i + 1)) : ["owner"], phones = {};
  for (const r of rigs) phones[r] = await sealed(p, r, r === "owner" ? "controller" : "guest", 10000);
  if (guestsN) phones.owner = await sealed(p, "owner", "controller", 4000);
  const main = rigs[0];
  if (!phones[main]) throw new Error("the phone page never said hello on " + (guestsN ? "a guest's phone" : "the owner's phone"));
  const top = async () => { await p.evaluate(() => { const s = document.getElementById("stage"); if (s) scrollTo(0, s.getBoundingClientRect().top + scrollY); }); await wait(1500); };
  await top();
  const windows = [];
  // the TV and a phone, then the same phone big
  for (const kind of ["play", "phone"]) {
    const tv = await box(p, "#tvScreen"), ph = await box(p, glass(main));
    if (!tv || !ph) throw new Error("the simulator's TV or phone is not on screen");
    const from = await cam.start(); await play(phones, main, steps, SECONDS * 1000 + 500);
    windows.push({ kind, from, to: Date.now() / 1000, frames: await cam.stop(), tv, ph });
  }
  // settings of its own: the owner's drawer open at the first setting with pictures to choose, each choice sent to the TV
  const fields = (m.settings || {}).fields || {}, pick = q => q && q.setting && ["choice", "switch", "colour"].includes((fields[q.setting] || {}).type);
  const g = ((m.settings || {}).groups || []).find(x => x && x.key && Array.isArray(x.parts) && x.parts.some(pick));
  if (g) {
    const part = g.parts.find(pick);
    await p.goto(base + "/devs/simulator/?app=local" + (guestsN ? "&guests=" + guestsN : "") + "&g=" + encodeURIComponent(g.key) + "&p=" + encodeURIComponent(part.setting));
    const host = await (async () => { const end = Date.now() + 10000; while (Date.now() < end) { const f = rigFrame(p, "owner"); if (f && await f.$(".ctl-strip button").catch(() => null)) return f; await wait(200); } return null; })();
    await sealed(p, "tv", "screen", 10000);
    for (const r of rigs) if (r !== "owner") phones[r] = await sealed(p, r, "guest", 6000);
    await top();
    const tv = await box(p, "#tvScreen"), ph = await box(p, glass("owner"));
    if (host && tv && ph) {
      const n = await host.evaluate(() => document.querySelectorAll(".ctl-strip button").length).catch(() => 0), from = await cam.start(), end = Date.now() + SECONDS * 1000 + 500;
      for (let i = 1; Date.now() < end && n; i++) {
        await host.evaluate(i => { const b = document.querySelectorAll(".ctl-strip button")[i]; if (b) { b.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); b.click(); } }, i % n).catch(() => {});
        await wait(700);
        await host.evaluate(() => { const s = [...document.querySelectorAll("button")].find(b => /Send to TV/i.test(b.textContent) && b.offsetWidth > 0 && !b.disabled); if (s) s.click(); }).catch(() => {});
        if (guestsN && !steps && phones[main]) await tapRandom(phones[main]);
        await wait(Math.min(1500, Math.max(0, end - Date.now())));
      }
      windows.push({ kind: "settings", from, to: Date.now() / 1000, frames: await cam.stop(), tv, ph });
    }
  }
  await ctx.close();
  return { id, m, windows, errors };
}

// ---------- the clips: cut out, laid out at 540 x 920, H.264 ----------
const even = n => Math.max(2, Math.round(n / 2) * 2);
function cut(w, out, tmp) {
  // the frames as they came, each shown until the next one (ffmpeg's concat list)
  const fr = w.frames.filter(f => f.t >= w.from - 0.05);
  if (!fr.length) throw new Error("no picture was recorded");
  const list = join(tmp, "list-" + w.kind + ".txt"), L = [];
  fr.forEach((f, i) => { L.push("file '" + f.file.replace(/'/g, "'\\''") + "'"); L.push("duration " + Math.max(0.001, ((i + 1 < fr.length ? fr[i + 1].t : Math.max(w.to, f.t + 0.04)) - f.t)).toFixed(4)); });
  L.push("file '" + fr[fr.length - 1].file.replace(/'/g, "'\\''") + "'");
  writeFileSync(list, L.join("\n") + "\n");
  // with their bezels: the phone's 8 px, the TV's 10 px
  const crop = (b, e) => "crop=" + even(b.w + 2 * e) + ":" + even(b.h + 2 * e) + ":" + even(b.x - e) + ":" + even(b.y - e);
  const M = 28, bg = ":color=" + BG;
  let filter;
  if (w.kind === "phone") {   // the phone, big
    const ph = even(H - 2 * M), pw = even(ph * (w.ph.w + 16) / (w.ph.h + 16));
    filter = "[0:v]fps=" + FPS + "," + crop(w.ph, 8) + ",scale=" + pw + ":" + ph + ":flags=lanczos,setsar=1,pad=" + W + ":" + H + ":" + (W - pw) / 2 + ":" + M + bg + ",format=yuv420p[v]";
  } else {   // the TV on top, the phone below it
    const tw = W - 2 * 14, th = even(tw * (w.tv.h + 20) / (w.tv.w + 20)), py = M + th + M, ph = even(H - py - M), pw = even(ph * (w.ph.w + 16) / (w.ph.h + 16));
    filter = "[0:v]fps=" + FPS + ",split=2[a][b];[a]" + crop(w.tv, 10) + ",scale=" + tw + ":" + th + ":flags=lanczos,setsar=1,pad=" + W + ":" + H + ":14:" + M + bg + "[top];"
      + "[b]" + crop(w.ph, 8) + ",scale=" + pw + ":" + ph + ":flags=lanczos,setsar=1[ph];[top][ph]overlay=" + (W - pw) / 2 + ":" + py + ",format=yuv420p[v]";
  }
  execFileSync(FF, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-filter_complex", filter, "-map", "[v]", "-t", String(SECONDS), "-r", String(FPS),
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-crf", "23", "-preset", "slow", "-an", "-movflags", "+faststart", out]);
}
// the poster: the clip's first frame, as webp (Chromium writes it)
async function poster(browser, mp4, out) {
  const png = out + ".png";
  execFileSync(FF, ["-y", "-loglevel", "error", "-i", mp4, "-frames:v", "1", png]);
  const pg = await browser.newPage();
  const b64 = await pg.evaluate(async src => { const i = new Image(); i.src = src; await i.decode(); const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; c.getContext("2d").drawImage(i, 0, 0); return c.toDataURL("image/webp", 0.82).split(",")[1]; }, "data:image/png;base64," + readFileSync(png).toString("base64"));
  await pg.close(); unlinkSync(png);
  writeFileSync(out, Buffer.from(b64, "base64"));
}
const CAPTION = { play: "On the TV, played from a phone", phone: "On a phone", settings: "Settings, live on the TV" };

// lamba.json's "clips", changed in place (the rest of the file as it was)
function listClips(dir, clips) {
  const f = join(dir, "lamba.json"), t = readFileSync(f, "utf8"), line = JSON.stringify(clips).replace(/","/g, "\", \"").replace(/\],\[/g, "], [");
  const i = t.search(/"clips"\s*:\s*\[/);
  if (i < 0) { writeFileSync(f, t.replace(/\n?\}\s*$/, ",\n \"clips\": " + line + "\n}\n")); return; }
  let j = t.indexOf("[", i), d = 0, s = false;
  for (; j < t.length; j++) { const c = t[j]; if (s) { if (c === "\\") j++; else if (c === '"') s = false; continue; } if (c === '"') s = true; else if (c === "[") d++; else if (c === "]" && --d === 0) break; }
  writeFileSync(f, t.slice(0, t.indexOf("[", i)) + line + t.slice(j + 1));
}

// ---------- the command ----------
let dirs = named.map(a => resolve(a));
if (!dirs.length) {
  const here = process.cwd();
  dirs = existsSync(join(here, "lamba.json")) ? [here] : readdirSync(here).filter(n => !SKIP(n) && existsSync(join(here, n, "lamba.json"))).map(n => join(here, n));
  if (dirs.length !== 1) { say("lamba clips: name your app's folder: node lamba-clips.mjs my-app"); process.exit(2); }
}
const dir = dirs[0];
if (!existsSync(join(dir, "lamba.json"))) { say("lamba clips: " + dir + " has no lamba.json (choose your app's own folder)"); process.exit(2); }
const tmp = mkdtempSync(join(tmpdir(), "lamba-clips-"));
const server = await serve(), base = "http://127.0.0.1:" + server.address().port;
let browser;
try { browser = await chromium.launch({ headless: !HEADED }); }
catch (e) { say("lamba clips: Chromium is not installed for Playwright. Run: npx playwright install chromium"); server.close(); process.exit(2); }
let R;
try { say("lamba clips: recording " + basename(dir) + " in the simulator (about " + Math.round(SECONDS * 3 + 15) + " s)"); R = await record(dir, base, browser, tmp); }
catch (e) { say("lamba clips: stopped: " + (e && e.message ? e.message.split("\n")[0] : e)); await browser.close(); server.close(); rmSync(tmp, { recursive: true, force: true }); process.exit(1); }
mkdirSync(join(dir, "clips"), { recursive: true });
const made = [];
try {
  for (const w of R.windows) {
    const name = R.id + "-" + w.kind, mp4 = join(dir, "clips", name + ".mp4"), webp = join(dir, "clips", name + "-poster.webp");
    cut(w, mp4, tmp); await poster(browser, mp4, webp);
    made.push({ name, mp4, webp, caption: CAPTION[w.kind] });
  }
} catch (e) { say("lamba clips: making the clips stopped: " + String(e && (e.stderr && String(e.stderr).trim().split("\n").pop() || e.message) || e).split("\n")[0]); }
await browser.close(); server.close(); rmSync(tmp, { recursive: true, force: true });
if (made.length < 2) { say("lamba clips: fewer than 2 clips were made, so lamba.json is as it was. Run it again, or with --headed to watch."); process.exit(1); }
// the starter's placeholders out (Lamba refuses an upload with them), and the clips listed before that are not these kept after them
const sha = f => createHash("sha256").update(readFileSync(f)).digest("hex"), removed = [];
for (const n of readdirSync(join(dir, "clips"))) { const f = join(dir, "clips", n); if (statSync(f).isFile() && PLACEHOLDERS.includes(sha(f))) { unlinkSync(f); removed.push("clips/" + n); } }
const kept = (Array.isArray(R.m.clips) ? R.m.clips : []).filter(c => Array.isArray(c) && !made.some(x => x.name === c[0]) && existsSync(join(dir, "clips", c[0] + ".mp4")) && existsSync(join(dir, "clips", c[0] + "-poster.webp")));
listClips(dir, made.map(x => [x.name, x.caption]).concat(kept));
say("\nWritten in " + relative(process.cwd(), join(dir, "clips")) + ", each 540 x 920, H.264, " + SECONDS + " s:");
for (const x of made) say("  " + relative(process.cwd(), x.mp4) + " (" + Math.round(statSync(x.mp4).size / 1024) + " KB) and " + basename(x.webp));
if (removed.length) say("Removed the starter's placeholders: " + removed.join(", "));
if (kept.length) say("Kept your own clips after these: " + kept.map(c => c[0]).join(", "));
if (R.errors.length) say("Errors in a page while recording (run node lamba-test.mjs): " + [...new Set(R.errors)].slice(0, 3).join(" | "));
say("Next: look at each -poster.webp, and write captions in lamba.json \"clips\" that say what each clip shows (60 letters at most).");
