// Types for window.Lamba, the SDK every Lamba app page loads (shell/sdk/lamba.js, vocabulary v1):
//   <script src="../../shell/sdk/lamba.js"></script>
// For editors and AI coding agents only: Lamba apps are plain ES5 JavaScript (the TV page must run on Chrome 61, so no
// ?. or ??), with no build step. Reference it from a script with:  /// <reference path="lamba.d.ts" />
// The docs: https://lamba.tv/devs/docs/sdk/ . tests/sdk-schema.test.mjs checks that every part of window.Lamba is here.

/** Which copy of a page this is (https://lamba.tv/devs/docs/how-it-works/). */
type View = "screen" | "preview" | "picture" | "controller" | "part" | "guest";
/** Who holds this copy: the big screen, the owner's phone, or a guest's phone. */
type Role = "tv" | "owner" | "guest";
/** Where a message from the TV goes: every phone ("" or "all"), the owner's phones, every guest, or one player ("v0"). */
type To = "" | "all" | "phones" | "guests" | string;
/** One setting's value: a choice id, a switch, a number, text, a list of ids, or a colour "#rrggbb". */
type SettingValue = string | number | boolean | string[] | { [id: string]: { x: number; y: number; s: number; r: number } } | { tubes: { c: number; p: number[]; z: 0 | 1 }[]; names: string[] };
type Permission = "sound" | "camera" | "motion" | "country";
type PermissionState = "granted" | "prompt" | "denied";

interface LambaScreen {
  /** "tv", "web" (a page on a computer) or "phone". */
  kind: "tv" | "web" | "phone" | "";
  view: View | "";
  /** The frame's size in CSS pixels. */
  w: number;
  h: number;
  /** True on the copy of the TV on the owner's phone. */
  preview: boolean;
  /** In view "part": which part of the settings drawer to draw (lamba.json { "app": "<part>" }). */
  part?: string;
  /** In view "picture": draw this setting's choice, small. */
  picture?: { setting: string; value: SettingValue; group: string; w: number; h: number };
  /** On phones: the device's own size. */
  room?: { w: number; h: number };
}

interface LambaTheme {
  colours: { ink?: string; sub?: string; panel?: string; tile?: string; track?: string; line?: string; accent?: string; good?: string; warn?: string; bad?: string; [k: string]: string | undefined };
  fonts: { ui?: string; [k: string]: string | undefined };
}

interface LambaPlayer { id: string; name: string }

interface LambaStatus {
  connected: boolean;
  linked?: boolean;
  /** Is this app on the TV now? Show a calm "not on the TV" with a Show on TV button when false. */
  onScreen: boolean;
  power: boolean | null;
  tv: boolean | null;
  tvAddress?: string;
  /** This phone has no TV yet: show the app as it would be, and Lamba.show() asks to connect a TV. */
  noTv?: boolean;
}

/** A message between the TV and the phones: { type: "word", ... }, at most 4 KB of JSON; a type never starts with "lamba". */
interface LambaMessage { type: string; [k: string]: unknown }

interface LambaStore {
  /** A copy of the value, or undefined. */
  get(k: string): any;
  /** Save it (the TV and the owner's phones; never guests). set(k) with no value removes it. Keys: letters, digits, _ and -, at most 40; a value at most 4 KB; 16 KB and 32 keys in all. */
  set(k: string, v?: unknown): LambaSDK;
  /** A copy of everything. */
  all(): { [k: string]: any };
  /** fn(k, v) when a value changed elsewhere (v undefined: removed). */
  on(fn: (k: string, v: any) => void): LambaSDK;
}

interface LambaSound {
  /** True once sound may play (a remote's button on a TV, a tap on a phone). */
  unlocked: boolean;
  /** One Web Audio context for the page, woken whenever sound may play. Never an <audio> element on a TV page. */
  context(): AudioContext | null;
  /** Wake the context now (the host does this for you). */
  unlock(): LambaSDK;
  /** fn() when sound becomes allowed, or at once if it already is. */
  onUnlock(fn: () => void): LambaSDK;
}

interface LambaFilm { play(): void; pause(): void; stop(): void }

interface LambaQuestion { text: string; kind?: string; answer?: string; choices?: string[]; board?: unknown }

/** One Google font. rank 1 is the most popular. */
interface LambaFont {
  family: string;
  kind: "sans" | "serif" | "display" | "handwriting" | "script" | "mono";
  /** Google's own word: "Sans Serif", "Serif", "Display", "Handwriting" or "Monospace". */
  category: string;
  /** Upright weights it has: 100 thin, 300 light, 400 regular, 500 medium, 700 bold, 900 black... */
  weights: number[];
  /** Italic weights it has (empty: no italic). */
  italics: number[];
  /** Alphabets besides latin: "arabic", "cyrillic", "greek", "hebrew", "thai", "devanagari"... */
  subsets: string[];
  rank: number;
}

interface LambaFonts {
  /** The whole library, most popular first. kind "popular" is the 150 most used; query searches names (and alphabets: "arabic"); subset keeps only fonts with that alphabet. */
  list(opts?: { kind?: "popular" | "sans" | "serif" | "display" | "script" | "handwriting" | "mono"; query?: string; subset?: string; limit?: number; from?: number }): Promise<LambaFont[]>;
  search(query: string, opts?: { kind?: string; subset?: string; limit?: number; from?: number }): Promise<LambaFont[]>;
  /** One family by name (any case), or null. */
  get(family: string): Promise<LambaFont | null>;
  /** Load a font through Lamba's own address and resolve when it can be drawn (in the page or on a canvas). text: only those letters are fetched; preview: true gives it a small name of its own (use the returned family). A weight the family lacks becomes the nearest one it has. */
  load(family: string, opts?: { weight?: number; italic?: boolean; text?: string; preview?: boolean }): Promise<{ family: string; weight: number; italic: boolean }>;
  /** Resolves when the catalogue is read. */
  ready(): Promise<LambaFont[]>;
  /** The address on Lamba of a font's css (after ready()); never a Google address. */
  address(family: string, opts?: { weight?: number; italic?: boolean; text?: string; as?: string }): string;
}

interface LambaFontPicker {
  el: HTMLElement;
  /** Set the chosen font from outside (a settings change on another phone). */
  set(v: { family: string; weight?: number; italic?: boolean }): void;
  get(): { family: string; weight: number; italic: boolean };
}

/** The shared controls (shell/sdk/ui.js). Only fontPicker is typed here; the rest are in docs/sdk/UI.md. */
declare var LambaUI: {
  /** A Google font picker: search, kinds (Popular, Script, Handwriting, Display, Sans, Serif, Mono), tiles drawn in each font, then its weights and italic. o.extra: your own list of choices shown first as { id, name, family?, weight?, italic?, draw?(canvas) }. */
  fontPicker(o: { value?: { family?: string; weight?: number; italic?: boolean; id?: string }; sample?: string; extra?: { title?: string; items: object[] }; onChange(v: { family: string; weight: number; italic: boolean; id?: string; kind: string }): void }): LambaFontPicker;
  [k: string]: any;
};

/** What turning motion on ends with: "on" (tilt, swing and shake come now), "finger" (the person chose to play by touch), "denied" (the phone said no) or "none" (this phone has no motion). */
type MotionState = "on" | "finger" | "denied" | "none";
interface LambaTilt { /** -1 (left) to 1 (right) */ x: number; /** -1 (top of the screen) to 1 (bottom): the screen's way, so ball.y += tilt.y moves it down */ y: number }
interface LambaSwing { /** the turning speed at its peak, degrees a second */ speed: number; /** 0 to 1, how hard (for this person) */ power: number; /** where the hand went on the screen: x right, y down, so a throw at the TV is { x: 0, y: -1 } */ dir: { x: number; y: number } }
interface LambaMotion {
  state: "off" | MotionState;
  /** Phones whose lamba.json declares "motion". Lamba's own screen asks the person (an iPhone asks from a tap); nobody is taught how to hold the phone. o.orientation true also gives "orientation" events. */
  start(o?: { title?: string; orientation?: boolean }): Promise<MotionState>;
  stop(): LambaSDK;
  /** The way the phone is held now is the middle again. */
  centre(): LambaSDK;
  on(type: "tilt", fn: (t: LambaTilt) => void): () => void;
  on(type: "swing", fn: (s: LambaSwing) => void): () => void;
  on(type: "shake", fn: (s: { strength: number }) => void): () => void;
  on(type: "orientation", fn: (o: { alpha: number | null; beta: number | null; gamma: number | null }) => void): () => void;
}
/** A frame of docs/TRACKING.md (landmarks, joint angles and gesture names; never the picture). */
interface LambaTrackFrame { v: number; t: number; id: number; w: number; h: number; mirror: boolean; pose: Array<{ x: number; y: number; z: number; v: number; wx?: number; wy?: number; wz?: number }> | null; hands: Array<{ side: "left" | "right"; points: Array<{ x: number; y: number; z: number }>; shape: string; pinch: number; pinching: boolean; wave: number; [k: string]: any }>; face: { blend: { [name: string]: number }; mesh: any; smile: number; emotion: string } | null; gestures: { body: { [k: string]: any }; pair: { [k: string]: any }; events: Array<{ type: string; [k: string]: any }> }; [k: string]: any }
interface LambaTrackOptions { camera?: "front" | "back"; pose?: boolean; hands?: boolean; face?: boolean; gestures?: boolean; /** frames a second, 5 to 30 (default 30) */ rate?: number;
  /** The body model, at start. "auto" (default): the Tracking Lab's own way, the light model that steps up to the full one while the phone is quick and back down when it is not. "lite": stays on the light model. "full": starts on the full model (more exact, a 9 MB download, hotter; an iPhone or iPad always stays on the light one). Hands only: pose: false (and gestures: false for the plain hand model). */ model?: "auto" | "lite" | "full";
  /** Where the models run: left out, the engine picks (the graphics chip, the processor if that is slow). "CPU" or "GPU" forces one. */ delegate?: "CPU" | "GPU" }
interface LambaTrackSession {
  state: string;
  /** Resolves when frames flow, rejects when the camera is refused or missing. */
  ready: Promise<LambaTrackSession>;
  on(name: "frame", fn: (f: LambaTrackFrame) => void): LambaTrackSession;
  on(name: "state", fn: (state: "loading" | "running" | "paused" | "stopped" | "denied" | "nocam" | "error") => void): LambaTrackSession;
  on(name: "progress", fn: (p: { fraction: number }) => void): LambaTrackSession;
  on(name: "error", fn: (e: { why: string }) => void): LambaTrackSession;
  stop(): LambaTrackSession;
  /** No argument flips front and back. */
  switchCamera(to?: "front" | "back"): LambaTrackSession;
  setOptions(o: LambaTrackOptions): LambaTrackSession;
  calibrate(): LambaTrackSession;
}
interface LambaTrack {
  /** The real cameras of this phone: kind "none", "one", "flip" (front and back: offer a switch) or "list". */
  cameras(): Promise<{ kind: "none" | "one" | "flip" | "list"; front: boolean; back: boolean }>;
  /** Fetch the models early (kept on the phone). Resolves true, or false when this phone cannot. */
  preload(o?: { pose?: boolean; hands?: boolean; face?: boolean; gestures?: boolean; model?: "auto" | "lite" | "full" }, onProgress?: (p: { fraction: number }) => void): Promise<boolean>;
  /** Phones whose lamba.json declares "camera": the person is asked on the phone; the picture stays there. */
  start(o?: LambaTrackOptions): LambaTrackSession;
}

interface LambaSDK {
  /** The vocabulary's version: 1. */
  v: number;
  /** The app's id. */
  app: string;
  role: Role | "";
  screen: LambaScreen;
  /** The app's own settings (lamba.json settings.fields), always valid. Never the host's frame, mat or brightness. */
  settings: { [key: string]: SettingValue };
  theme: LambaTheme;
  /** TV: the guests playing now, in the order they came in. */
  players: LambaPlayer[];
  /** Phones (controller, part): is this app on the TV now. */
  status: LambaStatus;
  /** "Easier to see": 0 off, 1 on, 2 strongest. */
  see: number;
  /** TV: where the screen is, only when lamba.json asks for "country"; null otherwise. */
  place: { country: string } | null;
  /** What the host said about each declared permission. */
  permissions: { [name: string]: PermissionState };

  /** fn(Lamba) once the host has said hello. Start everything here. */
  ready(fn: (L: LambaSDK) => void): LambaSDK;
  /** The page has drawn itself: the host fades it in (a picture view: the picture is ready). */
  drawn(): LambaSDK;
  onSettings(fn: (settings: { [key: string]: SettingValue }, changed: string[]) => void): LambaSDK;
  onPlayers(fn: (players: LambaPlayer[]) => void): LambaSDK;
  /** TV: the remote's OK button, when lamba.json has "remote": { "ok": true }. */
  onKey(fn: (k: { key: "ok"; down: boolean }) => void): LambaSDK;
  onStatus(fn: (status: LambaStatus) => void): LambaSDK;
  onScreen(fn: (screen: LambaScreen) => void): LambaSDK;
  onSee(fn: (level: number) => void): LambaSDK;
  /** Controller: keep the controls on screen even while a settings group is open. */
  keepInView(on: boolean): LambaSDK;
  /** Part: take the whole phone screen (a photo's crop screen, LambaUI.photo does it for you), and give it back with false. */
  fill(on: boolean): LambaSDK;
  /** Messages of that type from the other side. from: "tv", "owner" or a player's id ("v0"). */
  on(type: string, fn: (msg: LambaMessage, from: string) => void): LambaSDK;
  /** Phones: { name } the person chose, never an email. null on the TV or when no name was given. */
  me(): { name: string } | null;
  /** A phone's message always goes to the TV. The TV's goes to `to`. */
  send(msg: LambaMessage, to?: To): LambaSDK;
  /** Controller, part: change settings; final false while still moving (a slider being dragged). */
  change(patch: { [key: string]: SettingValue }, final?: boolean): LambaSDK;
  store: LambaStore;
  sound: LambaSound;
  /** Ask for a permission lamba.json declares. One not declared is always "denied". */
  ask(name: Permission, fn?: (state: PermissionState) => void): LambaSDK;
  /** TV: a looping film drawn into a canvas (a .film file: H.264 MP4 inside). Never a <video> on a TV page. */
  film(canvas: HTMLCanvasElement, url: string, opts?: object): LambaFilm;
  /** TV: the host's join card with the code people scan. Only for apps guests join. line: at most 60 characters. */
  joinCard(o: { show?: boolean; size?: "full" | "corner"; line?: string; avoid?: [number, number, number, number] }): LambaSDK;
  /** TV: the in-room question for what is on screen now. */
  question(q: LambaQuestion): LambaSDK;
  /** TV and picture: the app's main colours, so the frame's Soft and Neon styles match. */
  colours(c: { board?: string; ink?: string }): LambaSDK;
  /** Controller, part: ask the host to put this app on the TV. */
  show(): LambaSDK;
  /** Controller, part: open a group of the settings drawer (and one of its parts); "" goes back to the tiles. */
  open(group: string, part?: string): LambaSDK;
  /** Controller: the words under a settings tile whose value is "app", at most 40 characters. */
  describe(group: string, text: string): LambaSDK;
  /** TV: where the movable parts of the picture are now (screen widths; w, h before turning; r in degrees), so the phone's copy of the screen shows handles to move, size and turn them. A "transforms" setting holds the result. */
  parts(list: { id: string; name?: string; cx: number; cy: number; w: number; h: number; r?: number; parent?: string }[]): LambaSDK;
  /** A part's { x, y, s, r } from a "transforms" setting (s 1, the rest 0 when not moved yet). */
  xf(map: { [id: string]: { x: number; y: number; s: number; r: number; d?: 1 } } | undefined, id: string): { x: number; y: number; s: number; r: number; d: boolean };
  /** Phone views, "motion" declared: tilt, swing and shake (docs/sdk/SENSORS.md). */
  motion: LambaMotion;
  /** Phone views, "camera" declared: body, hands and face as landmarks and gesture names (docs/sdk/SENSORS.md). */
  track: LambaTrack;
  /** A sender that keeps to hz messages a second (1 to 30, the latest wins). From a phone to the TV it goes straight over the Wi-Fi when it can (a direct link, no round trip through the room) and through the room when not; your app cannot tell and never needs to: const out = Lamba.stream("pos", 20, "tv"); out({ x, y }). */
  stream(type: string, hz?: number, to?: string): ((data: { [k: string]: unknown }) => void) & { flush(): void };
  /** Phones: every Google font, through Lamba's own address (never straight from Google). */
  fonts: LambaFonts;
  /** Controller: choices made at run time for a choice setting marked dynamic, at most 120. */
  choices(setting: string, list: Array<{ id: string | number; name: string; sub?: string; picture?: unknown }>): LambaSDK;
}

// A script, not a module: Lamba and these types are global, as the SDK is on the page.
declare var Lamba: LambaSDK;
interface Window { Lamba: LambaSDK }

/** What is in a photo, found on the phone (shell/sdk/vision.js; load it on a phone page only, never on the TV page). Nothing is uploaded. */
interface LambaVisionSubject {
  /** "person" (hair, skin, face and clothes told apart), "pet", "object" (a thing the model knows), or "none" (nothing found). */
  kind: "person" | "pet" | "object" | "none";
  /** The size of the label map: the picture's longest side is made `size` pixels (320 by default). */
  w: number;
  h: number;
  /** One byte per pixel. 0 is the background. A person: 1 hair, 2 body skin, 3 face skin, 4 clothes, 5 other. A pet or an object: 1. */
  label: Uint8Array;
}
interface LambaVisionFace {
  w: number;
  h: number;
  /** The face's 478 mesh points as x, y, x, y, ... in pixels of the same size as the subject. */
  pts: number[];
}
interface LambaVisionApi {
  /** Find the main subject. `thing: true` skips the person model. Can reject (no WebGL, a lost connection): fall back to something simpler. */
  subject(canvas: HTMLCanvasElement, o?: { size?: number; thing?: boolean; onProgress?: (fraction: number) => void }): Promise<LambaVisionSubject>;
  /** Find the main face, or null. */
  face(canvas: HTMLCanvasElement, o?: { size?: number }): Promise<LambaVisionFace | null>;
  /** Load the engine early. Resolves false when this phone cannot run it. */
  ready(o?: { onProgress?: (fraction: number) => void }): Promise<boolean>;
  /** The mesh point numbers of each part of a face (closed loops end where they start). */
  FACE: { [part: string]: number[] };
  /** False on a browser without WebAssembly. */
  supported: boolean;
}
declare var LambaVision: LambaVisionApi;
