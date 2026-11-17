#!/usr/bin/env node
// lamba film: turn a video into the files Lamba.film plays, the way Lamba's own apps' films are made.
//   node lamba-film.mjs <video> [--name sea] [--out my-app/films] [options]
// It needs ffmpeg with H.264 (libx264). It uses the computer's own, else ffmpeg-static (npm i ffmpeg-static), else the
// one FFMPEG points at. Nothing else: no Python, no cjpeg.
//
// What it writes into --out (default ./films), for --name sea:
//   sea.film         REQUIRED. 1920 x 1080, H.264 High 4.0, yuv420p, no sound, +faststart. An MP4 inside; the name ends
//                    in .film so a screen's browser never takes it for a video.
//   sea-720.film     1280 x 720, the same codec. The loader falls to it on a screen that cannot play 1080 smoothly.
//   sea-360.film     640 x 360. The Host's phone preview plays this one (a quarter of the pixels, so the phone stays cool).
//   sea.webp         the first picture (or sea.jpg when ffmpeg has no WebP): the still, for when no rung plays.
//   sea.seq.json and sea.seq.0.jpgs, sea.seq.1.jpgs ...   only with --seq: the loop as JPEG pictures (about 2 seconds a
//                    file) for screens that decode a film but cannot paint its frames (an Android TV WebView).
// shell/film.js derives the variants' names from the main one (name-720.film, name-360.film, name.seq.json), so the
// names here are exactly what it asks for. Only name.film is required; a missing variant is a quiet fallback.
//
// Options (type, default):
//   --name <text>       the files' name (small letters, digits, dashes). Default: the video's file name.
//   --out <folder>      where the files go. Default: films
//   --start <seconds>   number, 0: where the loop starts in the video
//   --length <seconds>  number, to the end: how much of the video to use
//   --loop <seconds>    number, 0: make a seamless loop by dissolving the last N seconds into the first N (the loop is
//                       that much shorter). 1 to 2 seconds is plenty.
//   --pingpong          flag: play the stretch forward and then backward (no join to see; nothing may move one way, like a cow walking)
//   --fps <n>           number, 25: the film's frames a second (25 is what Lamba.film expects; 24 to 30 are fine)
//   --max-mb <n>        number, 7: the most the main film may weigh. An app's upload is at most 25 MB in all and 8 MB a
//                       file, so the bit rate is lowered to fit. The 720 and 360 copies weigh about 55% and 20% of it.
//   --bitrate <k>       number (kilobits a second), 6000: the best the main film may use; --max-mb wins when it is lower
//   --fit               flag: keep the whole picture and pad with black (the default fills 16:9 and crops the sides)
//   --seq               flag: also make the pictures (weak screens). They weigh about 0.7 MB a second at 768 wide: use for short loops
//   --seq-width <px>    number, 768: the pictures' width (height follows, 16:9)
//   --seq-fps <n>       number, 24: the pictures' rate (15 is enough for slow scenes)
//   --seq-quality <n>   number 1 to 100, 62: JPEG quality
//   --no-720, --no-360, --no-still   flags: leave that file out
//   --json              flag: print the result as JSON
// Made by Lamba, get the newest at https://lamba.tv/devs/kit/lamba-film.mjs
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync, statSync, rmSync } from "node:fs";
import { join, basename, extname, resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
const FLAGS = ["--pingpong", "--fit", "--seq", "--no-720", "--no-360", "--no-still", "--json", "--help"];
const VALUES = ["--name", "--out", "--start", "--length", "--loop", "--fps", "--max-mb", "--bitrate", "--seq-width", "--seq-fps", "--seq-quality"];
const has = f => argv.includes(f);
const opt = k => { const i = argv.indexOf(k); return i > -1 && i + 1 < argv.length ? argv[i + 1] : null; };
const input = argv.filter((a, i) => !a.startsWith("--") && !VALUES.includes(argv[i - 1]))[0];
const say = (...a) => { if (!has("--json")) console.log(...a); };
const stop = (msg, code) => { console.log("lamba film: " + msg); process.exit(code || 1); };
const num = (k, d, lo, hi) => { const v = opt(k); if (v === null) return d; const n = Number(v); if (!isFinite(n) || n < lo || n > hi) stop(k + " must be a number from " + lo + " to " + hi + " (you gave \"" + v + "\")"); return n; };

if (has("--help") || !input) {
  console.log("lamba film: make a film for Lamba.film from a video.\n  node lamba-film.mjs <video> [--name sea] [--out my-app/films] [--loop 1.5] [--seq] [--max-mb 7]\nEvery option is listed at the top of this file and at https://lamba.tv/devs/docs/films/");
  process.exit(input || has("--help") ? 0 : 1);
}
for (const a of argv) if (a.startsWith("--") && !FLAGS.includes(a) && !VALUES.includes(a)) stop("unknown option " + a + ". Run node lamba-film.mjs --help");
if (!existsSync(input)) stop("the video " + input + " is not there. Give the path of a video file (mp4, mov, webm, mkv).");

// ---------- ffmpeg ----------
const FFMPEG_HELP = "ffmpeg with H.264 is needed to make films. Install it once, then run this again:\n  npm i ffmpeg-static     (works anywhere with Node)\nor install ffmpeg itself (macOS: brew install ffmpeg, Windows: winget install ffmpeg, Linux: apt install ffmpeg), or point FFMPEG at one.";
function findFfmpeg() {
  const encoders = bin => { try { return execFileSync(bin, ["-hide_banner", "-encoders"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch (e) { return ""; } };
  const tries = [];
  if (process.env.FFMPEG) tries.push(process.env.FFMPEG);
  for (const base of [process.cwd(), dirname(fileURLToPath(import.meta.url))]) { try { const b = createRequire(join(base, "x.js"))("ffmpeg-static"); if (b) tries.push(b); } catch (e) {} }
  tries.push("ffmpeg");
  for (const bin of tries) { const e = encoders(bin); if (/libx264/.test(e)) return { bin, webp: /libwebp/.test(e) }; }
  return null;
}
const FF = findFfmpeg();
if (!FF) stop(FFMPEG_HELP, 2);
const ffmpeg = (args, o) => new Promise((ok, no) => {
  const p = spawn(FF.bin, ["-v", "error", "-y", ...args], { stdio: ["ignore", o && o.pipe ? "pipe" : "ignore", "pipe"] });
  const out = [], err = []; if (o && o.pipe) p.stdout.on("data", d => out.push(d)); p.stderr.on("data", d => err.push(d));
  p.on("error", no); p.on("close", c => c === 0 ? ok(Buffer.concat(out)) : no(new Error("ffmpeg " + (Buffer.concat(err).toString().trim().split("\n").pop() || "stopped (" + c + ")"))));
});
function durationOf(file) {
  let t = ""; try { execFileSync(FF.bin, ["-hide_banner", "-i", file], { stdio: ["ignore", "ignore", "pipe"], encoding: "utf8" }); } catch (e) { t = String(e.stderr || ""); }
  const m = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(t); if (!m) return 0;
  return +m[1] * 3600 + +m[2] * 60 + +m[3];
}

// ---------- the choices ----------
const slug = s => String(s).toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const name = opt("--name") !== null ? opt("--name") : slug(basename(input, extname(input)));
if (!/^[a-z0-9][a-z0-9-]{0,59}$/.test(name)) stop("--name must be small letters, digits and dashes (like sea-fire); an app's file names allow nothing else.");
if (/-(720|360|1440|2160)$/.test(name)) stop("--name must not end in -720, -360, -1440 or -2160: those endings are the loader's own for the smaller copies.");
const out = resolve(opt("--out") || "films");
const START = num("--start", 0, 0, 86400), LENGTH = num("--length", 0, 0, 86400), LOOP = num("--loop", 0, 0, 10), FPS = num("--fps", 25, 10, 60);
const MAXMB = num("--max-mb", 7, 0.5, 8), BITRATE = num("--bitrate", 6000, 300, 20000);
const SEQW = Math.round(num("--seq-width", 768, 160, 1920) / 2) * 2, SEQFPS = num("--seq-fps", 24, 5, 30), SEQQ = num("--seq-quality", 62, 1, 100);
const PING = has("--pingpong"), FIT = has("--fit"), WANT_SEQ = has("--seq");
if (LOOP && PING) stop("use --loop or --pingpong, not both.");

const size = (w, h) => FIT
  ? "scale=" + w + ":" + h + ":force_original_aspect_ratio=decrease:flags=lanczos,pad=" + w + ":" + h + ":(ow-iw)/2:(oh-ih)/2:black,setsar=1"
  : "scale=" + w + ":" + h + ":force_original_aspect_ratio=increase:flags=lanczos,crop=" + w + ":" + h + ",setsar=1";
const kb = n => n >= 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";

const made = [], notes = [];
const dir = mkdtempSync(join(tmpdir(), "lamba-film-"));
try {
  const total = durationOf(input);
  if (!total) stop("ffmpeg can't read " + input + ". Is it a video file? (mp4, mov, webm and mkv are fine)");
  if (START >= total) stop("--start " + START + " is past the end of the video (" + total.toFixed(1) + " s).");
  const take = Math.min(LENGTH || total - START, total - START);
  if (LOOP && take <= LOOP * 2 + 1) stop("--loop " + LOOP + " needs a stretch of more than " + (LOOP * 2 + 1) + " s (this one is " + take.toFixed(1) + " s).");
  mkdirSync(out, { recursive: true });

  // 1. the stretch, once, at full size and rate, near lossless: every variant is made from this one
  const base = join(dir, "base.mp4"), vf = [size(1920, 1080), "fps=" + FPS, "format=yuv420p"].join(",");
  await ffmpeg(["-ss", String(START), "-t", String(take), "-i", input, "-an", "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "10", base]);
  let loop = base, secs = take;
  if (LOOP) {   // the last LOOP seconds dissolve into the first LOOP: the join never shows
    const L = take - LOOP, C = LOOP; loop = join(dir, "loop.mp4"); secs = L;
    const fc = "[0:v]split=3[a][b][c];[a]trim=0:" + C + ",setpts=PTS-STARTPTS[head];[b]trim=" + L + ":" + take + ",setpts=PTS-STARTPTS[tail];[c]trim=" + C + ":" + L + ",setpts=PTS-STARTPTS[mid];"
      + "[tail][head]blend=all_expr='A*(1-T/" + C + ")+B*(T/" + C + ")'[mix];[mix][mid]concat=n=2:v=1:a=0,format=yuv420p[v]";
    await ffmpeg(["-i", base, "-filter_complex", fc, "-map", "[v]", "-an", "-r", String(FPS), "-c:v", "libx264", "-preset", "slow", "-crf", "8", loop]);
  } else if (PING) {   // forward, then backward without repeating the turning pictures
    loop = join(dir, "ping.mp4"); secs = take * 2;
    const n = Math.round(take * FPS), fc = "[0:v]split[f][r];[r]reverse,trim=start_frame=1:end_frame=" + (n - 1) + ",setpts=PTS-STARTPTS[b];[f][b]concat=n=2:v=1:a=0,format=yuv420p[v]";
    await ffmpeg(["-i", base, "-filter_complex", fc, "-map", "[v]", "-an", "-r", String(FPS), "-c:v", "libx264", "-preset", "slow", "-crf", "8", loop]);
  }
  // 2. the main film's bit rate: as high as the file budget allows
  const fit = Math.floor(MAXMB * 8 * 1000 * 1000 * 0.92 / secs / 1000);   // kilobits a second that keep it under --max-mb
  const kbps = Math.max(300, Math.min(BITRATE, fit));
  if (fit < 1500) notes.push("The loop is " + secs.toFixed(1) + " s, so the 1080 film gets only " + kbps + " kbit/s to stay under " + MAXMB + " MB, and it will look soft. Use a shorter loop (6 to 12 s is right), or --max-mb up to 8.");
  const film = (file, w, h, rate) => ffmpeg(["-i", loop, "-an", "-vf", "scale=" + w + ":" + h + ":flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-level", "4.0",
    "-b:v", rate + "k", "-maxrate", Math.round(rate * 1.4) + "k", "-bufsize", Math.round(rate * 2) + "k", "-pix_fmt", "yuv420p", "-r", String(FPS), "-movflags", "+faststart", "-f", "mp4", file]);
  const add = (file, what) => { const p = join(out, file); made.push({ file, path: p, bytes: statSync(p).size, what }); };

  await film(join(out, name + ".film"), 1920, 1080, kbps); add(name + ".film", "1080 film (required)");
  if (!has("--no-720")) { await film(join(out, name + "-720.film"), 1280, 720, Math.max(250, Math.round(kbps * 0.55))); add(name + "-720.film", "720 film"); }
  if (!has("--no-360")) { await film(join(out, name + "-360.film"), 640, 360, Math.max(200, Math.round(kbps * 0.2))); add(name + "-360.film", "360 film (the Host's phone preview)"); }
  if (!has("--no-still")) {
    const ext = FF.webp ? ".webp" : ".jpg", args = FF.webp ? ["-c:v", "libwebp", "-quality", "86"] : ["-q:v", "3", "-pix_fmt", "yuvj420p"];
    await ffmpeg(["-i", loop, "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos", ...args, join(out, name + ext)]); add(name + ext, "still picture");
  }

  // 3. the pictures for weak screens: JPEGs one after another in chunks of about 2 seconds, and an index (the same
  // files tools/film_seq.py makes for Lamba's own apps)
  if (WANT_SEQ) {
    const W = SEQW, H = Math.round(W * 9 / 16 / 2) * 2, CH = Math.round(SEQFPS) * 2, qv = Math.max(2, Math.min(31, Math.round(2 + (100 - SEQQ) * 0.1)));
    const raw = await ffmpeg(["-i", loop, "-an", "-vf", "fps=" + Math.round(SEQFPS) + "," + size(W, H) + ",format=yuvj420p", "-c:v", "mjpeg", "-q:v", String(qv), "-huffman", "optimal", "-f", "image2pipe", "-"], { pipe: true });
    const pics = []; let at = 0;
    while (at < raw.length) {   // a picture runs from its FFD8 to the first FFD9 (inside the data FF is always followed by 00 or a restart)
      if (raw[at] !== 0xff || raw[at + 1] !== 0xd8) { at++; continue; }
      let e = at + 2; while (e < raw.length - 1 && !(raw[e] === 0xff && raw[e + 1] === 0xd9)) e++;
      pics.push(raw.subarray(at, e + 2)); at = e + 2;
    }
    if (!pics.length) throw new Error("no pictures came out of ffmpeg");
    const files = [], lens = [];
    for (let k = 0; k < pics.length; k += CH) {
      const part = pics.slice(k, k + CH), f = name + ".seq." + (k / CH) + ".jpgs";
      writeFileSync(join(out, f), Buffer.concat(part)); files.push(f); lens.push(part.map(p => p.length)); add(f, "pictures");
    }
    writeFileSync(join(out, name + ".seq.json"), JSON.stringify({ v: 1, w: W, h: H, fps: Math.round(SEQFPS), n: pics.length, files, lens }));
    add(name + ".seq.json", "pictures' index");
  }
} catch (e) {
  rmSync(dir, { recursive: true, force: true });
  stop(String(e && e.message || e).replace(/^Error: /, "") + "\nNo film was finished. Try another video, or run it again with --no-720 --no-360 to see if one step is the problem.");
}
rmSync(dir, { recursive: true, force: true });

const sum = made.reduce((n, f) => n + f.bytes, 0), main = made.find(f => /^[^/]*\.film$/.test(f.file) && !/-(720|360)\.film$/.test(f.file));
if (main.bytes > 8 * 1024 * 1024) notes.push(main.file + " is " + kb(main.bytes) + " and an upload takes at most 8 MB a file: use --max-mb 7.");
if (sum > 22 * 1024 * 1024) notes.push("These files add up to " + kb(sum) + " and a whole app is at most 25 MB (clips and pages too). Use a shorter loop, a lower --max-mb, or leave --seq out.");
if (!WANT_SEQ) notes.push("No pictures for weak screens (an Android TV WebView falls to the 720 film, then the still). Add --seq for a short loop if that matters to your app.");
if (has("--json")) { console.log(JSON.stringify({ name, out, files: made.map(f => ({ file: f.file, bytes: f.bytes })), notes }, null, 1)); }
else {
  console.log("lamba film: " + name + " is ready in " + out);
  const show = made.filter(f => !/\.seq\.\d+\.jpgs$/.test(f.file));
  for (const f of show) console.log("  " + f.file.padEnd(name.length + 14) + kb(f.bytes).padStart(9) + "  " + f.what);
  const seqs = made.filter(f => /\.seq\.\d+\.jpgs$/.test(f.file)); if (seqs.length) console.log("  " + (name + ".seq.<k>.jpgs").padEnd(name.length + 14) + kb(seqs.reduce((n, f) => n + f.bytes, 0)).padStart(9) + "  " + seqs.length + " files of pictures");
  console.log("  total " + kb(sum) + " in " + made.length + " files");
  notes.forEach(n => console.log("  note: " + n));
  console.log("Use it in tv.html (the file's path from the app's folder):\n  Lamba.film(document.getElementById(\"scene\"), \"films/" + name + ".film\");\nThen: node lamba-check.mjs <your app>");
}
