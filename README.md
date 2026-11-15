# Lamba TV apps

Build apps for Lamba TV: the screen shows your app, and everyone in the room plays or controls it from their phone. No app
to install, no account for guests. One folder per app: a page for the screen, a page for the phone, and a `lamba.json`.

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
- The phone is the controller. One big main action, low on the screen, easy with one thumb. The phone never repeats the screen.
- Readable from across the room: big words, calm colours, one bright accent.
- A guest is in with one tap. No forms, no sign up.

How to build it
1. Before any code, ask me in one short message, with your suggestions: who it's for (everyone, families or made for kids), public on Lamba or private to my organization, its name, and whether phones are the controllers and for how many players.
2. Clone github.com/LambaLab/lamba-tv and follow its AGENTS.md and the lamba-tv-app skill.
3. Run the check and the self-test, look at every screenshot and go through the design checklist. Fix everything until they all pass. Then record its clips with lamba-clips.mjs.
4. Then tell me in one sentence what you built, how I can try it, and zip the app's folder so I can submit it at lamba.tv/devs.
```

That's all. Your agent clones this repo, reads `AGENTS.md` and the `lamba-tv-app` skill, builds the app, checks and
tests its own work, and looks at the screenshots.

## Codex in the cloud (or any agent that works from your own repo)

1. Click **Use this template** at the top of this page, then **Create a new repository**: you get your own copy of the kit.
2. In Codex, connect that new repository (not LambaLab/lamba-tv: you cannot push to it), and turn on internet access for
   the environment if you want it to check and upload for you.
3. Paste the prompt above as the task.

## Let your agent check and upload for you

Sign in at https://lamba.tv/devs/keys and make a key, then:

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
lamba-clips.mjs         your app's clips for its page, recorded in the simulator
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

Choose your app's folder (or drop it on the page). You see the screen, the owner's phone with the settings drawer, and
"Add a guest" for more phones. Change a file, then press Reload (or R).

### 3. Make it

- `tv.html` is the big screen. It is the authority: it keeps the time and the state (`Lamba.store`). Old screens run it,
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

It runs your app as the screen (at 1920 x 1080 and the old screen's 960 x 540), the owner's phone and a guest, taps through
the settings, and writes `lamba-test-shots/summary.md` with screenshots. Look at them.

Before you submit, make your app's clips: `node lamba-clips.mjs my-app` records them in the simulator and puts them in
`clips/` in place of the two placeholders. Then write their captions in `lamba.json`.

### 5. Send it

Zip the app's folder (the folder itself, with `lamba.json` in it) and upload it at https://lamba.tv/devs.
Or, with a key in `LAMBA_KEY`: `node lamba-check.mjs my-app --upload`.
The check runs again, then a person at Lamba plays your app and reviews it. They may send it back with notes; fix them
and upload again. Every update is reviewed the same way.
