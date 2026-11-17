# What the reviewer at Lamba checks

Go through every line before you say the app is ready. A person at Lamba opens it on a screen and a phone and checks
the same.

## The design checklist (one app, one function)

Lamba TV apps are small apps that do one thing well. Go through these first; the drawings are at
https://lamba.tv/devs/docs/design/.

- [ ] My app does one thing.
- [ ] Words on the screen read from across the room.
- [ ] Each Player's remote has one big main action, low on the screen.
- [ ] The Host's phone is the live screen and one row of tiles (settings and actions), nothing in between.
- [ ] Players get a full screen, realistic remote that never scrolls; no clip art, no emoji, no name step of its own.
- [ ] The screen shows the game. Phones are the controls, not a copy of the screen.
- [ ] The join card fills the screen while it waits, then moves to a corner.
- [ ] Calm colours, strong contrast.
- [ ] A Player is in with one tap: no forms, no accounts.
- [ ] It runs on old screens, and the phone page never zooms.

## The check (automatic, refuses the upload)

- [ ] `node lamba-check.mjs <app>` says "is ready to upload".
- [ ] lamba.json: id equals the folder's name; name 24, sub 40, about 80 characters at most.
- [ ] Two clips listed in lamba.json `clips`, each `clips/<name>.mp4` and `clips/<name>-poster.webp`, real ones.
- [ ] screen pages: ES5 that Chrome 61 parses; no `<video>`, `<audio>`, `new Audio`, `createElement("video")`.
- [ ] Every page loads `../../shell/sdk/lamba.js`; only own files, `../../shell/sdk/` and Google Fonts through `Lamba.fonts` or `/fonts/css2` (never a Google address).
- [ ] No address outside Lamba unless in `outside`; no WebSocket, EventSource, sendBeacon; no browser storage.
- [ ] Phone page viewport has `user-scalable=no`.
- [ ] No en or em dash in any file people could read.

## The test (`node lamba-test.mjs <app>`)

- [ ] summary.md says nothing to fix: no page errors, no problems logged, nothing refused by the room.
- [ ] The screen page calls `Lamba.drawn()` and is faded in.
- [ ] Every settings choice reaches the screen and changes what it shows (look at the settings screenshots).
- [ ] A Player's tap reaches the screen and the screen answers.

## By eye (look at the screenshots)

- [ ] The screen reads from three metres: headings 10 to 14 vh, nothing under 3 vh, strong contrast, few words.
- [ ] The old screen size (960 x 540) shows the same, nothing cut off.
- [ ] The phone: one main action, big, low in the middle; other options behind one tap; nothing tiny.
- [ ] Steering or aiming uses a slide track, not arrow buttons; a game controller has a left or right hand switch.
- [ ] Calm when nothing happens; motion stops under `prefers-reduced-motion`.
- [ ] The screen page still reads when it is smaller (a second app beside or under it) and lays out again on `Lamba.onScreen`.
- [ ] Settings: the look waits for Send to screen; only who may join, for how long and the sound are `"apply": "now"`;
  a choice for nothing is named "None" with no picture; no tiles of your own for Players, scribbles or effects.
- [ ] The words: plain, sentence case, "they" for one person, buttons say what they do, as few as possible.

## Safe for the room

- [ ] Right for its `age` (`all`, `7+`, `13+`): no violence, fear, gambling, dating, ads, purchases, chat with strangers.
- [ ] Each permission (`sound`, `camera`, `motion`, `country`) is needed; a camera app says on the screen and the phone when it is on.
- [ ] Each `outside` address is needed, and you can say why.
- [ ] Never asks who someone is (age, address, phone, a photo of a face): `Lamba.me()` has their name.
- [ ] Animal sets include a sloth; colour lists end with "pick your own colour"; choosing a sound in your own app part (phone.html) plays a sample.
