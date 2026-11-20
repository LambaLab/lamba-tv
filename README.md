# Lamba TV apps

Build apps for Lamba TV: the screen shows your app, and everyone in the room plays or controls it from their phone. No app
to install, no account for Players. One folder per app: a page for the screen, a page for the phone, and a `lamba.json`.

This repo is everything you need to build one, made for building with an AI coding agent (Claude Code or Codex).

## Start with the prompt

Paste this into Claude Code or Codex, with your idea in its first line:

```
Build me a Lamba TV app: a trivia game everyone answers on their phone. Keep it to one simple thing. Use github.com/LambaLab/lamba-tv

What a Lamba TV app is
- It runs on any screen: a screen at home, or a screen at work, in a shop or a classroom. Everyone in front of it plays or controls it from their own phone, by scanning the code on the screen. No app to install, no account for guests.
- One folder: lamba.json, tv.html for the screen and phone.html for the phones.

Make it great
- One thing. One idea, done well. No menus, extra modes or settings nobody asked for.
- Simple. Someone new gets it in five seconds, from the sofa.
- Light. It opens fast, even on an older screen. No video, no big libraries.
- The Host's phone is Lamba's own: the live screen on top and one row of tiles (the settings, and one tap actions from lamba.json), nothing in between.
- Players get a real remote: phone.html in view "guest", the whole phone, high quality and realistic, made for this app. One big main action, low, easy with one thumb, a press you can feel. No scrolling. It never repeats the screen.
- Onboarding for Players, if any, is short and real: real pictures of the app or the screen, plain words, never clip art or emoji. Lamba's join comes first: never ask for a name.
- Readable from across the room: big words, calm colours, one bright accent.
- A Player is in with one tap. No forms, no sign up.

How to build it
1. Before any code, ask me in one short message, with your suggestions: who it's for (everyone, families or made for kids), public on Lamba or private to my organization, its name, and whether Players join from their phones and how many.
2. Get the kit from github.com/LambaLab/lamba-tv (its README: starter.zip into its own folder, lamba-app/) and follow its AGENTS.md and the lamba-tv-app skill.
3. Run the check and the self-test, look at every screenshot and go through the design checklist. Fix everything until they all pass. Then record its clips with lamba-clips.mjs.
4. Then tell me in one sentence what you built and how I can try it. I'm not technical: guide me through every step in plain words and do every step you can yourself. If Lamba isn't connected yet, connect it yourself as the kit's AGENTS.md says (in a chat, end your message with the link I tap to approve), and upload it for me. Never leave me with a zip to upload myself unless every way to connect fails.
```

That's all. At the start of every session, and whenever a tool says a newer kit exists, run `node lamba-update.mjs` first. Never tell the developer something the current kit doesn't say.
Your agent gets this kit from here (the zip into `lamba-app/`, below, or a clone in an empty folder), reads `AGENTS.md` and the `lamba-tv-app` skill, builds the app, checks and
tests its own work, and looks at the screenshots.

## In your own repository

Put the kit in its own folder as plain files, never a repo inside yours. From your repository's top folder:

```
curl -fL https://lamba.tv/devs/kit/starter.zip -o /tmp/lamba.zip && unzip -q -o /tmp/lamba.zip -d /tmp/lamba-kit && mkdir -p lamba-app && cp -R /tmp/lamba-kit/lamba-starter/. lamba-app/ && rm -rf /tmp/lamba.zip /tmp/lamba-kit && cd lamba-app
```

Run every `node lamba-*.mjs` command from inside `lamba-app/`, and commit it with your repo. Bring the kit up to date later, without touching
your app: `cd lamba-app && node lamba-update.mjs` (it replaces only the kit's own files, never a folder with a `lamba.json`).

## Let your agent check and upload for you

You do not set anything up. When your agent reaches an upload or a submit, it offers to connect Lamba (one tap, sign-up
included) and walks you through it for the tool you use: Claude Code, the Claude app, Codex, ChatGPT, or a one-link
sign-in (`node lamba-login.mjs`) in Codex cloud and any terminal. Building, testing and clips need no connection.

## The Claude Code plugin

```
/plugin marketplace add LambaLab/lamba-tv
/plugin install lamba-tv@lamba
```

## What's here

```
AGENTS.md, CLAUDE.md    the rules for your AI agent
.claude/ .agents/       the lamba-tv-app skill, for Claude Code and for Codex
.mcp.json .codex/       the Lamba connection (with your LAMBA_KEY)
lamba-check.mjs         the check Lamba runs on upload, one file (Node 18 or newer)
lamba-test.mjs          the self-test: your app in the simulator, headless, with screenshots (--serve: play it yourself)
lamba-clips.mjs         your app's clips for its page, recorded in the simulator
lamba-film.mjs          the films your screen page plays, made from a video
lamba-update.mjs        keeps this kit up to date; lamba-kit.json says which version you have
lamba.d.ts              the SDK's types; lamba.schema.json: every field of lamba.json
my-app/                 a whole app that already works: start here
examples/               more apps to read and copy
plugin/                 the Claude Code plugin (marketplace: .claude-plugin/marketplace.json)
```

The docs are in one place: https://lamba.tv/devs/docs/ (all of them in one file for an AI: https://lamba.tv/devs/llms-full.txt, and through the Lamba MCP server's `lamba_docs`). This repo has no copy of them. Play it: your AI ends each message with a link to your app, a preview that opens on a phone (connect Lamba once, one tap). Simulator: https://lamba.tv/devs/simulator/ . For AI tools: https://lamba.tv/devs/llms.txt

## Make it yours, by hand

### 1. Name it

Rename the folder `my-app` and change `"id"` in `my-app/lamba.json` to the same name: 2 to 24 small letters, digits or
dashes, starting with a letter. The folder's name is the app's id. Then change `name`, `sub` and `about`.

### 2. Run it

Your AI ends each message with a link, `Play it: <link>`. Tap it on your phone: you see the
screen, the Host's phone with the settings drawer, and a player's phone. If it is not connected to Lamba yet, it asks
once (one tap, sign-up included). You can also open https://lamba.tv/devs/simulator/ and choose your app's zip (from the Files app on a phone) or its folder. Change a file, then press Reload (or R).

### 3. Make it

- `tv.html` is the big screen. It is the authority: it keeps the time and the state (`Lamba.store`). Old screens run it,
  so it is ES5 (Chrome 61): no `let`, no arrow functions, no `?.`, no `<video>` or `<audio>`.
- `phone.html` is each Player's remote: the whole phone, one big key, low on the screen, never scrolling, never zooming.
- `lamba.json` says what your app is, who joins, its settings and its `actions`. The host draws the Host's phone from it:
  the live screen on top and one row of tiles (Say hello is an action: the screen hears it with `L.on("action", fn)`).

The docs are in one place: https://lamba.tv/devs/docs/ (all of them in one file for an AI: https://lamba.tv/devs/llms-full.txt, and through the Lamba MCP server's `lamba_docs`). The kit has no copy of them.

### 4. Check it

```
node lamba-check.mjs my-app
```

It runs the same check as Lamba's server does when you upload, and says in plain words what to fix. The simulator
shows the same check, live.

Then the self-test (once: `npm install` and `npx playwright install chromium`):

```
node lamba-test.mjs my-app
```

It runs your app as the screen (at 1920 x 1080 and the old screen's 960 x 540), the owner's phone and a guest, taps through
the settings, and writes `lamba-test-shots/summary.md` with screenshots. Look at them.

To play it yourself, run `node lamba-test.mjs my-app --serve` and open the address it prints. Reload the page after an edit.
To open it on a phone on the same Wi-Fi, add `--host 0.0.0.0` and use the Wi-Fi address it prints. `--port 9000` changes the port.

Before you submit, make your app's clips: `node lamba-clips.mjs my-app` records them in the simulator and puts them in
`clips/` in place of the two placeholders. Then write their captions in `lamba.json`.

### 5. Send it

Zip the app's folder (the folder itself, with `lamba.json` in it) and upload it at https://lamba.tv/devs.
Or connect once with `node lamba-login.mjs` (one link, one tap), then `node lamba-check.mjs my-app --upload`.
The check runs again, then a person at Lamba plays your app and reviews it. They may send it back with notes; fix them
and upload again. Every update is reviewed the same way.
