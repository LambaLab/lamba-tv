# Lamba TV apps

Build apps for Lamba TV: the TV shows your app, and everyone in the room plays or controls it from their phone. No app
to install, no account for guests. One folder per app: a page for the TV, a page for the phone, and a `lamba.json`.

This repo is everything you need to build one, made for building with an AI coding agent (Claude Code or Codex).

## Start with one sentence

Tell Claude Code or Codex what you want, and where to start:

```
Build me a Lamba TV app: a trivia game everyone answers on their phone. Use github.com/LambaLab/lamba-tv
```

That's all. Your agent clones this repo, reads `AGENTS.md` and the `lamba-tv-app` skill, builds the app, checks and
tests its own work, and looks at the screenshots.

## Let your agent check and upload for you

Make a key at https://lamba.tv/devs/keys (you need an invite for now), then:

```
export LAMBA_KEY=lamba_...
```

- **Claude Code** in this folder uses `.mcp.json` (approve the "lamba" server when asked). Anywhere else:
  `claude mcp add --transport http --scope user lamba https://lamba.tv/devs/mcp --header "Authorization: Bearer $LAMBA_KEY"`
- **Codex**: `codex mcp add lamba --url https://lamba.tv/devs/mcp --bearer-token-env-var LAMBA_KEY`

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
lamba-test.mjs          the self-test: your app in the simulator, headless, with screenshots
lamba.d.ts              the SDK's types; lamba.schema.json: every field of lamba.json
my-app/                 a whole app that already works: start here
examples/               more apps to read and copy
plugin/                 the Claude Code plugin (marketplace: .claude-plugin/marketplace.json)
```

Docs: https://lamba.tv/devs/docs/ . Simulator: https://lamba.tv/devs/simulator/ . For AI tools: https://lamba.tv/devs/llms.txt

## Make it yours, by hand

### 1. Name it

Rename the folder `my-app` and change `"id"` in `my-app/lamba.json` to the same name: 2 to 24 small letters, digits or
dashes, starting with a letter. The folder's name is the app's id. Then change `name`, `sub` and `about`.

### 2. Run it

Open the simulator in Chrome or Edge: https://lamba.tv/devs/simulator/

Choose your app's folder (or drop it on the page). You see the TV, the owner's phone with the settings drawer, and
"Add a guest" for more phones. Change a file, then press Reload (or R).

### 3. Make it

- `tv.html` is the big screen. It is the authority: it keeps the time and the state (`Lamba.store`). Old TVs run it,
  so it is ES5 (Chrome 61): no `let`, no arrow functions, no `?.`, no `<video>` or `<audio>`.
- `phone.html` is the guests' phones and the owner's controls. One main action, low on the screen. It never zooms.
- `lamba.json` says what your app is, who joins and its settings. The host draws the settings drawer from it.

Everything is in the docs: https://lamba.tv/devs/docs/

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

It runs your app as the TV (at 1920 x 1080 and the old TV's 960 x 540), the owner's phone and a guest, taps through
the settings, and writes `lamba-test-shots/summary.md` with screenshots. Look at them.

Before you submit, record two real clips of your app (540 x 920, H.264, 6 to 14 seconds) and replace the two
placeholders in `clips/`, each with its `-poster.webp`.

### 5. Send it

Zip the app's folder (the folder itself, with `lamba.json` in it) and upload it at https://lamba.tv/devs.
Or, with a key in `LAMBA_KEY`: `node lamba-check.mjs my-app --upload`.
The check runs again, then a person at Lamba plays your app and reviews it. They may send it back with notes; fix them
and upload again. Every update is reviewed the same way.
