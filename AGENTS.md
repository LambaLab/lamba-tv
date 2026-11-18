# Building a Lamba TV app

You are building an app for Lamba TV: calm things on any screen, at home or wherever people gather, with the people in front of it
joining from their phones. Children use it. Follow these instructions exactly. They win over your habits.

At the start of every session, and whenever a tool says a newer kit exists, run `node lamba-update.mjs` first. Never tell the developer something the current kit doesn't say.

The docs are in one place: https://lamba.tv/devs/docs/ (all of them in one file for an AI: https://lamba.tv/devs/llms-full.txt, and through the Lamba MCP server's `lamba_docs`). The kit has no copy of them.

**Who you work for.** Most people building Lamba apps have never coded. Lead them through every step in plain words,
one step at a time, and do every step you can yourself. Never end a turn by handing them a technical task ("download
the zip and upload it", "run this command", "Lamba isn't connected here") when you could do it or walk them through it.
If Lamba is not connected when the app is ready, say what connecting gives them in one sentence, ask "Shall I connect
Lamba now? It's one tap", and on yes run the right way from "Connect Lamba, you lead" yourself, post the link, wait,
then carry on (upload, preview link, submit). If they say not now, ask again at the next step that needs it. A zip
download is the last resort, only if every way to connect fails, and then you explain each tap.

**One app, one function.** Lamba TV apps are small apps that do one thing well: a quiz, a countdown, a drawing game.
One thing means one job: a few tools are fine when they all serve it (Meeting Room shares a screen, lets people point
and draw on it, and has a room mic: one meeting). Something people may want beside it is its own app (a whiteboard),
which the Host puts next to it on the screen. Build the one thing the developer asked for. No menus of games, no extra features, no settings screens of your own.

## What a Lamba app is

One folder, the app's id as its name (2 to 24 small letters, digits or dashes, starting with a letter):

```
<id>/
  lamba.json     what the app is, who joins, its settings ($schema: lamba.schema.json next to this file)
  tv.html        the big screen: the authority. It keeps time and state (Lamba.store) and decides
  phone.html     each Player's remote (view guest, the whole phone) and any settings parts you draw (view part)
  icon.svg       its icon; card.svg its 320 x 180 picture
  clips/         2 or more real clips: <name>.mp4 (540 x 920 H.264, 6 to 14 s) and <name>-poster.webp
```

Plain HTML and JavaScript, no build step, no packages, no frameworks. Every page loads the SDK with
`<script src="../../shell/sdk/lamba.js"></script>` and starts inside `Lamba.ready(function (L) { ... L.drawn(); })`.
Phones send commands with `Lamba.send`; the screen listens with `Lamba.on`, decides, saves with `Lamba.store` (at most 32 keys,
4 KB a value, 16 KB in all) and answers with `Lamba.send`. The screen page checks `L.screen.view === "screen"` before it decides, saves or plays sound.
Types for every call: `lamba.d.ts`. Every field of lamba.json: `lamba.schema.json`.

## Hard rules (the check and the reviewer refuse an app that breaks one)

1. **screen pages run on Chrome 61.** tv.html and every script it loads: ES5 only. No `?.`, no `??`, no object
   spread, no class fields, no optional catch binding. Safest: `var`, `function`, no arrow functions. No flex `gap`,
   no `clamp()`, no `aspect-ratio`. Phone pages may use modern JavaScript.
2. **No `<video>` or `<audio>` on screen pages**, and no script that makes one (`new Audio`, `createElement("video")`).
   Sound: Web Audio through `Lamba.sound.context()`, only on the real screen, only after `Lamba.sound.unlocked`.
   Music: `"music": true` in lamba.json; Lamba plays its own library under your sound and gives the Host the tile. `Lamba.music` and `Lamba.onMusic(fn)` say what plays. No music files of your own.
   Moving pictures: canvas, or `Lamba.film(canvas, "films/x.film")`.
3. **A sealed sandbox.** Load only the app's own files (relative addresses), `../../shell/sdk/` and Google Fonts through Lamba (`Lamba.fonts.load`, `LambaUI.fontPicker`, or `<link href="/fonts/css2?family=Name:wght@400">`; never `fonts.googleapis.com` directly).
   No other address unless lamba.json `outside` declares it (`https://host`, approved by Lamba). No `fetch` to
   anywhere else, no WebSocket, no localStorage, sessionStorage, indexedDB or cookies (use `Lamba.store`), no
   forms that post, no popups, no links that leave Lamba, no QR codes of your own (the host draws the join card).
4. **A real player remote.** Every app Players join (`guests`, or `players.max` above 0) has one: phone.html in view
   `guest`, the whole phone, a full screen, high quality, realistic remote that feels like a real physical remote or
   controller made for this app. Build it from the kit: `.l-remote` (the body, in the app's own colours), `.l-well` and
   `.l-key.l-big` for the one main action, `.l-keys` for at most three smaller keys, `LambaUI.press` on every key (it goes
   down under the finger with a tap of the phone). Big, clear, well spaced, low in the middle where the thumb rests,
   works one handed, never scrolls (`lamba-test` screenshots it at 390 x 844 and checks). To steer or aim: a slide track,
   never a cross of arrow buttons. A game controller has a left or right hand switch that mirrors it, asked once. Steady
   for children: nothing jumps under a finger. Lamba's own join steps come first (the code, their name when askName is true, the line): never
   repeat them, never ask for a name yourself. Ask for names only if the app shows them (`"askName": true` in lamba.json, then read `Lamba.me().name`). Onboarding for Players, if any, is short and realistic: real
   pictures of the app or the real screen, with plain words; never gimmick illustrations, clip art or emoji (`lamba check`
   refuses emoji in the pages and lamba.json, and an app Players join with no view `guest`).
   The remote is full screen and visual: pictures for choices (mark the groups Players may change with "players": true in lamba.json, and Lamba shows them the Host's picture tiles), and a visible sound control when the app has sound (add "forPlayers": ["sound"] to lamba.json for Lamba's own Sound tile; also "brightness", "frame", "effects" (cracks, lines, flies: never a scare) and "schedule" (Players only see it, the Host alone changes it), each off until the Host switches it on). For background music, never ship your own files: add "music": true to lamba.json (and "music" to forPlayers to share it) and Lamba plays its own library on the screen, with a Music tile for the Host. No decorative status text or stray icons at the top, no hidden hold to act gestures (a visible key held on purpose is fine: `LambaUI.hold`, with beats the screen lets expire; the example `fireside`), and options big enough for a thumb (44 px or more). Many people sending a little (an ambient app: fan a fire, cheer) are an audience, `"visitors"` in lamba.json, not 50 game seats: SDK reference, "Game seats or an audience", for the real limits. Details: docs UI (A Player's remote) and lamba.json (Settings for Players).
5. **Phone pages use Lamba's controls.** Build settings in lamba.json, never in phone.html (https://lamba.tv/devs/docs/ui/#phone-pages-use-lamba-s-controls). No Send, Undo or Reset of your own, no sound, mute or music control (`forPlayers`), no − and + steppers, sliders or number boxes (a number setting: Lamba shows its dial), no title, profile or status at the top, no tabs, no grid of cards. `lamba check` refuses the first three and warns about the rest.
   Phone pages never zoom: the viewport meta says `user-scalable=no`.
6. **Every view has its own address.** The host keeps the settings drawer's place in the address (`&g=&p=`): put
   settings in lamba.json groups, not in screens of your own. Keep the phone page one screen per view; what it
   shows comes from the screen's state, so a reload lands in the same place.
7. **Two real clips** of the app before it is uploaded (the starter's placeholders are refused on upload):
   `node lamba-clips.mjs <app>` records them.
8. **Motion and camera only through Lamba.** Declare `"motion"` or `"camera"` in `permissions`, call `Lamba.motion` (tilt, swing,
   shake) or `Lamba.track` (body, hands, face as landmarks and gesture names) from a phone page only, never `getUserMedia` or
   `devicemotion` yourself. Start from a tap, handle `"finger"`, `"denied"` and no camera with a touch way to play, offer front
   and back (`Lamba.track.cameras()`), and send the screen small messages with `Lamba.stream("name", 20, "tv")`, never whole frames (it goes straight over the Wi-Fi when it can and through the room when not; use `Lamba.send` for what must arrive, once). Ask `Lamba.track.start` only for what you use (`pose: false` for a hand game); `model` and `delegate` are left alone unless you know why.
   The camera picture never leaves the phone. The simulator makes up both sensors, so `node lamba-test.mjs` can run the game.
   **The microphone only through Lamba, too.** Declare `"microphone"`. On a phone page: `Lamba.mic.level(fn)` (a loudness 0 to 1 and a
   blow), `Lamba.mic.words({ onText, onFinal })` (speech to text; check `Lamba.mic.canWords`), `Lamba.mic.record({ max })` (Lamba's own
   sheet, resolves `{ id }` once sent). On the screen page: `Lamba.voice.on("message")` and `Lamba.voice.play(id)`, and
   `Lamba.voice.live({ talkers: 1 })` for live voice (Lamba draws the hold to talk on the phones; never draw one). Never `getUserMedia`,
   `SpeechRecognition` or `MediaRecorder` yourself. Start from a tap, `stop()` when done, handle `"denied"`, `"host"` and `"none"` with
   another way to play, say on the app's page what it listens for, and keep a kids app working with live voice off.
9. **Words people read:** no en dash or em dash anywhere (use a comma or a full stop), "they" for one person, plain
   short sentences, never the one word Lamba avoids for many colours (say "every colour"). Any set of animals
   includes a sloth. Every list of colours ends with "pick your own colour". Choosing a sound in your own app part (phone.html) plays a short sample.
10. **Big and calm on the screen.** Size type by screen height (`vh`): headings 10 to 14 vh, body at least 4 vh. Motion
   is slow and stops under `prefers-reduced-motion`. Safe for a family room: no violence, fear, ads or purchases.
   The screen page is not always the whole screen (a second app may sit beside or under it): never assume 16:9, and lay
   out again on `Lamba.onScreen`. A screen is always landscape: on a phone held upright Lamba turns the whole screen
   sideways, so your screen page always gets a landscape size.
11. **Settings the host's way.** A change waits on the Host's phone until they tap "Send to screen". Mark a field
   `"apply": "now"` only for who may join, for how long, and the sound, never the look. A choice for nothing is
   named `"None"` with no picture: the host draws its one "no" sign. The host adds "Try as a player", "Scribble" and
   "Effects" tiles itself: never build your own, and never use the group keys `frame`, `mat`, `bright`, `guest`,
   `scribble`, `effects`, `line` or `visitors`. Few words: labels, numbers and pictures, details behind one tap.
   **A tile says what is chosen** (the host never shows an empty one): give the choices pictures and the tile shows the
   CHOSEN one; a number shows its value ("100%"), a switch or a position a small diagram. Leave `icon` out of such a group
   (`lamba check` warns when one is forced over pictured choices). A line icon (`"icon": {"icon": "pictures/fire.svg"}`,
   24 x 24, one stroke colour, `currentColor`) is only for a group with nothing better; `lamba check` refuses a group with neither.
   **The Host's phone is the live screen on top and ONE horizontal swiping row of tiles, nothing in between.** Every
   setting is a field of lamba.json, and every one tap thing the Host does (Feed, Tend the fire, New game) is an
   action in lamba.json: `"actions": [{ "key": "tend", "label": "Tend the fire", "icon": "pictures/tend.svg" }]` (1 to 4,
   a one colour SVG each). The host shows them first in the row (or where a group `{ "action": "tend" }` puts them), a
   tap sends `{ type: "action", key }` to the screen page: `L.on("action", function (m) { if (m.key === "tend") ... })`
   (the copy on the Host's phone hears it too, at once). The screen page may change what a tile says with
   `L.action("go", { label: "Pause", icon: "pictures/pause.svg" })`. There is no controller view: phone.html never has
   a view for the Host, and `lamba check` refuses one (or any control marked for the Host).
    Phone controls come from the kit (`ui.js`: `LambaUI.textarea` for words, one line that grows with each Enter, `LambaUI.photo`
    for a photo and its crop screen with move, size, turn and crop, `LambaUI.wheel`), or from lamba.json fields (a `number` is
    the shared dial, a `choice` the shared strip, a `colours` field with `swatches` the shared colour strip ending in "Your own
    colour"): never a home-made slider, colour grid, picker or crop screen (`lamba check` refuses sliders and colour grids, the reviewer refuses the rest). Paths made on the phone
    (a font's letters, a photo's outlines) go in a `strokes` field, a palette in a `colours` field; the photo itself never leaves
    the phone. A photo that is a picture in your app (a frame on a wall, a poster) is a `photo` field, `{ "type": "photo", "aspect": "4:3" }`
    in a group part (`"players": true` for Players too), or several side by side in one part (`{ "label": "Photos", "photos": [{ "setting": "left", "label": "Left" }, ...] }`): Lamba shows the picker and the crop; your app just draws the URL in `Lamba.settings`
    and an empty frame while it is `""`. Never build your own `<input type=file accept=image>` for it. A picture with parts people may place declares a `transforms` field and tells the host where the parts are with
    `Lamba.parts` (the phone's copy of the screen then gets selection handles to move, size and turn them); `"multiline": true`
    keeps the line breaks that your own app part sends with `LambaUI.textarea`; the drawer's own field is one line; every app starts without a frame (the Host can add one); `"frame": "lamba"` in lamba.json starts it in Lamba's slim frame. Work that takes
    time (a photo's outlines, a font's letters) shows a loader and runs in small steps, never one long pause.

## Paid apps (lamba.tv/devs/docs/monetize/)

Only when the developer asks for money. Lamba sells for every app; you never take a payment.

- Declare it in lamba.json: `"price"` (buy once), or `"subscription": { "monthly", "yearly", "trialDays" }`, plus any
  `"products"` (unlocks: `{ "id", "name", "price", "description", "trialDays"? }`). Prices are US cents from Lamba's tiers
  only (`lamba_rules` lists them). A paid app also says `"preview": { "mode": "free" | "time" | "locked" }`.
- Read what the home owns on every page: `Lamba.owns(id)`, `Lamba.purchases`, `Lamba.onPurchases(fn)`. Redraw when it changes.
- Buy only from the Host's phone page: `Lamba.buy(id)` opens Lamba's sheet (price and what you get before the tap). Never on
  the screen page, never for a Player, never in a kids app's Player view. Lamba's own "Unlock" or "Extras" tile also sells it.
- Never: Stripe, PayPal, Apple Pay or PaymentRequest code, card fields, links to payment or tip pages, prices drawn by the
  app, fake countdowns, "only N left", nagging. `lamba check` refuses payment code; review refuses dark patterns.
- What was bought keeps working on every screen of the home. Never lock away something the Host already had for free.

## You cannot change the platform

You build one app folder. You never write, suggest or ask for a patch to the SDK, the shell, Lamba's hosts, the simulator,
`lamba-check.mjs`, `shell/sdk` or any file Lamba owns, and you never tell the developer that "an SDK patch" must be
integrated. Lamba's files are read only for you. When the kit lacks something:

1. Check again first: `lamba_docs` and `lamba_rules` (the manifest, the photo slots, the group parts, the sheet) cover more than they seem to.
   Several slots of one kind usually live in ONE group as parts (a pill in the drawer), not as several groups.
2. If it really is missing, tell the developer plainly, in one short message: what is missing, what you did instead (the
   closest supported way, still inside the rules), and what is lost by it.
3. Offer to file it with Lamba, in three short fields: what the app needs, what the kit does today, how you work around it.
   When the developer says yes, call `lamba_request` (or, without the Lamba connection, send them to the Request a feature
   page at lamba.tv/devs/requests/new). Lamba's team is emailed, and the answer shows on that page. Never ask the developer to
   send it to a contact, and never open an issue or pull request on Lamba's repository for it.
4. Carry on with the supported way. Never work around a rule with a hack of your own.

## Ask first

Before any code, ask the developer in one short message, in plain words, with your suggestion for each (they may
just say yes):

- Who is it for: everyone, families, or made for kids?
- Public on Lamba, or private to their organization?
- Its name?
- Do Players join from their phones? How many?
- Sound and pictures that move? Say what Lamba can do and suggest what fits the idea (or none):
  - **sounds**: the app's own sound files on the screen (taps, wins, a countdown's last seconds, music in the background);
  - **films**: short looping videos on the screen (a fire, the sea), as Lamba's `.film` files;
  - **live video**: a phone's camera or a computer's screen shown live on the screen, with its sound;
  - **live voice**: hold to talk from a phone, heard on the screen, with captions;
  - **pointers and drawing**: a laser pointer from each phone (aim the phone at the screen, hold to draw) over the screen (a shared screen
    to mark up, a map, a plan), drawn by Lamba.
- Laptops too? People may join from a laptop as well as a phone (the screen's copy beside their controls), and use both as one person.

Then build, and never ask these again. What each answer sets:

| answer | set |
| --- | --- |
| everyone | `age` `"all"` (`"7+"` or `"13+"` only if it needs older players) |
| families | `age` `"all"` or `"7+"`, calm for children watching |
| made for kids | `category` `"kids"`, `age` `"all"` or `"7+"`, `outside` empty, no links out |
| public | reviewed by a person at Lamba before it is live: `lamba_submit` |
| private | only people at their email's domain, or named emails; the automatic check only, no review: `lamba_private`, then `lamba_make_live` |
| the name | `name` (24 letters), and the id from it |
| phones, players | `guests` and `players` `{ min, max }` (0 when only the Host's phone controls it) |
| sounds | `"sound"` in `permissions` and the sound files in the app's folder (see Sound in SDK.md); none: leave it out |
| films | `"sound"` only if they have sound; the films made with `lamba-film.mjs` (see FILMS.md) |
| live video | `"video"` in `permissions`, `Lamba.video.live(...)` (see Live video in SENSORS.md) |
| live voice | `"microphone"` in `permissions`, `Lamba.voice.live(...)` (see SENSORS.md) |
| pointers and drawing | `"ink"` in `permissions`, `Lamba.ink.live(...)` on the screen page (see Ink and pointers in SENSORS.md); Lamba draws the pad and the layer |
| laptops, two devices | nothing to declare: `Lamba.device` ("phone" or "computer"), `Lamba.screen.mirror` (the screen's copy beside the page), `Lamba.players[].person/devices/kinds`, `Lamba.onDevice` | (see SDK.md "A computer as a Player") |

12. **Art fills the screen.** An ambient art app (a fireplace, an aquarium, scenery, a picture, a clock that is a picture)
    fills the whole screen edge to edge by default: the screen is the art, with no panel on a wall inside it. Lamba
    draws no frame unless the Host adds one; cover the page (scale by the larger of width and height, crop what overflows, never
    letterbox), and keep words and anything to read inside a 5% safe margin. A framed or fit choice may be a setting, with
    fill as its default. A part with its own shape (a mantel, a frame, a lamp, a clock face) keeps its proportions: size it
    from the page and never stretch it, while the scene fills. Verify the real content bounds, not the idea of them: the
    canvas or film rectangle against the page's size at 1920 x 1080, 960 x 540 and a small page (a quarter of the width or
    height): no empty strip on any side. The pattern is in `references/patterns.md` ("Art that fills the screen") and the
    reasons in https://lamba.tv/devs/docs/design/#art-fills-the-screen.

## The loop

Work in this order and do not skip a step:

1. **Read first.** `lamba_rules` and `lamba_docs` (the Lamba MCP server) or https://lamba.tv/devs/llms-full.txt.
   Change only the app's folder.
2. **Edit** lamba.json, tv.html, phone.html. Fill the whole listing in lamba.json from the answers and the idea:
   `name`, `sub`, `about`, `category`, `age`, `players`, `icon`, `card`, and `page.facts` and `page.about`.
3. **Check:** `node lamba-check.mjs <app>`. Fix every line it prints. It is the check Lamba's server runs.
4. **Test:** `node lamba-test.mjs <app>`. It runs the app in the real simulator (the screen at 1920 x 1080 and
   960 x 540, the Host's phone with its tiles, a Player's remote) and ends with a three-column summary (what was tested, the result, what to fix) in `lamba-test-shots/summary.md`, with screenshots. Its table "What was and was not exercised" says, per setting, which values reached the screen page (delivered) apart from which changed its picture (rendered): tell the developer what was not exercised. A "Kit defects (not your app)" section is never yours to fix: never patch the kit for it.
   To drive the simulator from your own test: `window.LambaSim` (docs: Testing your app), never the page's elements: `controlsReady`,
   `open(group, part)`, `sheet(open)`, `phone(which)`, `screen.size(w, h)`. For real phone sizes (WebKit, iPhone upright and sideways,
   the sheet up and down, 44 px targets, equal keys, nothing moving under a finger): copy the skill's `templates/phone-viewports.test.mjs`
   next to `lamba-test.mjs` and run `node phone-viewports.test.mjs <app>`.
   First time: `npm install` then `npx playwright install chromium`.
   Before submitting: `node lamba-test.mjs <app> --perf`, the measured review Lamba runs on every submitted version (an old screen
   for a minute: loops that never stop, styles or a CSS filter written every frame, timers that redraw the scene, the film, sound,
   the Player's remote). Fix every FIX in its Performance part; `perf-prompt.txt` lists each finding with its place and fix.
   To play it: the preview link ("Play it" below). On a machine with a browser, `node lamba-test.mjs <app> --serve` also works.
5. **Look** at the screenshots yourself and read summary.md. Fix what is marked FIX, page errors, refusals, and
   anything that looks wrong, small or crowded. Then check and test again.
6. **Self-review** against the design checklist before any upload, and fix every line that fails:
   - My app does one thing.
   - Words on the screen read from across the room.
   - Each Player's remote has one big main action, low on the screen.
   - The screen shows the game. Phones are the controls, not a copy of the screen.
   - The Host's phone is the live screen and one row of tiles (settings and actions), nothing in between.
   - Players get a full screen, realistic remote that never scrolls; no clip art, no emoji, no name step of its own.
   - The join card fills the screen while it waits, then moves to a corner (an ambient app: Lamba keeps it small in a corner,
     then the code alone; ask for "full" and "corner" as usual).
   - Calm colours, strong contrast.
   - A Player is in with one tap: no forms, no accounts.
   - It runs on old screens, and the phone page never zooms.
7. **Clips:** `node lamba-clips.mjs <app>` records 2 or 3 clips in the simulator, in the exact format, and lists
   them in lamba.json. Look at each poster, and write captions that say what each clip shows.
   **Assets, then look at them yourself** (https://lamba.tv/devs/docs/assets/): `icon.svg` (a square SVG, the drawing inside the
   middle 9 to 51 of 60, the rounded corners cut the rest), `card.svg` (exactly 320 x 180, anything that matters 12 units
   in from the edges), and the 2 or 3 clips with their `-poster.webp` (540 x 920, H.264, 6 to 14 s, captions of at most 60
   characters). Lamba makes the link preview picture itself, and the app page shows clips, not screenshots: make nothing
   else, and never add a manifest field for a picture. Templates: `.claude/skills/lamba-tv-app/templates/`. Open the icon
   and card (render them), look at every poster, and say what you checked.
   **Films:** a looping scene is made with `node lamba-film.mjs <video> --name <name> --out <app>/films` (the 1080 film, its
   720 and 360 copies, a still): https://lamba.tv/devs/docs/films/. `node lamba-check.mjs` says exactly what is missing.
   Switch recordings with `film.load(url)` (each starts fresh at the best quality). Art that needs HD sets
   `{ minQuality: 720 }`: it starts at 720 or more, and goes lower only on a screen measured too slow for it (a smooth
   lighter copy beats a jerky HD one). Keep the 720 and 360 copies and the pictures anyway. Never change a CSS `filter` on the
   film canvas every frame, and run spark loops only while something moves. Never patch shell/film.js or the SDK.
8. **Upload** only when check, test and the checklist pass: `node lamba-check.mjs <app> --upload` (needs the connection: "Connect Lamba" below), or the
   `lamba_upload` tool. Read the result and `lamba_status`.
9. **Submit from the answers.** When the developer wants to submit: `lamba_listing`. Fill its gaps from the first
   answers and the app (write the texts yourself), and ask only what is still unknown (who made it: `lamba_profile`).
   Upload again, show a short summary of what players will see, and when they say yes: `lamba_submit`, or for a
   private app `lamba_private` then `lamba_make_live`.
   The name can also change on lamba.tv/devs (Rename on the app's page), and that name wins. `lamba_listing` and
   `lamba_status` give the current name: keep lamba.json `name` the same, and change it there when the developer renames.

## Play it, every time

After every build or change that passes the check, end your message with a clickable line: `Play it: <link>`.

- **Connected:** the link is the preview link: `lamba_preview`, or `node lamba-check.mjs <app> --preview`. Tap it on a phone
  (Safari or Chrome): the screen is on top, and the host's phone and a player's phone switch with tabs. Anyone with the
  link can play, so the developer can send it to a friend. It lasts 15 days, the next preview of the app replaces it, and
  it is not a version: nothing is submitted. "Test this version" is on that page for the developer.
  Each preview is also saved as a Draft on lamba.tv/devs (under Your apps, the newest of each app, 15 days), so the developer can
  open it from there without hunting for the link. Tell them so once: "It is in your Drafts on lamba.tv/devs."
- **Not connected yet:** say once, in plain words: "To get a link you can open on your phone, connect Lamba (one tap)."
  Then run "Connect Lamba" below, and post the link.
- On a machine with a browser you may also offer `node lamba-test.mjs <app> --serve`. Never make "open the simulator
  and choose the folder" the main way: a phone cannot pick a folder (it can open a zip from the Files app).

## Connect Lamba, you lead

<!-- Verified November 2026: Claude Code, claude mcp add --transport http + /mcp (code.claude.com/docs/en/mcp); Claude, Customize > Connectors > Add custom connector (support.claude.com/en/articles/11175166); Codex, codex mcp add --url + codex mcp login, IDE gear > MCP servers (learn.chatgpt.com/docs/extend/mcp, was developers.openai.com/codex/mcp); Codex cloud variables kept, secrets removed before the agent phase (learn.chatgpt.com/docs/environments/cloud-environment); ChatGPT developer mode (help.openai.com article 12584461, page blocked to fetch, labels from search summaries only). -->

When the work reaches a step that needs Lamba (upload, submit, status), or the developer asks what is possible, say it
in your own words, in one or two plain sentences: connecting Lamba lets you upload the app, send it for review and
follow the review for them. It is one tap, and signing up is part of it. Ask if they want it, and never stop at "not connected": on yes, connect it yourself as below. Not before: building,
checking, testing, `--serve` and clips need no connection.

On yes, pick the way that fits the tool you run in, and do every step you can yourself:

- **Claude Code:** run `claude mcp add --transport http lamba-tv https://lamba.tv/devs/mcp`, then tell them to type
  `/mcp`, choose lamba-tv and Authenticate. A browser opens: tap Allow.
- **Claude app or claude.ai** (the phone app has the same Connectors screen in its settings; if it is not there, use the sign-in link below): Customize, Connectors, the + Add button, Add custom connector. Name it Lamba, URL
  `https://lamba.tv/devs/mcp`, Continue, Add, then Connect and tap Allow. In a chat, the + button, Connectors, switch
  Lamba on. (Team and Enterprise: an organization owner adds it under Organization settings, Connectors; members then Connect.)
- **Codex CLI:** run `codex mcp add lamba-tv --url https://lamba.tv/devs/mcp`, then `codex mcp login lamba-tv` and
  tap Allow. Codex in an IDE: the gear menu, MCP servers, Add server, Streamable HTTP, the URL, Save, Restart
  extension, Authenticate.
- **ChatGPT:** Settings, Apps, Advanced settings, turn on Developer mode, then Create app with the URL
  `https://lamba.tv/devs/mcp` and sign in. Menus there change, and not every plan has it. If it is not there, say so
  and use the sign-in below, or a zip at https://lamba.tv/devs.
- **On a phone, in Codex cloud, a plain terminal, any other AI:** run `node lamba-login.mjs` yourself and show the developer the one
  line it prints: tap the link (it opens in the phone's browser; sign up or sign in there) and tap Allow, then come back to the chat. It saves the key in `.lamba/key` (kept out of git and out of uploads)
  and `node lamba-check.mjs <app> --upload` uses it. `node lamba-login.mjs --logout` removes it. A connector alone is
  enough for the MCP tools; run the sign-in too for big uploads with the script.

Only in Codex cloud, once, after the first connection, tell them: to skip the tap next time, make a key at
https://lamba.tv/devs/keys and add it in this environment's settings as an environment variable named `LAMBA_KEY`
(not a secret: Codex removes secrets before the agent runs, and keeps variables).

Never ask for a key or a code in the chat, and never print a key. Submit for review only when the developer asks.
Say "screen" for the device, never "TV" (the name Lamba TV stays). On staging use `LAMBA_URL` and `LAMBA_MCP_URL` as above.

## Updating an app

Updating an app that is already on Lamba, step by step:

1. **The folder.** If `<app>/` is in this workspace, use it. If not, get it back (it needs the connection above): `lamba_download { app }`,
   or `node lamba-check.mjs --download <app>` for the whole folder with its clips. It refuses to write over a folder that
   has files in it unless `--force`. It gets the newest live version, else the newest.
2. **Change it, check it, play it.** Edit, `node lamba-check.mjs <app>`, `node lamba-test.mjs <app>`, then post the new `Play it: <link>`.
3. **Upload with a what's new note.** Write it yourself from what you changed: plain words, 300 letters at most, no HTML. Show it
   to the developer in one line, then use it: `whatsNew` in lamba.json, `--new "..."` on `--upload`, or `whats_new` on
   `lamba_upload`. Players read it as "New: ..." on the app's page, and the reviewer reads it beside what changed.
4. **Offer Try on my screen.** Say "Put it on Living room?" (their screen's own name: `lamba_try { app }` lists them), then
   `lamba_try { app, ver }` or `node lamba-check.mjs --try <app>`. Only their own paired screens, 7 days. No screen paired:
   the tool says how to pair one. `lamba_status` shows which version is being tried, and where.
5. **Submit only when the developer asks.**
6. **The live version keeps running** until the new one is approved. Say so, so nobody worries about breaking it.

## The Lamba MCP server

Once connected (docs: https://lamba.tv/devs/docs/ai/), it acts as the developer, only on their own apps:

| tool | use it to |
| --- | --- |
| `lamba_rules` | read these rules and the lamba.json schema |
| `lamba_docs` | search the docs (an SDK call, a lamba.json field, a design rule) |
| `lamba_check` | run the server's check on files without uploading |
| `lamba_upload` | upload a version (small apps; big ones: `node lamba-check.mjs <app> --upload`) |
| `lamba_status` | see versions, their states, what to fix and the reviewer's notes |
| `lamba_apps` | list the developer's apps |
| `lamba_request` | ask Lamba for what the kit lacks: need, what the kit does today, workaround (after the developer says yes) |
| `lamba_try` | put a version that passed the check on the developer's own screens (7 days); with no `ver` it lists their screens by name |
| `lamba_download` | get an app of theirs back into `./<app>/` to update it (big apps: `node lamba-check.mjs --download <app>`) |
| `lamba_listing` | what players will see, and the questions to ask the developer before submitting |
| `lamba_profile` | save who made it (their name or studio), after asking them |
| `lamba_private` | make it private: their own email's domain, named people |
| `lamba_submit`, `lamba_make_live` | only when the developer asks |

Never print, log or commit a key. It lives in `.lamba/key` or the `LAMBA_KEY` environment variable.
