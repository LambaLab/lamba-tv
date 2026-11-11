---
name: lamba-tv-app
description: Build, check, test and upload a Lamba TV app (a folder with lamba.json, tv.html and phone.html for the TV in a family living room and the phones in the room). Use for any work on a Lamba app, its lamba.json, its TV or phone page, its settings, its clips, or sending it to Lamba for review.
---

# Lamba TV app

A Lamba app is one folder: `lamba.json`, `tv.html` (the big screen, the authority), `phone.html` (the owner's
controls and each guest's phone), `icon.svg`, `card.svg`, `clips/`. The rules in AGENTS.md are hard rules: the
check and a person at Lamba refuse an app that breaks one. Read them first if you have not.

## Steps

1. **Understand the ask.** One app, one function: a Lamba app does one thing well. One sentence: what the TV shows, what each phone does, who plays (guests or only the
   owner), what the owner can change in settings. If the developer gave only an idea, decide these yourself in the
   calm Lamba way and say what you chose.
2. **Read** `lamba_rules`, and `lamba_docs` for each SDK call you use (or `references/patterns.md` here, and
   https://lamba.tv/devs/llms-full.txt). Types: `lamba.d.ts`. lamba.json: `lamba.schema.json`. No
   `lamba-check.mjs` or `lamba-test.mjs` next to the app? Start from the starter kit
   (https://lamba.tv/devs/kit/starter.zip): it has both, these instructions, and an app that works.
3. **Name it.** Rename the app's folder and `id` together (a new app from the starter: `my-app` to the new id).
4. **Write lamba.json first**: name (24), sub (40), about (80), `guests` and `players`, `permissions` (only what
   it uses), `outside` (empty unless needed), settings `fields` and `groups` with `{ "host": "frame" }`,
   `{ "host": "mat" }` and `{ "host": "brightness" }` each once.
5. **Write tv.html** in ES5 (var, function, no arrow functions, no `?.` or `??`), from the TV pattern.
6. **Write phone.html** from the phone pattern: one main action, low in the middle, `../../shell/sdk/ui.css`
   round buttons, `user-scalable=no`.
7. **Check:** `node lamba-check.mjs <app>` until it says "is ready to upload".
8. **Test:** `node lamba-test.mjs <app>`, then open `lamba-test-shots/summary.md` and look at every screenshot
   (the TV at both sizes, the owner's phone, the guest's phone, each setting). Fix and run again until summary.md
   says nothing to fix and the screenshots look right: big type readable from the sofa, nothing cut off, nothing
   crowded, the main button where the thumb rests. Then go through the design checklist in `references/review.md`
   and fix what fails.
9. **Clips.** The starter's clips are placeholders, and an upload with them is refused. Two real clips are needed
   (540 x 920 H.264 mp4, 6 to 14 s, and a -poster.webp of the first frame each), recorded from the app running:
   a phone's screen recording, or the simulator. Ask the developer which. If they ask you to record them, record
   the app in the simulator that lamba-test.mjs serves (Playwright video of the TV with guests playing, and of a
   guest's phone), then make 540 x 920 H.264 with ffmpeg; keep the recording scripts outside the app's folder.
   Never draw, generate or reuse clips that don't show this app.
10. **Upload** when the developer wants: `node lamba-check.mjs <app> --upload` (with `LAMBA_KEY` set) or
    `lamba_upload`. Then `lamba_status`. Submit (`lamba_submit`) only when the developer asks.

## Before you say it is done

Go through `references/review.md`: it is what the person reviewing at Lamba checks. Report what you checked, what
the test said, and what the developer still has to do (clips, a key, submitting).

## Files here

- [references/patterns.md](references/patterns.md): the TV page, the phone page, guests and seats, settings,
  saved data, sound, the remote's OK, with code to copy
- [references/review.md](references/review.md): the review checklist
