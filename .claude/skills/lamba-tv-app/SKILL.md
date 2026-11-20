---
name: lamba-tv-app
description: Build, check, test and upload a Lamba TV app (a folder with lamba.json, tv.html and phone.html for any screen and the phones in front of it). Use for any work on a Lamba app, its lamba.json, its screen or phone page, its settings, its clips, or sending it to Lamba for review.
---

# Lamba TV app

A Lamba app is one folder: `lamba.json`, `tv.html` (the big screen, the authority), `phone.html` (the Host's
controls and each Player's phone), `icon.svg`, `card.svg`, `clips/`. The rules in AGENTS.md are hard rules: the
check and a person at Lamba refuse an app that breaks one. Read them first if you have not.

The docs are in one place: https://lamba.tv/devs/docs/ (all of them in one file for an AI: https://lamba.tv/devs/llms-full.txt, and through the Lamba MCP server's `lamba_docs`). The kit has no copy of them.


**Who you work for.** Most people building Lamba apps have never coded. Lead them through every step in plain words,
one step at a time, and do every step you can yourself. Never end a turn by handing them a technical task ("download
the zip and upload it", "run this command", "Lamba isn't connected here") when you could do it or walk them through it.
If Lamba is not connected when the app is ready, say what connecting gives them in one sentence, ask "Shall I connect
Lamba now? It's one tap", and on yes run the right way from "Connect Lamba, you lead" yourself, post the link, wait,
then carry on (upload, preview link, submit). If they say not now, ask again at the next step that needs it. A zip
download is the last resort, only if every way to connect fails, and then you explain each tap.

## Steps

0. **Update the kit.** At the start of every session, and whenever a tool says a newer kit exists, run `node lamba-update.mjs` first (one line, offline is fine). Never tell the developer something the current kit doesn't say.
1. **Ask first.** Before any code, one short message in plain words, with your suggestion for each: who it is for
   (everyone, families, or made for kids), public on Lamba or private to their organization, its name, and whether
   Players join from their phones and how many. Then never ask these again; AGENTS.md ("Ask first") says
   what each answer sets. One app, one function: decide the rest yourself in the calm Lamba way and say what you chose.
2. **Read** `lamba_rules`, and `lamba_docs` for each SDK call you use (or `references/patterns.md` here, and
   https://lamba.tv/devs/llms-full.txt). Types: `lamba.d.ts`. lamba.json: `lamba.schema.json`. No
   `lamba-check.mjs` or `lamba-test.mjs` next to the app? Get the kit first, as the start guide says. Inside the developer's
   own repository, the zip into its own folder (plain files, no `.git`), then work from inside it:
   `curl -fL https://lamba.tv/devs/kit/starter.zip -o /tmp/lamba.zip && unzip -q -o /tmp/lamba.zip -d /tmp/lamba-kit && mkdir -p lamba-app && cp -R /tmp/lamba-kit/lamba-starter/. lamba-app/ && rm -rf /tmp/lamba.zip /tmp/lamba-kit && cd lamba-app`
   In an empty folder, `git clone https://github.com/LambaLab/lamba-tv.git lamba-app` also works. Run every `node lamba-*.mjs`
   command from inside `lamba-app/`; `node lamba-update.mjs` there refreshes the kit and never touches the app.
3. **Name it.** Rename the app's folder and `id` together (a new app from the starter: `my-app` to the new id).
4. **Write lamba.json first**: name (24), sub (40), about (80), `guests` and `players`, `permissions` (only what
   it uses), `outside` (empty unless needed), settings `fields` and `groups` with `{ "host": "frame" }`,
   `{ "host": "mat" }` and `{ "host": "brightness" }` each once.
5. **Write tv.html** in ES5 (var, function, no arrow functions, no `?.` or `??`), from the screen pattern.
6. **Write phone.html** (Build settings in lamba.json, never in phone.html: https://lamba.tv/devs/docs/ui/#phone-pages-use-lamba-s-controls) from the remote pattern (references/patterns.md): for an app Players join, the Player's remote in
   view `guest`, the whole phone, a full screen, realistic remote made for this app (`.l-remote`, `.l-well`, `.l-key.l-big`,
   `LambaUI.press`), one main action, low, never scrolling, `user-scalable=no`. No name step on your page. Ask for names only if the app shows them (`"askName": true` in lamba.json; Lamba's join asks once and you read
   `Lamba.me()`), no clip art, no emoji. The Player's remote is full screen and visual: pictures for choices (mark the groups Players may change with "players": true in lamba.json, and Lamba shows them the Host's picture tiles), and a visible sound control when the app has sound (add "forPlayers": ["sound"] to lamba.json for Lamba's own Sound tile; also "brightness", "frame", "effects" (cracks, lines, flies: never a scare) and "schedule" (Players only see it, the Host alone changes it), each off until the Host switches it on). For background music, never ship your own files: add "music": true to lamba.json (and "music" to forPlayers to share it) and Lamba plays its own library on the screen, with a Music tile for the Host. No decorative status text or stray icons at the top, no hold to act gestures, and options big enough for a thumb (44 px or more). The Host's phone is the live screen on top and ONE row of tiles from lamba.json,
   nothing in between: settings are fields, one tap things are `actions` (heard with `L.on("action")`). There is no
   controller view.
7. **Check:** `node lamba-check.mjs <app>` until it says "is ready to upload".
8. **Test:** `node lamba-test.mjs <app>`, then open `lamba-test-shots/summary.md` and look at every screenshot
   (the screen at both sizes, the Host's phone, the Player's phone, each setting). Fix and run again until summary.md
   says nothing to fix and the screenshots look right: big type readable from the sofa, nothing cut off, nothing
   crowded, the main button where the thumb rests. Then go through the design checklist in `references/review.md`
   and fix what fails. Before submitting, run `node lamba-test.mjs <app> --perf` (Lamba's measured review on an old
   screen) and fix every FIX in its Performance part.
   To play it: the preview link ("Play it" below). On a machine with a browser, `node lamba-test.mjs <app> --serve` also works.
9. **Clips.** The starter's clips are placeholders, and an upload with them is refused. Run
   `node lamba-clips.mjs <app>`: it plays the app in the simulator (random taps, or `--script steps.json` for a
   session that shows it at its best) and writes 2 or 3 clips in the exact format, listed in lamba.json. Look at
   each `-poster.webp`, and write captions that say what each clip shows. Never draw, generate or reuse clips that
   don't show this app.
10. **Assets, then look at them.** Make `icon.svg` (square; the drawing inside 9 to 51 of 60), `card.svg` (exactly
    320 x 180; what matters 12 units in from the edges), and the clips with posters (540 x 920, H.264, 6 to 14 s,
    captions of 60 characters or less). Templates: `templates/` here. Render or open each file and each poster, and say what you
    checked. Nothing else is asked for: Lamba draws the link preview, the app page shows clips and no screenshots, and
    no manifest field takes another picture ([assets](https://lamba.tv/devs/docs/assets/)). A looping scene: `node lamba-film.mjs
    <video> --name <name> --out <app>/films` ([films](https://lamba.tv/devs/docs/films/)). Art apps fill the screen edge to edge
    (hard rule 12 in AGENTS.md).
11. **Upload** when the developer wants: `node lamba-check.mjs <app> --upload` (after "Connect Lamba", below) or
    `lamba_upload`. Then `lamba_status`. Submit only when the developer asks: `lamba_listing`, fill its gaps from the
    first answers, ask only what is still unknown, then `lamba_submit` (private: `lamba_private`, `lamba_make_live`).

## The kit is read only

Never write an SDK or platform patch, and never say one "must be integrated". If the kit lacks something: look again in
`lamba_docs` (several slots of one kind, such as two photos, are parts of ONE group, a pill in the drawer), then tell the
developer plainly what is missing, use the closest supported way, and offer three lines (need, what the kit does today, the
workaround) to file with Lamba: `lamba_request` when the developer says yes (or the Request a feature page at lamba.tv/devs/requests/new). AGENTS.md ("You cannot change the platform") has the full rule.

## Play it, every time

After every build or change that passes the check, end your message with a clickable line: `Play it: <link>`.

- **Connected:** the link is the preview link: `lamba_preview`, or `node lamba-check.mjs <app> --preview`. Tap it on a phone
  (Safari or Chrome): the screen is on top, and the host's phone and a player's phone switch with tabs. Anyone with the
  link can play, so the developer can send it to a friend. It lasts 15 days, the next preview of the app replaces it, and
  it is not a version: nothing is submitted. It is also in the developer's Drafts on lamba.tv/devs (15 days). "Try on my
  screen" is on that page for the developer: that puts a checked version on their own screens for 7 days.
- **Not connected yet:** say once, in plain words: "To get a link you can open on your phone, connect Lamba (one tap)."
  Then run "Connect Lamba" below, and post the link.
- On a machine with a browser you may also offer `node lamba-test.mjs <app> --serve`. Never make "open the simulator
  and choose the folder" the main way: a phone cannot pick a folder (it can open a zip from the Files app).

## Connect Lamba, you lead

<!-- Verified November 2026: Claude Code, claude mcp add --transport http + /mcp (code.claude.com/docs/en/mcp); Claude, Customize > Connectors > Add custom connector (support.claude.com/en/articles/11175166); Codex, codex mcp add --url + codex mcp login, IDE gear > MCP servers (learn.chatgpt.com/docs/extend/mcp, was developers.openai.com/codex/mcp); Codex cloud variables kept, secrets removed before the agent phase (learn.chatgpt.com/docs/environments/cloud-environment); ChatGPT developer mode (help.openai.com article 12584461, page blocked to fetch, labels from search summaries only). -->

When the work reaches a step that needs Lamba (upload, submit, status), or the developer asks what is possible, say it
in your own words, in one or two plain sentences: connecting Lamba lets you upload the app, send it for review and
follow the review for them. It is one tap, and signing up is part of it. Never stop at "not connected", and never end
your message with a step "pending": connect it yourself as below. A connector (Claude Code, the Claude app, Codex CLI or
IDE, ChatGPT) changes their settings, so ask first and on yes set it up. In a chat AI (Codex cloud, a phone), do not
ask: start the sign-in yourself. Not before: building, checking, testing, `--serve` and clips need no connection.

Pick the way that fits the tool you run in, and do every step you can yourself:

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
- **On a phone, in Codex cloud, any chat AI:** the developer sees your message only when your turn ends, so never wait
  on a command there. Once the app is built and checked, run `node lamba-login.mjs --start`. It prints one line, `Open
  <link> and tap Allow`, and returns at once. End your message with that link on its own line, as a link they can tap,
  for example:

  Tap to approve Lamba: [Approve](https://lamba.tv/link?c=ABCD-EFGH), then reply done.

  On their next message run `node lamba-login.mjs --finish` (or `node lamba-check.mjs <app> --upload`, which finishes
  it first), carry on with the upload and give them the Play it link. If it says "Not allowed yet", end your message
  with the link again the same way. The key is saved in `.lamba/key`, the waiting sign-in in `.lamba/pending`, both
  kept out of git and out of uploads.
- **A plain terminal:** run `node lamba-login.mjs`: it prints the link and waits for the tap. `node lamba-login.mjs
  --logout` removes the key. A connector alone is enough for the MCP tools; run the sign-in too for big uploads with
  the script.

Only in Codex cloud, once, after the first connection, tell them: to skip the tap next time, make a key at
https://lamba.tv/devs/keys and add it in this environment's settings as an environment variable named `LAMBA_KEY`
(not a secret: Codex removes secrets before the agent runs, and keeps variables).

Lamba apps need no GitHub repository. Do not create one or push anywhere unless the developer asks; the app goes to
Lamba with `--upload` or `lamba_upload`.

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

## Before you say it is done

Go through `references/review.md`: it is what the person reviewing at Lamba checks. Report what you checked, what
the test said, and what the developer still has to do (connecting Lamba, submitting).

## Files here

- [references/patterns.md](references/patterns.md): the screen page, the phone page, Players and seats, settings,
  saved data, sound, motion and camera, the remote's OK, with code to copy
- [references/review.md](references/review.md): the review checklist
- `templates/icon-template.svg`, `templates/card-template.svg`: the icon and card with their safe areas drawn
- `templates/phone-viewports.test.mjs`: the Host's and a Player's phone in WebKit at iPhone sizes, upright and sideways, sheet up
  and down; checks 44 px targets, equal keys, no scrolling and nothing moving under a finger. Copy it next to `lamba-test.mjs`
