# Building a Lamba TV app

You are building an app for Lamba TV: calm things on the TV in a family living room, with the people in the room
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
  clips/         2 real clips: <name>.mp4 (540 x 920 H.264, 6 to 14 s) and <name>-poster.webp
```

Plain HTML and JavaScript, no build step, no packages, no frameworks. Every page loads the SDK with
`<script src="../../shell/sdk/lamba.js"></script>` and starts inside `Lamba.ready(function (L) { ... L.drawn(); })`.
Phones send commands with `Lamba.send`; the TV listens with `Lamba.on`, decides, saves with `Lamba.store` and
answers with `Lamba.send`. The TV page checks `L.screen.view === "screen"` before it decides, saves or plays sound.
Types for every call: `lamba.d.ts`. Every field of lamba.json: `lamba.schema.json`.

## Hard rules (the check and the reviewer refuse an app that breaks one)

1. **TV pages run on Chrome 61.** tv.html and every script it loads: ES5 only. No `?.`, no `??`, no object
   spread, no class fields, no optional catch binding. Safest: `var`, `function`, no arrow functions. No flex `gap`,
   no `clamp()`, no `aspect-ratio`. Phone pages may use modern JavaScript.
2. **No `<video>` or `<audio>` on TV pages**, and no script that makes one (`new Audio`, `createElement("video")`).
   Sound: Web Audio through `Lamba.sound.context()`, only on the real screen, only after `Lamba.sound.unlocked`.
   Moving pictures: canvas, or `Lamba.film(canvas, "films/x.film")`.
3. **A sealed sandbox.** Load only the app's own files (relative addresses), `../../shell/sdk/` and Google Fonts.
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
   shows comes from the TV's state, so a reload lands in the same place.
7. **Two real clips** of the app before it is uploaded (the starter's placeholders are refused on upload).
8. **Words people read:** no en dash or em dash anywhere (use a comma or a full stop), "they" for one person, plain
   short sentences, never the one word Lamba avoids for many colours (say "every colour"). Any set of animals
   includes a sloth. Every list of colours ends with "pick your own colour". Choosing a sound plays a short sample.
9. **Big and calm on the TV.** Size type by screen height (`vh`): headings 10 to 14 vh, body at least 4 vh. Motion
   is slow and stops under `prefers-reduced-motion`. Safe for a family room: no violence, fear, ads or purchases.

## The loop

Work in this order and do not skip a step:

1. **Read first.** `lamba_rules` and `lamba_docs` (the Lamba MCP server) or https://lamba.tv/devs/llms-full.txt.
   Change only the app's folder.
2. **Edit** lamba.json, tv.html, phone.html. Fill the whole listing in lamba.json for the players: `name`, `sub`,
   `about`, `category`, `age`, `players`, `icon`, `card`, two `clips`, and `page.facts` and `page.about`.
3. **Check:** `node lamba-check.mjs <app>`. Fix every line it prints. It is the check Lamba's server runs.
4. **Test:** `node lamba-test.mjs <app>`. It runs the app in the real simulator (the TV at 1920 x 1080 and
   960 x 540, the owner's phone, a guest) and writes `lamba-test-shots/summary.md` and screenshots.
   First time: `npm install` then `npx playwright install chromium`.
5. **Look** at the screenshots yourself and read summary.md. Fix what is marked FIX, page errors, refusals, and
   anything that looks wrong, small or crowded. Then check and test again.
6. **Self-review** against the design checklist before any upload, and fix every line that fails:
   - My app does one thing.
   - Words on the TV read from across the room.
   - Each phone has one big main action, low on the screen.
   - The TV shows the game. Phones are the controllers, not a copy of the TV.
   - The join card fills the TV while it waits, then moves to a corner.
   - Calm colours, strong contrast.
   - A guest is in with one tap: no forms, no accounts.
   - It runs on old TVs, and the phone page never zooms.
7. **Upload** only when check, test and the checklist pass: `node lamba-check.mjs <app> --upload` (needs `LAMBA_KEY`), or the
   `lamba_upload` tool. Read the result and `lamba_status`.
8. **Ask, then submit.** When the developer wants to submit: `lamba_listing`, then ask them its questions one at a
   time in plain words (they are not programmers), fill lamba.json (`lamba_profile` for who made it), upload again,
   show a short summary of what players will see, and `lamba_submit` (or `lamba_make_live`, private apps) when they say yes.

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
| `lamba_submit`, `lamba_make_live` | only when the developer asks |

Never print, log or commit the key. It lives in the `LAMBA_KEY` environment variable.
