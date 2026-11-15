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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;700&display=swap">
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

    L.on("answer", function (m, from) {                // from: a player id like "v1", or "owner"
      if (!isTv) return;
      var p = L.players.filter(function (x) { return x.id === from; })[0];
      if (!p) return;                                  // only seated players count
      state.scores[from] = (state.scores[from] || 0) + 1;
      save(); draw();
      L.send({ type: "scored", you: state.scores[from] }, from);   // one guest
      L.send({ type: "state", state: state }, "guests");           // every guest
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

## The phone page (phone.html): one main action, low

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Bird quiz</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="../../shell/sdk/ui.css">
<style>
body.guest { min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 16px 12vh; box-sizing: border-box; }
</style>
</head>
<body>
<p id="hi" hidden></p>
<div class="l-col" style="align-items:center">
  <button type="button" class="l-act l-main go" id="go"><span class="l-i">&#10003;</span><span class="l-l">Answer</span></button>
  <p class="l-note" id="note" role="status"></p>
</div>
<script src="../../shell/sdk/lamba.js"></script>
<script src="../../shell/sdk/ui.js"></script>
<script>
Lamba.ready(function (L) {
  var me = L.me();                                     // { name } the person chose, or null
  if (L.screen.view === "guest") { document.body.className = "guest"; var hi = document.getElementById("hi"); hi.hidden = false; hi.textContent = me ? "Hi " + me.name : "Hi"; }
  document.getElementById("go").onclick = function () {
    if (L.screen.view === "controller" && !L.status.onScreen) { L.show(); return; }   // the owner: put the app on the screen first
    L.send({ type: "answer" });
  };
  L.on("scored", function (m) { document.getElementById("note").textContent = "Your score: " + m.you; });
  L.drawn();
});
</script>
</body>
</html>
```

- View `controller` is the owner's phone (under a copy of the screen), view `guest` a guest's whole phone, view `part`
  a part of the settings drawer the app draws (lamba.json `{ "app": "<part>" }`, `L.screen.part`).
- To steer or aim: a slide track (a wide bar the finger drags along, sending its position a few times a second),
  never four arrow buttons. A game controller: a "Left hand" / "Right hand" switch that mirrors the layout, asked once.
- Messages: at most 4 KB, at most 40 a second per device. Send positions at 10 to 20 a second, not on every move.

## Motion and camera (lamba.json "permissions": ["motion"] or ["camera"], phone pages only)

```js
var steer = Lamba.stream("steer", 20, "tv");               // a rate-limited sender: the latest wins, 1 to 30 a second; straight to the TV over the Wi-Fi when it can, else the room
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
picture. The TV page gets small messages, never frames. In the simulator both sensors are made up (the Phone sensors panel),
and `lamba-test.mjs` runs them. See docs "Motion and camera" and the example `move-and-pop`.

## Guests and seats (lamba.json)

```json
"players": { "min": 2, "max": 2 }, "guests": true, "screens": { "tv": "tv.html", "phone": "phone.html" }
```

`L.players` on the screen lists the seated guests in the order they came (`[{ id: "v0", name: "Sam" }]`); more wait
in line. The screen answers one guest with `L.send(msg, id)`, all with `L.send(msg, "guests")`.

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
- A change waits on the owner's phone until they tap "Send to screen" (the copy of the screen shows it at once). Only who may
  join, for how long and the sound go at once (`"apply": "now"`, as `vol` above), never the look.
- A choice for nothing is `{ "id": "none", "name": "None" }`, with no picture: the host draws its "no" sign.
- The host adds "Try as a guest" (apps guests join), "Scribble" and "Effects" to the drawer. Don't build them, and
  don't take their group keys (`guest`, `scribble`, `effects`).

## Saved data

`L.store` (Screen and the owner's phones): keys of letters, digits, `_` and `-`; 4 KB a value; 16 KB and 32 keys in
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
