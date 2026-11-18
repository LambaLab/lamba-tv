# Patterns for a Lamba app

Copy these shapes. Every call is in `lamba.d.ts` and at https://lamba.tv/devs/docs/sdk/.

## The screen page (tv.html): ES5, the authority

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bird quiz</title>
<link rel="stylesheet" href="/fonts/css2?family=Figtree:wght@500;700&display=swap">
<style>
html, body { margin: 0; height: 100%; overflow: hidden; font-family: Figtree, sans-serif; }
body { display: -webkit-box; display: flex; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; text-align: center; }
h1 { margin: 0; font-size: 12vh; }
p { margin: 3vh 0 0; font-size: 4.5vh; }
</style>
</head>
<body>
<div><h1 id="big">Bird quiz</h1><p id="line"></p></div>
<script src="../../shell/sdk/lamba.js"></script>
<script>
(function () {
  "use strict";
  Lamba.ready(function (L) {
    var isTv = L.screen.view === "screen";          // the real screen: only it decides, saves and plays sound
    var state = L.store.get("state") || { scores: {} };

    function draw() { /* draw from state and L.settings: also runs on the copy (preview) and in pictures */ }
    function save() { if (isTv) L.store.set("state", state); }
    function card() { if (isTv) L.joinCard({ show: true, size: L.players.length ? "corner" : "full", line: "Scan to play" }); }

    L.on("answer", function (m, from) {                // from: a player id like "v1", or "owner" (the Host)
      if (!isTv) return;
      var p = L.players.filter(function (x) { return x.id === from; })[0];
      if (!p) return;                                  // only seated players count
      state.scores[from] = (state.scores[from] || 0) + 1;
      save(); draw();
      L.send({ type: "scored", you: state.scores[from] }, from);   // one Player
      L.send({ type: "state", state: state }, "guests");           // every Player
    });
    L.onPlayers(function () { card(); draw(); });
    L.onSettings(function (s, changed) { draw(); });
    L.store.on(function (k, v) { if (k === "state" && v) { state = v; draw(); } });   // the copy follows the screen
    draw(); card();
    L.drawn();                                         // the host fades the page in
  });
})();
</script>
</body>
</html>
```

- Text from people (names) goes in with `textContent` or `createTextNode`, never `innerHTML`.
- `L.colours({ board: "#123c46", ink: "#e6fbf4" })` once the colours are known, so the frame matches.
- In view `picture`, draw the choice in `L.settings` (the host gives the picture's choice there) and call
  `L.drawn()`. Keep pictures still: no timers.

## A glow that looks real (Screen, Canvas2D)

```js
function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
// one lit tube (path already traced): soft nested strokes, vivid edge to a tinted hot middle, outer ones see-through
var SH = [[1.06, 0, .35], [.96, .08, .6], [.86, .18, .7], [.74, .28, .7], [.62, .36, .65], [.5, .43, .55]];   // [width, whiteness, alpha]
for (var i = 0; i < SH.length; i++) {
  var c = mix(colour, [255, 255, 255], SH[i][1]);
  g.strokeStyle = "rgba(" + c.map(Math.round).join(",") + "," + SH[i][2] + ")"; g.lineWidth = width * SH[i][0]; g.stroke();
}
// the glow: draw the shapes small, scale up (that is the blur), add with "lighter"; never "lighten", never an outline
// the shadow on the wall: drawn once per size into its own canvas, laid on with "multiply", none on a black wall
```
See "Light that looks real" in the design rules.

## Art that fills the screen, with a part that keeps its shape (a mantel)

For a fireplace, an aquarium, scenery or any picture: the scene covers the whole page edge to edge, and a part with its own
shape (here a mantel) keeps its proportions. lamba.json says `"frame": "none"`.

```html
<style>
html, body { margin: 0; height: 100%; overflow: hidden; background: #000; }
#scene { position: absolute; left: 0; top: 0; }
#mantel { position: absolute; left: 50%; bottom: 0; width: 1600px; height: 260px; margin-left: -800px;
  -webkit-transform-origin: 50% 100%; transform-origin: 50% 100%; background: #3a2a22; }
#words { position: absolute; left: 5%; right: 5%; top: 5%; }   /* words stay inside a 5% safe margin */
</style>
<canvas id="scene" width="1920" height="1080"></canvas>
<div id="mantel"></div>
<div id="words"></div>
<script>
// the scene is drawn once at 1920 x 1080; the page shows it covering everything
function cover(w, h, sw, sh) {
  var k = Math.max(w / sw, h / sh);                       // the larger scale: no empty strip, the overflow crops
  return { k: k, x: (w - sw * k) / 2, y: (h - sh * k) / 2 };
}
// a part designed for a 1920 x 1080 page keeps its shape: one scale for both directions (the smaller), never stretched
function keepShape(w, h) { return Math.min(w / 1920, h / 1080); }

function layout(w, h) {
  var c = cover(w, h, 1920, 1080), scene = document.getElementById("scene"), m = document.getElementById("mantel"), k = keepShape(w, h);
  scene.style.width = 1920 * c.k + "px"; scene.style.height = 1080 * c.k + "px";
  scene.style.left = c.x + "px"; scene.style.top = c.y + "px";
  m.style.webkitTransform = m.style.transform = "scale(" + k + ")";   // anchored to the bottom centre: it sits on the edge
}
layout(window.innerWidth, window.innerHeight);
window.addEventListener("resize", function () { layout(window.innerWidth, window.innerHeight); });
Lamba.onScreen(function (s) { layout(s.w, s.h); });   // the Host moved a second app beside yours

// the real bounds, for you to read in the page's console at 1920 x 1080, 960 x 540 and a small page: fills must be true
function fillBounds(el) {
  var r = el.getBoundingClientRect(), w = window.innerWidth, h = window.innerHeight;
  var gap = { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(w - r.right), bottom: Math.round(h - r.bottom) };
  return { gap: gap, fills: gap.left <= 1 && gap.top <= 1 && gap.right <= 1 && gap.bottom <= 1 };   // a negative gap is the crop
}
</script>
```

- A framed or fit option is a settings choice whose default is fill: `cover` for fill, and for fit use `Math.min` in place of
  `Math.max` and centre it.
- Words and anything to read go inside the 5% margin (`#words`); the scene itself bleeds past it.
- `Lamba.onScreen` gives the page's own size: take sizes from it, not from `screen.width`, because a second app may sit beside yours.

## The Player's remote (phone.html, view "guest"): the whole phone, one big key

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Bird quiz</title>
<link rel="stylesheet" href="/fonts/css2?family=Figtree:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="../../shell/sdk/ui.css">
<style>
/* the remote's own colours: its body, its key, the key's side and its word, the Player's dot */
.l-remote { --l-remote: #10241c; --l-remote-hi: #23503d; --l-key: #9be7b8; --l-key-hi: #c8f5d8; --l-key-edge: #3f8f63; --l-key-ink: #0b2618; --l-me: #9be7b8; }
</style>
</head>
<body>
<main class="l-remote">
  <div class="l-remote-main"><div class="l-well"><button type="button" class="l-key l-big" id="go">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Answer</button></div></div>
  <div class="l-keys"><button type="button" class="l-key" id="again">Hear it again</button></div>
  <p class="l-remote-foot" id="foot"></p>
</main>
<script src="../../shell/sdk/lamba.js"></script>
<script src="../../shell/sdk/ui.js"></script>
<script>
Lamba.ready(function (L) {
  // Lamba's join already has the name (L.me().name): never ask for it. Players' picture choices (Fire, Size, Sound)
  // are not drawn here: mark those groups "players": true in lamba.json and Lamba shows the Host's tiles under this page.
  // LambaUI.press: the key goes down under the finger at once with a tap of the phone; the action runs on the tap
  LambaUI.press(document.getElementById("go"), function () { L.send({ type: "answer" }); });
  LambaUI.press(document.getElementById("again"), function () { L.send({ type: "again" }); });
  L.on("scored", function (m) { document.getElementById("foot").textContent = "Your score: " + m.you; });
  L.drawn();
});
</script>
</body>
</html>
```

- View `guest` is a Player's whole phone: a real remote made for this app, never a page that scrolls. View `part` is a part
  of the settings drawer the app draws (lamba.json `{ "app": "<part>" }`, `L.screen.part`). There is no view for the Host.
- The Host's phone is Lamba's: the live screen and one row of tiles. A one tap thing the Host does is an action in
  lamba.json, heard on the screen page:

```js
// lamba.json: "actions": [{ "key": "tend", "label": "Tend the fire", "icon": "pictures/tend.svg" }]
L.on("action", function (m) { if (m.key === "tend") stoke(); });    // tv.html: the real screen and the Host's copy hear it
L.action("go", { label: running ? "Pause" : "Start", icon: running ? "pictures/pause.svg" : "pictures/play.svg" });   // what a tile says now
```
- Onboarding for Players, if any: one short screen with a real picture of the app or the screen and plain words. Never
  clip art or emoji; never a name step of your own (Lamba's join asks it when lamba.json has askName: true).
- To steer or aim: a slide track (a wide bar the finger drags along, sending its position a few times a second),
  never four arrow buttons. A game controller: a "Left hand" / "Right hand" switch that mirrors the layout, asked once.
- Messages: at most 4 KB, at most 40 a second per device. Send positions at 10 to 20 a second, not on every move.

## Motion and camera (lamba.json "permissions": ["motion"] or ["camera"], phone pages only)

```js
var steer = Lamba.stream("steer", 20, "tv");               // a rate-limited sender: the latest wins, 1 to 30 a second; straight to the screen over the Wi-Fi when it can, else the room
tilt.onclick = function () {                                // from a tap
  Lamba.motion.start().then(function (state) {              // Lamba's sheet asks; "on" | "finger" | "denied" | "none"
    if (state !== "on") return touchWay();
    Lamba.motion.on("tilt", function (t) { steer({ x: t.x, y: t.y }); });          // -1..1, x right, y down, already calm
    Lamba.motion.on("swing", function (s) { Lamba.send({ type: "throw", power: s.power, dir: s.dir }, "tv"); });   // once
    Lamba.motion.on("shake", function () { Lamba.send({ type: "again" }, "tv"); });
  });
};
wave.onclick = function () {                                // the phone asks "Use your camera?"
  var s = Lamba.track.start({ camera: "front", pose: false, hands: true, rate: 20 });   // ask only for what you use (model: "auto" is the default: the Tracking Lab's own light-to-full schedule)
  s.on("frame", function (f) { var h = f.hands[0]; if (h) hand({ x: f.mirror ? 1 - h.points[8].x : h.points[8].x, y: h.points[8].y }); });
  s.ready.then(null, function () { touchWay(); });          // "denied" or no camera
};
Lamba.track.cameras().then(function (c) { if (c.kind === "flip") showSwitch(); });     // session.switchCamera()
```

The frame is landmarks and gesture names (`f.hands[0].shape`: `fist`, `palm`, `point`..., `f.gestures.body.jump`), never the
picture. The screen page gets small messages, never frames. In the simulator both sensors are made up (the Phone sensors panel),
and `lamba-test.mjs` runs them. See docs "Motion and camera" and the example `move-and-pop`.

## The microphone (lamba.json "permissions": ["microphone"])

```js
// a phone page: loudness and a blow (Lamba asks first and shows its sign; only the number leaves the phone)
var lvl = Lamba.stream("lvl", 15, "tv"), s = null;
go.onclick = function () {
  if (s) { s.stop(); s = null; return; }
  s = Lamba.mic.level(function (v) { lvl({ v: v }); });
  s.on("blow", function (b) { Lamba.send({ type: "blow", strength: b.strength }, "tv"); });
  s.on("state", function (st) { if (st === "denied" || st === "host" || st === "none") { s = null; useButtons(); } });
};
// words (not on every phone), and a voice message as the other way
if (Lamba.mic.canWords) Lamba.mic.words({ onFinal: function (t) { Lamba.send({ type: "said", text: t }, "tv"); } });
else Lamba.mic.record({ max: 10 }).then(function (r) { if (r) say("Sent"); }, useButtons);
```

```js
// the screen page: voice messages come by themselves; live voice is Lamba's own hold to talk on the phones
Lamba.voice.on("message", function (m) { Lamba.voice.play(m.id); });
Lamba.voice.live({ talkers: 1 }).then(function (st) { if (st === "none") hint(""); });   // "none": this screen cannot play it (it says so)
Lamba.voice.on("talk", function (t) { glow(t.from, t.on); });
```

Never draw a record or talk button, an ask sheet or a listening sign: Lamba does. See docs "Motion, camera and microphone" and the
example `candles`.

## Players and seats (lamba.json)

Game seats (`players`, 50 at most) are for games; many people sending a little (fan a fire, cheer, vote) are an audience:
`"visitors": { "max": 100, "perMinute": 40 }`, 200 at most, same page and messages, `Lamba.visitor` true. The room's real limits
(4 KB a message, 40 a second from one phone, the line of 10) are in the SDK reference, "Game seats or an audience".

## A press and hold key (a Player's remote)

```js
// phone.html (view "guest"): start, a beat while held, one end however it ends (release, cancel, page hidden, 20 s)
var every = Lamba.visitor ? 2500 : 1500;   // a visitor has perMinute messages a minute
LambaUI.hold(document.getElementById("fan"), { every: every, max: 20000,
  start: function () { Lamba.send({ type: "fan", on: true, every: every }); },
  beat: function () { Lamba.send({ type: "fan-beat" }); },
  end: function () { Lamba.send({ type: "fan", on: false }); } });
// tv.html: one hold per phone, expired when its beats stop, so nothing grows forever
var holds = {};
Lamba.on("fan", function (m, from) { if (m.on) holds[from] = { since: Date.now(), at: Date.now(), every: m.every || 1500 }; else delete holds[from]; });
Lamba.on("fan-beat", function (m, from) { if (holds[from]) holds[from].at = Date.now(); });
// each frame: for (k in holds) if (Date.now() - holds[k].at > holds[k].every * 2.5 + 500) delete holds[k];
```

Bound the screen's work however many hold: a fixed most of particles, at most 30 pictures a second, a small canvas scaled up at the
page's own shape. The example `fireside` has all of it.

```json
"players": { "min": 2, "max": 2 }, "guests": true, "screens": { "tv": "tv.html", "phone": "phone.html" }
```

`L.players` on the screen lists the seated Players in the order they came (`[{ id: "v0", name: "Sam" }]`); more wait
in line. The screen answers one Player with `L.send(msg, id)`, all with `L.send(msg, "guests")`.

## Settings (lamba.json)

```json
"settings": {
 "fields": {
  "look": { "type": "choice", "default": "sea", "choices": [
   { "id": "sea", "name": "Sea", "sub": "Deep blue green", "picture": "live" },
   { "id": "sun", "name": "Sun", "sub": "Warm and bright", "picture": "live" } ] },
  "rounds": { "type": "number", "default": 5, "min": 3, "max": 10, "step": 1, "unit": "rounds" },
  "names": { "type": "switch", "default": true, "on": { "name": "Show names" }, "off": { "name": "No names" } },
  "vol": { "type": "number", "default": 2, "min": 0, "max": 4, "step": 1, "labels": ["Off", "Soft", "Medium", "Loud", "Loudest"], "apply": "now" }
 },
 "groups": [
  { "key": "look", "label": "Look", "icon": "live", "parts": [{ "setting": "look", "label": "Look" }] },
  { "host": "frame" }, { "host": "mat" },
  { "key": "game", "label": "Game", "parts": [{ "setting": "rounds", "label": "Rounds" }, { "setting": "names", "label": "Names" }, { "setting": "vol", "label": "Sound" }] },
  { "host": "brightness" }
 ]
}
```

Every field is in a group (or `"hidden": true`). A colour list ends with a pick-your-own choice; an animal set
includes a sloth.

- A photo slot is a `photo` field, `{ "type": "photo", "aspect": "4:3" }` in a group part (`"players": true` for Players too). Lamba shows the picker
  and the crop; your app just draws the URL in `Lamba.settings` (`""` while empty: draw an empty frame) with `<img>` or `drawImage`. No own `<input type=file accept=image>`.
- Beyond choice, switch, number, text, list and colour, a field may be `colours` (up to 12 `#rrggbb`) or `strokes` (paths of
  tubes made on the phone, `{ "tubes": [{ "c": part, "p": [x, y, ...], "z": 0 }], "names": [] }`, at most `max` characters of
  JSON). Both are usually `"hidden": true` and set from an app part with `Lamba.change`. A phone page takes a photo with
  `LambaUI.photo` (move, size, turn and crop, never stretches, uses `Lamba.fill`), what is in it with `LambaVision` (`shell/sdk/vision.js`, phone pages only: `subject(canvas)` cuts out a person, pet or object, `face(canvas)` gives the face mesh; catch a rejection and fall back), words with `LambaUI.textarea`. Colours: a `colours` field
  with `swatches` in a group part gets the drawer's own colour strip and picker (never draw dots). Parts people may place: a `transforms`
  field and `Lamba.parts(list)` from the screen page.
- Google fonts: `Lamba.fonts.list/search/get/load` and `LambaUI.fontPicker({ value, sample, extra, onChange })` (search, kinds, tiles
  drawn in each font, weights and Italic). Fonts come through Lamba's own address and load on the phone only: draw words there
  (canvas), send the screen paths. Store family (text), weight (number, 0 for regular) and italic (0 or 1) as hidden settings, beside any older
  font setting, never replacing it. Never link `fonts.googleapis.com`; for a fixed font use `<link href="/fonts/css2?family=Figtree:wght@400;700">`.
- A change waits on the Host's phone until they tap "Send to screen" (the copy of the screen shows it at once). Only who may
  join, for how long and the sound go at once (`"apply": "now"`, as `vol` above), never the look.
- A choice for nothing is `{ "id": "none", "name": "None" }`, with no picture: the host draws its "no" sign.
- The host adds "Try as a player" (apps Players join), "Scribble" and "Effects" to the drawer. Don't build them, and
  don't take their group keys (`guest`, `scribble`, `effects`).

## Saved data

`L.store` (Screen and the Host's phones): keys of letters, digits, `_` and `-`; 4 KB a value; 16 KB and 32 keys in
all. The screen writes; `L.store.on` tells the others. No other storage exists.

## Sound (Screen, lamba.json "permissions": ["sound"])

```js
function chime() {
  var ac = L.sound.context(); if (!ac || !L.sound.unlocked || L.screen.view !== "screen") return;
  var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.frequency.value = 660; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.65);
}
```

## The remote's OK (lamba.json "remote": { "ok": true })

```js
L.onKey(function (k) { if (k.down) startOrPause(); });
```
