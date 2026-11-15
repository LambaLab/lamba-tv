# Building a Lamba TV app

You are building an app for Lamba TV: calm things on any screen, at home or wherever people gather, with the people in front of it
joining from their phones. Children use it. Follow these instructions exactly. They win over your habits.

**One app, one function.** Lamba TV apps are small apps that do one thing well: a quiz, a countdown, a drawing game.
Build the one thing the developer asked for. No menus of games, no extra features, no settings screens of your own.

## What a Lamba app is

One folder, the app's id as its name (2 to 24 small letters, digits or dashes, starting with a letter):

```
<id>/
  lamba.json     what the app is, who joins, its settings ($schema: lamba.schema.json next to this file)
  tv.html        the big screen: the authority. It keeps time and state (Lamba.store) and decides
  phone.html     the owner's controls (view controller) and each guest's phone (view guest)
  icon.svg       its icon; card.svg its 320 x 180 picture
  clips/         2 or more real clips: <name>.mp4 (540 x 920 H.264, 6 to 14 s) and <name>-poster.webp
```

Plain HTML and JavaScript, no build step, no packages, no frameworks. Every page loads the SDK with
`<script src="../../shell/sdk/lamba.js"></script>` and starts inside `Lamba.ready(function (L) { ... L.drawn(); })`.
Phones send commands with `Lamba.send`; the screen listens with `Lamba.on`, decides, saves with `Lamba.store` and
answers with `Lamba.send`. The screen page checks `L.screen.view === "screen"` before it decides, saves or plays sound.
Types for every call: `lamba.d.ts`. Every field of lamba.json: `lamba.schema.json`.

## Hard rules (the check and the reviewer refuse an app that breaks one)

1. **screen pages run on Chrome 61.** tv.html and every script it loads: ES5 only. No `?.`, no `??`, no object
   spread, no class fields, no optional catch binding. Safest: `var`, `function`, no arrow functions. No flex `gap`,
   no `clamp()`, no `aspect-ratio`. Phone pages may use modern JavaScript.
2. **No `<video>` or `<audio>` on screen pages**, and no script that makes one (`new Audio`, `createElement("video")`).
   Sound: Web Audio through `Lamba.sound.context()`, only on the real screen, only after `Lamba.sound.unlocked`.
   Moving pictures: canvas, or `Lamba.film(canvas, "films/x.film")`.
3. **A sealed sandbox.** Load only the app's own files (relative addresses), `../../shell/sdk/` and Google Fonts through Lamba (`Lamba.fonts.load`, `LambaUI.fontPicker`, or `<link href="/fonts/css2?family=Name:wght@400">`; never `fonts.googleapis.com` directly).
   No other address unless lamba.json `outside` declares it (`https://host`, approved by Lamba). No `fetch` to
   anywhere else, no WebSocket, no localStorage, sessionStorage, indexedDB or cookies (use `Lamba.store`), no
   forms that post, no popups, no links that leave Lamba, no QR codes of your own (the host draws the join card).
4. **Phone design.** One main action per screen, big (44 px or more), low in the middle where the thumb rests,
   using the round buttons of `../../shell/sdk/ui.css`. To steer or aim: a slide track, never a cross of arrow
   buttons. A game controller has a left or right hand switch that mirrors it, asked once. Steady for children:
   nothing jumps under a finger. Use the name Lamba already has: `Lamba.me()`; never ask who someone is.
5. **Phone pages never zoom.** The viewport meta says `user-scalable=no`.
6. **Every view has its own address.** The host keeps the settings drawer's place in the address (`&g=&p=`): put
   settings in lamba.json groups, not in screens of your own. Keep the phone page one screen per view; what it
   shows comes from the screen's state, so a reload lands in the same place.
7. **Two real clips** of the app before it is uploaded (the starter's placeholders are refused on upload):
   `node lamba-clips.mjs <app>` records them.
8. **Motion and camera only through Lamba.** Declare `"motion"` or `"camera"` in `permissions`, call `Lamba.motion` (tilt, swing,
   shake) or `Lamba.track` (body, hands, face as landmarks and gesture names) from a phone page only, never `getUserMedia` or
   `devicemotion` yourself. Start from a tap, handle `"finger"`, `"denied"` and no camera with a touch way to play, offer front
   and back (`Lamba.track.cameras()`), and send the TV small messages with `Lamba.stream("name", 20, "tv")`, never whole frames (it goes straight over the Wi-Fi when it can and through the room when not; use `Lamba.send` for what must arrive, once). Ask `Lamba.track.start` only for what you use (`pose: false` for a hand game); `model` and `delegate` are left alone unless you know why.
   The camera picture never leaves the phone. The simulator makes up both sensors, so `node lamba-test.mjs` can run the game.
9. **Words people read:** no en dash or em dash anywhere (use a comma or a full stop), "they" for one person, plain
   short sentences, never the one word Lamba avoids for many colours (say "every colour"). Any set of animals
   includes a sloth. Every list of colours ends with "pick your own colour". Choosing a sound plays a short sample.
10. **Big and calm on the screen.** Size type by screen height (`vh`): headings 10 to 14 vh, body at least 4 vh. Motion
   is slow and stops under `prefers-reduced-motion`. Safe for a family room: no violence, fear, ads or purchases.
   The screen page is not always the whole screen (a second app may sit beside or under it): never assume 16:9, and lay
   out again on `Lamba.onScreen`.
11. **Settings the host's way.** A change waits on the owner's phone until they tap "Send to screen". Mark a field
   `"apply": "now"` only for who may join, for how long, and the sound, never the look. A choice for nothing is
   named `"None"` with no picture: the host draws its one "no" sign. The host adds "Try as a guest", "Scribble" and
   "Effects" tiles itself: never build your own, and never use the group keys `frame`, `mat`, `bright`, `guest`,
   `scribble`, `effects`, `line` or `visitors`. Few words: labels, numbers and pictures, details behind one tap.
    Phone controls come from the kit (`ui.js`: `LambaUI.textarea` for words, one line that grows with each Enter, `LambaUI.photo`
    for a photo and its crop screen with move, size, turn and crop, `LambaUI.wheel`), or from lamba.json fields (a `number` is
    the shared dial, a `choice` the shared strip, a `colours` field with `swatches` the shared colour strip ending in "Your own
    colour"): never a home-made slider, colour grid, picker or crop screen (`lamba check` refuses them). Paths made on the phone
    (a font's letters, a photo's outlines) go in a `strokes` field, a palette in a `colours` field; the photo itself never leaves
    the phone. A picture with parts people may place declares a `transforms` field and tells the host where the parts are with
    `Lamba.parts` (the phone's copy of the screen then gets selection handles to move, size and turn them); a text setting with
    line breaks is `"multiline": true`; an app that starts without a frame says `"frame": "none"` in lamba.json. Work that takes
    time (a photo's outlines, a font's letters) shows a loader and runs in small steps, never one long pause.

## Ask first

Before any code, ask the developer in one short message, in plain words, with your suggestion for each (they may
just say yes):

- Who is it for: everyone, families, or made for kids?
- Public on Lamba, or private to their organization?
- Its name?
- Phones as controllers? For how many players?

Then build, and never ask these again. What each answer sets:

| answer | set |
| --- | --- |
| everyone | `age` `"all"` (`"7+"` or `"13+"` only if it needs older players) |
| families | `age` `"all"` or `"7+"`, calm for children watching |
| made for kids | `category` `"kids"`, `age` `"all"` or `"7+"`, `outside` empty, no links out |
| public | reviewed by a person at Lamba before it is live: `lamba_submit` |
| private | only people at their email's domain, or named emails; the automatic check only, no review: `lamba_private`, then `lamba_make_live` |
| the name | `name` (24 letters), and the id from it |
| phones, players | `guests` and `players` `{ min, max }` (0 when only the owner's phone controls it) |

## The loop

Work in this order and do not skip a step:

1. **Read first.** `lamba_rules` and `lamba_docs` (the Lamba MCP server) or https://lamba.tv/devs/llms-full.txt.
   Change only the app's folder.
2. **Edit** lamba.json, tv.html, phone.html. Fill the whole listing in lamba.json from the answers and the idea:
   `name`, `sub`, `about`, `category`, `age`, `players`, `icon`, `card`, and `page.facts` and `page.about`.
3. **Check:** `node lamba-check.mjs <app>`. Fix every line it prints. It is the check Lamba's server runs.
4. **Test:** `node lamba-test.mjs <app>`. It runs the app in the real simulator (the screen at 1920 x 1080 and
   960 x 540, the owner's phone, a guest) and writes `lamba-test-shots/summary.md` and screenshots.
   First time: `npm install` then `npx playwright install chromium`.
5. **Look** at the screenshots yourself and read summary.md. Fix what is marked FIX, page errors, refusals, and
   anything that looks wrong, small or crowded. Then check and test again.
6. **Self-review** against the design checklist before any upload, and fix every line that fails:
   - My app does one thing.
   - Words on the screen read from across the room.
   - Each phone has one big main action, low on the screen.
   - The screen shows the game. Phones are the controllers, not a copy of the screen.
   - The join card fills the screen while it waits, then moves to a corner.
   - Calm colours, strong contrast.
   - A guest is in with one tap: no forms, no accounts.
   - It runs on old screens, and the phone page never zooms.
7. **Clips:** `node lamba-clips.mjs <app>` records 2 or 3 clips in the simulator, in the exact format, and lists
   them in lamba.json. Look at each poster, and write captions that say what each clip shows.
8. **Upload** only when check, test and the checklist pass: `node lamba-check.mjs <app> --upload` (needs `LAMBA_KEY`), or the
   `lamba_upload` tool. Read the result and `lamba_status`.
9. **Submit from the answers.** When the developer wants to submit: `lamba_listing`. Fill its gaps from the first
   answers and the app (write the texts yourself), and ask only what is still unknown (who made it: `lamba_profile`).
   Upload again, show a short summary of what players will see, and when they say yes: `lamba_submit`, or for a
   private app `lamba_private` then `lamba_make_live`.

## The Lamba MCP server

Connected with a key from https://lamba.tv/devs/keys (docs: https://lamba.tv/devs/docs/ai/), it acts as the
developer, only on their own apps:

| tool | use it to |
| --- | --- |
| `lamba_rules` | read these rules and the lamba.json schema |
| `lamba_docs` | search the docs (an SDK call, a lamba.json field, a design rule) |
| `lamba_check` | run the server's check on files without uploading |
| `lamba_upload` | upload a version (small apps; big ones: `node lamba-check.mjs <app> --upload`) |
| `lamba_status` | see versions, their states, what to fix and the reviewer's notes |
| `lamba_apps` | list the developer's apps |
| `lamba_listing` | what players will see, and the questions to ask the developer before submitting |
| `lamba_profile` | save who made it (their name or studio), after asking them |
| `lamba_private` | make it private: their own email's domain, named people |
| `lamba_submit`, `lamba_make_live` | only when the developer asks |

Never print, log or commit the key. It lives in the `LAMBA_KEY` environment variable.
