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
type SettingValue = string | number | boolean | string[];
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
  joinCard(o: { show?: boolean; size?: "full" | "corner"; line?: string }): LambaSDK;
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
  /** Controller: choices made at run time for a choice setting marked dynamic, at most 120. */
  choices(setting: string, list: Array<{ id: string | number; name: string; sub?: string; picture?: unknown }>): LambaSDK;
}

// A script, not a module: Lamba and these types are global, as the SDK is on the page.
declare var Lamba: LambaSDK;
interface Window { Lamba: LambaSDK }
