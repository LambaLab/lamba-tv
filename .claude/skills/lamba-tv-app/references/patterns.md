# Patterns for a Lamba app

Copy these shapes. Every call is in `lamba.d.ts` and at https://lamba.tv/devs/docs/sdk/.

## The TV page (tv.html): ES5, the authority

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
    var isTv = L.screen.view === "screen";          // the real TV: only it decides, saves and plays sound
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
    L.store.on(function (k, v) { if (k === "state" && v) { state = v; draw(); } });   // the copy follows the TV
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
    if (L.screen.view === "controller" && !L.status.onScreen) { L.show(); return; }   // the owner: put the app on the TV first
    L.send({ type: "answer" });
  };
  L.on("scored", function (m) { document.getElementById("note").textContent = "Your score: " + m.you; });
  L.drawn();
});
</script>
</body>
</html>
```

- View `controller` is the owner's phone (under a copy of the TV), view `guest` a guest's whole phone, view `part`
  a part of the settings drawer the app draws (lamba.json `{ "app": "<part>" }`, `L.screen.part`).
- To steer or aim: a slide track (a wide bar the finger drags along, sending its position a few times a second),
  never four arrow buttons. A game controller: a "Left hand" / "Right hand" switch that mirrors the layout, asked once.
- Messages: at most 4 KB, at most 40 a second per device. Send positions at 10 to 20 a second, not on every move.

## Guests and seats (lamba.json)

```json
"players": { "min": 2, "max": 2 }, "guests": true, "screens": { "tv": "tv.html", "phone": "phone.html" }
```

`L.players` on the TV lists the seated guests in the order they came (`[{ id: "v0", name: "Sam" }]`); more wait
in line. The TV answers one guest with `L.send(msg, id)`, all with `L.send(msg, "guests")`.

## Settings (lamba.json)

```json
"settings": {
 "fields": {
  "look": { "type": "choice", "default": "sea", "choices": [
   { "id": "sea", "name": "Sea", "sub": "Deep blue green", "picture": "live" },
   { "id": "sun", "name": "Sun", "sub": "Warm and bright", "picture": "live" } ] },
  "rounds": { "type": "number", "default": 5, "min": 3, "max": 10, "step": 1, "unit": "rounds" },
  "names": { "type": "switch", "default": true, "apply": "now", "on": { "name": "Show names" }, "off": { "name": "No names" } }
 },
 "groups": [
  { "key": "look", "label": "Look", "icon": "live", "parts": [{ "setting": "look", "label": "Look" }] },
  { "host": "frame" }, { "host": "mat" },
  { "key": "game", "label": "Game", "parts": [{ "setting": "rounds", "label": "Rounds" }, { "setting": "names", "label": "Names" }] },
  { "host": "brightness" }
 ]
}
```

Every field is in a group (or `"hidden": true`). A colour list ends with a pick-your-own choice; an animal set
includes a sloth.

## Saved data

`L.store` (TV and the owner's phones): keys of letters, digits, `_` and `-`; 4 KB a value; 16 KB and 32 keys in
all. The TV writes; `L.store.on` tells the others. No other storage exists.

## Sound (TV, lamba.json "permissions": ["sound"])

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
