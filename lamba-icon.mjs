#!/usr/bin/env node
// lamba icon: a clean app icon from a picture you choose. One clear subject, centred inside the safe area, on a soft gradient; Lamba rounds the corners later.
//   node lamba-icon.mjs picture.png [my-app] [--tint "#b3541e"] [--out icon.svg]
// What it makes: icon.svg, a 60 x 60 square. The background is a soft gradient of one colour (--tint, else the "tint" in lamba.json, else a calm grey); the picture
// sits in the middle 80% (9 to 51 of 60), shown whole (never cropped, never stretched), so nothing touches the edges and the rounded corners cut nothing.
// Choose a picture that is ONE subject: a flame, a clock face, a ball. Not a screenshot, not a wide photo: at 48 px it must still read. Then look at icon.svg.
// With ffmpeg on this computer (or ffmpeg-static) the picture is scaled down first so the icon stays small (under 20 KB); without it the picture is used as it is.
//   node lamba-check.mjs my-app    warns when an icon is a picture that fills the square, a shape at the edges, or heavy.
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve, extname, basename } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const named = args.filter((a, i) => !a.startsWith("-") && !["--tint", "--out"].includes(args[i - 1]));
const say = (...a) => console.log(...a);
const pic = named[0], dir = named[1] ? resolve(named[1]) : existsSync("lamba.json") ? process.cwd() : null;
if (!pic || !existsSync(pic)) { say("lamba icon: give a picture of ONE subject (png, jpg or webp):\n  node lamba-icon.mjs flame.png my-app"); process.exit(2); }
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" }, type = MIME[extname(pic).toLowerCase()];
if (!type) { say("lamba icon: a png, jpg or webp picture please (" + basename(pic) + ")"); process.exit(2); }

// the tint: a flag, else lamba.json's "tint", else a calm grey
let tint = opt("--tint");
if (!tint && dir && existsSync(join(dir, "lamba.json"))) { try { tint = JSON.parse(readFileSync(join(dir, "lamba.json"), "utf8")).tint; } catch (e) {} }
if (!/^#[0-9a-fA-F]{6}$/.test(tint || "")) tint = "#4a4d57";
const mix = (hex, t, to) => { const n = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)), m = to === "white" ? 255 : 0; return "#" + n.map(c => Math.round(c + (m - c) * t).toString(16).padStart(2, "0")).join(""); };
const top = mix(tint, 0.22, "white"), bottom = mix(tint, 0.38, "black");

// a smaller copy of the picture, if ffmpeg is here
function ffmpeg() {
  const ok = b => { try { execFileSync(b, ["-version"], { stdio: "ignore" }); return true; } catch (e) { return false; } };
  if (ok("ffmpeg")) return "ffmpeg";
  try { const b = createRequire(join(process.cwd(), "x.js"))("ffmpeg-static"); if (b && ok(b)) return b; } catch (e) {}
  return null;
}
let bytes = readFileSync(pic), mime = type;
const FF = ffmpeg();
if (FF) {
  const tmp = mkdtempSync(join(tmpdir(), "lamba-icon-")), out = join(tmp, "p.png");
  try { execFileSync(FF, ["-y", "-loglevel", "error", "-i", pic, "-vf", "scale=192:192:force_original_aspect_ratio=decrease", "-frames:v", "1", out]); bytes = readFileSync(out); mime = "image/png"; } catch (e) {}
  rmSync(tmp, { recursive: true, force: true });
}
const svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">'
  + '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + bottom + '"/></linearGradient>'
  + '<radialGradient id="l" cx="50%" cy="38%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>'
  + '<rect width="60" height="60" fill="url(#g)"/><rect width="60" height="60" fill="url(#l)"/>'
  + '<image x="9" y="9" width="42" height="42" preserveAspectRatio="xMidYMid meet" xlink:href="data:' + mime + ';base64,' + bytes.toString("base64") + '"/></svg>\n';
const out = resolve(opt("--out") || (dir ? join(dir, "icon.svg") : "icon.svg"));
writeFileSync(out, svg);
say("lamba icon: wrote " + out + " (" + Math.round(svg.length / 1024) + " KB): the picture whole in the middle 70% of a soft " + tint + " square.");
if (svg.length > 20000) say("It is over 20 KB: run it with ffmpeg on this computer (brew install ffmpeg, or npm i ffmpeg-static) so the picture is made smaller.");
say("Look at it small (48 px). If the subject is not clear there, choose a simpler picture. In lamba.json: \"icon\": \"icon.svg\".");
