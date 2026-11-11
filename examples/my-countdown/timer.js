// Stopwatch and Countdown as SDK apps: the face, the time and the sound. The same file is in apps/stopwatch and
// apps/countdown (each app's folder is whole by itself); keep the two the same (tests/sdk-apps.test.mjs checks it).
// Made from apps/timers/timers.js (Alarm still uses that), without the frame and brightness (the host draws those).
//   var T = LambaTimer("stopwatch" | "countdown")
//   T.clean(s) the app's settings   T.RUN the time's rules (clean, act, ...)   T.Face(host, kind, opt)   T.Sound
//   T.question(S) the in-room question   T.tones(S) { board, ink } for the frame   T.LOOKS, T.LOOK_IDS, T.TONE_IDS
//   T.fmtSW, T.fmtCD, T.durWords, T.clockAt, T.copy, T.rid, T.two, T.calm, T.relayout()
// Old TV browsers (Chrome 61): no ?. or ??, no object spread, catch always with (e), no flex gap.
window.LambaTimer = function (APP) {
  var $ = function (id) { return document.getElementById(id); };
  var calm = function () { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); };
  var copy = function (a, b) { var o = {}, k; for (k in a) o[k] = a[k]; if (b) for (k in b) o[k] = b[k]; return o; };
  var two = function (n) { return n < 10 ? "0" + n : "" + n; };
  var int = function (v, lo, hi, d) { return typeof v === "number" && isFinite(v) && v >= lo && v <= hi ? Math.round(v) : d; };
  var rid = function () { return (Math.random().toString(36) + "00000000").slice(2, 10); };
  var BIG = 1e15, MAXD = 99 * 3600000 + 59 * 60000 + 59000;   // the longest countdown: 99 hours, 59 minutes, 59 seconds

  // ---------------- Sound, made on the screen (and on the phone, to try a sound) ----------------
  var Sound = (function () {
    var AC = null, out = null;
    function ctx() {
      if (!AC) {
        try { AC = window.Lamba ? Lamba.sound.context() : null; if (AC) { out = AC.createDynamicsCompressor(); out.connect(AC.destination); } } catch (e) {}
      }
      return AC;
    }
    function wake() { var a = ctx(); if (a && a.state !== "running" && a.resume) { try { var p = a.resume(); if (p && p.catch) p.catch(function () {}); } catch (e) {} } }
    function on() { return !!AC && AC.state === "running"; }
    function osc(dest, type, f, t, peak, a, d) {
      var o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d);
      o.connect(g); g.connect(dest); o.start(t); o.stop(t + a + d + .05);
    }
    // each sound: a short pattern played again every few seconds
    var TONES = {
      chimes: { name: "Chimes", sub: "Soft bells, rising", every: 4.6, play: function (d, t) { [659.25, 783.99, 987.77, 1318.5].forEach(function (f, i) { var s = t + i * .34; osc(d, "sine", f, s, .3, .006, 2.6); osc(d, "sine", f * 2.76, s, .06, .004, .9); osc(d, "sine", f * 5.4, s, .02, .003, .35); }); } },
      marimba: { name: "Marimba", sub: "Warm wooden notes", every: 3.4, play: function (d, t) { [392, 493.88, 587.33, 783.99, 587.33, 493.88].forEach(function (f, i) { var s = t + i * .2; osc(d, "sine", f, s, .42, .004, .55); osc(d, "sine", f * 3.93, s, .07, .002, .1); }); } },
      harp: { name: "Harp", sub: "A gentle ripple", every: 4.2, play: function (d, t) { [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { var s = t + i * .11; osc(d, "triangle", f, s, .28, .003, 1.8); osc(d, "sine", f * 2, s, .05, .003, .8); }); } },
      classic: { name: "Classic", sub: "A soft beep, beep", every: 2.2, play: function (d, t) { [0, .22, .44, .66].forEach(function (x) { osc(d, "sine", 880, t + x, .26, .01, .12); osc(d, "sine", 1760, t + x, .035, .01, .08); }); } }
    };
    // play a sound again and again until stopped; rise: seconds to grow from soft to full (an alarm getting louder).
    // Nothing is scheduled while the TV keeps sound off, so a press on the remote never sets off a pile of notes at once.
    function play(tone, o) {
      o = o || {}; var T = TONES[tone] || TONES.chimes, a = ctx(), stopped = false, timer = 0, started = false, vol = o.vol || .7;
      if (!a) return { stop: function () {} };
      var g = a.createGain(); g.gain.value = 0; g.connect(out);
      var round = function () {
        if (stopped) return;
        if (a.state === "running") {
          var t = a.currentTime + .05;
          if (!started) { started = true; g.gain.setValueAtTime(o.rise ? .1 * vol : vol, t); if (o.rise) g.gain.linearRampToValueAtTime(vol, t + o.rise); }
          T.play(g, t);
        }
        timer = setTimeout(round, (T.every + (o.gap || 0)) * 1000);
      };
      round();
      return { stop: function () {
        stopped = true; clearTimeout(timer);
        try { var t = a.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + .25); } catch (e) {}
        setTimeout(function () { try { g.disconnect(); } catch (e) {} }, 700);
      } };
    }
    var tryOne = null;
    function preview(tone) { wake(); if (tryOne) tryOne.stop(); var p = tryOne = play(tone, { vol: .55, gap: 60 }); setTimeout(function () { p.stop(); }, 4200); }
    return { wake: wake, on: on, play: play, preview: preview, TONES: TONES };
  })();
  var TONE_IDS = ["chimes", "marimba", "harp", "classic"];

  // ---------------- Looks ----------------
  var MANROPE = "'Manrope', 'Helvetica Neue', Arial, sans-serif", FRAUNCES = "'Fraunces', Georgia, 'Times New Roman', serif", BALOO = "'Baloo 2', 'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif";
  // w: the numbers' weight, tw: the words' weight, ring: the countdown ring's thickness (of 100)
  var LOOKS = {
    night:   { name: "Night", sub: "Black, with warm white numbers", bg: "#000000", ink: "#ecebe6", sub2: "rgba(236,235,230,.52)", acc: "#ffb547", track: "rgba(236,235,230,.1)", font: MANROPE, w: 200, tw: 500, ring: 1.1 },
    day:     { name: "Daylight", sub: "Light and crisp", bg: "#eef0f2", ink: "#16181c", sub2: "rgba(22,24,28,.55)", acc: "#2f62e0", track: "rgba(22,24,28,.09)", font: MANROPE, w: 300, tw: 500, ring: 1.1 },
    gallery: { name: "Gallery", sub: "Deep green and gold, set in a serif", bg: "#10241c", ink: "#efe6d2", sub2: "rgba(239,230,210,.56)", acc: "#d1ab62", track: "rgba(239,230,210,.11)", font: FRAUNCES, w: 300, tw: 400, ring: .9 },
    sunny:   { name: "Kids sunshine", sub: "Bold and bright, for kids", bg: "#2e9cf0", ink: "#ffffff", sub2: "rgba(255,255,255,.82)", acc: "#ffd23f", track: "rgba(255,255,255,.26)", font: BALOO, w: 800, tw: 700, ring: 4.2, kids: true },
    candy:   { name: "Kids candy", sub: "Purple and pink, for kids", bg: "#7a4fd6", ink: "#ffffff", sub2: "rgba(255,255,255,.82)", acc: "#ff79ad", track: "rgba(255,255,255,.24)", font: BALOO, w: 800, tw: 700, ring: 4.2, kids: true }
  };
  var LOOK_IDS = ["night", "day", "gallery", "sunny", "candy"];
  var DEF = {
    stopwatch: { look: "night", hund: true, laps: true, bright: 5 },
    countdown: { look: "night", ring: true, ends: true, tone: "chimes", bright: 5 }
  };
  function clean(s) {
    var o = copy(DEF[APP]);
    delete o.bright;
    if (!s || typeof s !== "object") return o;
    if (LOOKS[s.look]) o.look = s.look;
    ["hund", "laps", "ring", "ends", "secs", "date"].forEach(function (k) { if (k in o && typeof s[k] === "boolean") o[k] = s[k]; });
    if ("tone" in o && (Sound.TONES[s.tone] || s.tone === "quiet")) o.tone = s.tone;
    return o;
  }
  var tones = function (S) { var L = LOOKS[S.look] || LOOKS.night; return { board: L.bg, ink: L.ink }; };   // what the Soft and Neon frames take
  var rgbOf = function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); };
  var near = function (a, b) { var x = rgbOf(a), y = rgbOf(b); return Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]) < 110; };
  var alpha = function (h, a) { var c = rgbOf(h); return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; };
  // the in-room question: the numbers' colour, on the screen's own background
  function question(S) {
    var L = LOOKS[S.look] || LOOKS.night, ink = L.ink.toLowerCase(), out = [ink];
    ["#ffb547", "#2f62e0", "#ff79ad", "#7dffa0", "#45c8ff", "#ffffff", "#18181b", "#c49bff"].forEach(function (c) { if (out.length < 4 && !near(c, L.bg) && !out.some(function (x) { return near(x, c); })) out.push(c); });
    return { text: "Which colour are the numbers on the screen?", kind: "letters", board: L.bg, answer: ink, choices: out };
  }

  // ---------------- What runs: cleaned, and changed by a command (on the TV, and ahead of it on the phone) ----------------
  var done = function (r) { return r && typeof r.done === "string" ? r.done.slice(0, 40) : ""; };
  var label = function (s) { return typeof s === "string" ? s.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 32) : ""; };
  var SW = {
    clean: function (r) {
      r = r && typeof r === "object" ? r : {};
      var laps = Array.isArray(r.laps) ? r.laps.filter(function (x) { return typeof x === "number" && isFinite(x) && x >= 0 && x < BIG; }).slice(-99) : [];
      return { on: r.on === true, t0: int(r.t0, 0, BIG, 0), acc: int(r.acc, 0, BIG, 0), laps: laps, done: done(r) };
    },
    el: function (r, T) { return r.acc + (r.on ? Math.max(0, T - r.t0) : 0); },
    act: function (r, c, T) {
      r = SW.clean(r); var op = c.op;
      if (op === "toggle") op = r.on ? "pause" : "start";
      if (op === "start" && !r.on) { r.on = true; r.t0 = T; }
      else if (op === "pause" && r.on) { r.acc = SW.el(r, T); r.on = false; r.t0 = 0; }
      else if (op === "lap" && r.on && r.laps.length < 99) r.laps.push(SW.el(r, T));
      else if (op === "reset") { r.on = false; r.t0 = 0; r.acc = 0; r.laps = []; }
      return r;
    }
  };
  var CD = {
    clean: function (r) {
      r = r && typeof r === "object" ? r : {};
      return { st: ["idle", "run", "pause", "done"].indexOf(r.st) > -1 ? r.st : "idle", dur: int(r.dur, 1000, MAXD + 3600000, 300000), end: int(r.end, 0, BIG, 0),
        left: int(r.left, 0, MAXD + 3600000, 0), at: int(r.at, 0, BIG, 0), loud: r.loud === true, done: done(r) };
    },
    left: function (r, T) { return r.st === "run" ? Math.max(0, r.end - T) : r.st === "pause" ? r.left : r.st === "idle" ? r.dur : 0; },
    act: function (r, c, T) {
      r = CD.clean(r); var op = c.op, ms = int(c.ms, 1000, MAXD, 0), A = 60000;
      if (op === "toggle") op = r.st === "run" ? "pause" : r.st === "pause" ? "resume" : r.st === "done" ? "stop" : "start";
      if (op === "start") { if (ms) r.dur = ms; r.st = "run"; r.end = T + r.dur; r.left = 0; }
      else if (op === "pause" && r.st === "run") { r.left = Math.max(0, r.end - T); r.st = "pause"; }
      else if (op === "resume" && r.st === "pause") { r.end = T + r.left; r.st = "run"; }
      else if (op === "add") {
        if (r.st === "run") { r.end += A; r.dur += A; }
        else if (r.st === "pause") { r.left += A; r.dur += A; }
        else if (r.st === "done") { r.st = "run"; r.end = T + A; r.dur = A; }
        else r.dur = Math.min(MAXD, r.dur + A);
      }
      else if (op === "restart") { r.st = "run"; r.end = T + r.dur; r.left = 0; }
      else if (op === "stop") { r.st = "idle"; r.left = 0; r.end = 0; r.loud = false; }
      return r;
    },
    // the end: done, and loud only when the screen saw it happen (not when it comes back to an old one)
    check: function (r, T) { if (r.st === "run" && T >= r.end) { r.st = "done"; r.at = r.end; r.loud = T - r.end < 60000; return true; } return false; }
  };
  // ---------------- Words and numbers ----------------
  function fmtSW(ms, hund) {
    ms = Math.max(0, Math.floor(ms)); var cs = Math.floor(ms / 10), s = Math.floor(cs / 100), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
    return { main: (h ? h + ":" + two(m) : two(m)) + ":" + two(s % 60), frac: hund ? "." + two(cs % 100) : "" };
  }
  function fmtCD(ms) { var t = Math.ceil(Math.max(0, ms) / 1000), h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60; return h ? h + ":" + two(m) + ":" + two(s) : m + ":" + two(s); }
  function durWords(ms) {
    var t = Math.round(ms / 1000), h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60, out = [];
    if (h) out.push(h + (h === 1 ? " hour" : " hours")); if (m) out.push(m + (m === 1 ? " minute" : " minutes")); if (s) out.push(s + (s === 1 ? " second" : " seconds"));
    return out.join(" ") || "No time";
  }
  var hm = function (h, m, hours) { return hours === "24" ? two(h) + ":" + two(m) : (h % 12 || 12) + ":" + two(m) + (h < 12 ? " AM" : " PM"); };
  var clockAt = function (ms, hours) { var d = new Date(ms); return hm(d.getHours(), d.getMinutes(), hours || "12"); };
  // ---------------- The face: the TV's picture, also the phone's live copy and the small pictures in the settings ----------------
  // The numbers sit in cells of one width (the widest digit of the look's font), so nothing ever shifts as they change.
  var MET = {}, metV = 0;
  function metric(L) {
    var key = L.font + L.w; if (MET[key]) return MET[key];
    var m = { d: .62, s: .32 };
    try {
      var c = document.createElement("canvas").getContext("2d"), mx = 0; c.font = L.w + " 100px " + L.font;
      for (var i = 0; i < 10; i++) mx = Math.max(mx, c.measureText(String(i)).width);
      if (mx > 10) { m.d = mx / 100 + .015; m.s = Math.max(c.measureText(":").width, c.measureText(".").width) / 100 + .05; }
    } catch (e) {}
    return (MET[key] = m);
  }
  var cells = function (t, m) { var w = 0; for (var i = 0; i < t.length; i++) w += /\d/.test(t[i]) ? m.d : m.s; return w; };
  var pattern = function (t) { return t.replace(/\d/g, "0"); };
  function setDigits(el, text) {
    if (el._t === text) return;
    var old = el._t || "";
    if (old.length !== text.length || pattern(old) !== pattern(text)) el.innerHTML = text.split("").map(function (ch) { return '<span class="' + (/\d/.test(ch) ? "d" : "s") + '">' + ch + "</span>"; }).join("");
    else for (var i = 0; i < text.length; i++) if (old[i] !== text[i]) el.children[i].textContent = text[i];
    el._t = text;
  }
  var TPL = {
    stopwatch: '<div class="tf-main"><div class="tf-time"><span class="tf-mn"></span><span class="tf-fr"></span></div><p class="tf-line"></p></div><ol class="tf-laps"></ol>',
    countdown: '<div class="tf-glow"></div><svg class="tf-ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="tf-track" cx="50" cy="50" r="47"/><circle class="tf-arc" cx="50" cy="50" r="47" transform="rotate(-90 50 50)"/></svg>'
      + '<div class="tf-main"><p class="tf-top"></p><div class="tf-time"><span class="tf-mn"></span></div><div class="tf-big"></div><p class="tf-line"></p></div><p class="tf-hint"></p>'
  };
  var faces = [];
  var relayout = function () { faces.forEach(function (f) { f.lay = ""; f.go(); }); };
  window.addEventListener("resize", relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { MET = {}; metV++; relayout(); });
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", function () { MET = {}; metV++; relayout(); });

  // opt: { w, h, T } a small fixed picture at a fixed time; tv: the real screen; now(): the TV's time (the phone's copy)
  function Face(host, kind, opt) {
    this.host = host; this.kind = kind; this.opt = opt || {}; this.S = null; this.r = null; this.lay = ""; this.tm = 0; this.raf = 0; this.snd = true; this.last = 0;
    host.classList.add("tf"); host.classList.add("tf-" + kind); host.classList.add("tf-still");
    if (this.opt.w) { host.style.width = this.opt.w + "px"; host.style.height = this.opt.h + "px"; }
    host.innerHTML = TPL[kind] + (this.opt.tv ? '<p class="tf-snd" hidden>Press OK on your remote for sound</p>' : "");
    var q = function (s) { return host.querySelector(s); }, e = this.e = {};
    ["main", "time", "mn", "fr", "line", "top", "big", "laps", "ring", "arc", "track", "glow", "hint", "snd"].forEach(function (k) { e[k] = q(".tf-" + k); });
    if (!this.opt.w) faces.push(this);
  }
  Face.prototype.set = function (S) {
    this.S = S; var L = LOOKS[S.look] || LOOKS.night, st = this.host.style;
    st.setProperty("--bg", L.bg); st.setProperty("--ink", L.ink); st.setProperty("--sub", L.sub2); st.setProperty("--acc", L.acc); st.setProperty("--track", L.track);
    st.setProperty("--font", L.font); st.setProperty("--w", L.w); st.setProperty("--tw", L.tw); st.setProperty("--glow", alpha(L.acc, L.kids ? .55 : .42));
    st.background = L.bg; this.host.classList.toggle("tf-kids", !!L.kids);
    this.lay = "";
  };
  Face.prototype.state = function (r) { this.r = r; this.lay = ""; };
  Face.prototype.sound = function (on) { this.snd = on; if (this.e.snd) this.e.snd.hidden = on || this.kind === "stopwatch"; };
  Face.prototype.now = function () { return this.opt.T || (this.opt.now ? this.opt.now() : Date.now()); };
  Face.prototype.size = function () { return [this.opt.w || this.host.clientWidth, this.opt.h || this.host.clientHeight]; };
  // draw now, and again when something will change (every frame for a running stopwatch, each second or minute otherwise)
  Face.prototype.go = function () {
    var self = this; clearTimeout(this.tm); if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0;
    if (!this.S || !this.r) return;
    var wait = this[this.kind](this.now());
    if (wait === 0) this.raf = requestAnimationFrame(function (t) { self.raf = 0; if (t - self.last < 30) { self.raf = requestAnimationFrame(function () { self.go(); }); return; } self.last = t; self.go(); });
    else if (wait > 0) this.tm = setTimeout(function () { self.go(); }, wait);
  };
  // the block in the middle: centred at (x, y) (no measuring: the small pictures are drawn before they are on the page)
  Face.prototype.place = function (x, y) {
    var m = this.e.main, tf = "translate(" + Math.round(x) + "px," + Math.round(y) + "px) translate(-50%,-50%)";
    m.style.webkitTransform = tf; m.style.transform = tf;
    var host = this.host; if (host.classList.contains("tf-still")) setTimeout(function () { host.classList.remove("tf-still"); }, 50);
  };
  var unit = function (W, H) { return Math.min(H, W * 9 / 16); };
  var px = function (n) { return Math.max(1, Math.round(n * 10) / 10) + "px"; };

  // -- Stopwatch: minutes, seconds and hundredths; laps beside it (or below it on a tall screen), the newest on top --
  Face.prototype.stopwatch = function (T) {
    var S = this.S, r = this.r, e = this.e, sz = this.size(), W = sz[0], H = sz[1]; if (!W || !H) return -1;
    var L = LOOKS[S.look] || LOOKS.night, el = SW.el(r, T), t = fmtSW(el, S.hund), lapsOn = S.laps && r.laps.length > 0, wide = W / H > 1.15, u = unit(W, H);
    var key = [W, H, S.look, S.hund, lapsOn, pattern(t.main), r.laps.length, metV].join();
    setDigits(e.mn, t.main); setDigits(e.fr, t.frac);
    var line = !r.on && el > 0 ? "Paused" : "";
    if (e.line.textContent !== line) e.line.textContent = line;
    if (key !== this.lay) {
      this.lay = key; var m = metric(L), em = cells(t.main, m) + (S.hund ? .5 * cells(t.frac, m) : 0);
      var fs = Math.min((lapsOn ? (wide ? W * .46 : W * .84) : W * .84) / em, H * (lapsOn && !wide ? .24 : .4));
      this.host.style.setProperty("--dw", m.d + "em"); this.host.style.setProperty("--sw", m.s + "em");
      e.time.style.fontSize = px(fs); e.line.style.fontSize = px(Math.max(u * .036, fs * .11)); e.line.style.marginTop = px(fs * .1);
      // the laps: as many as fit, the lap running now first (quiet), the best lap in the look's colour
      var n = r.laps.length;
      e.laps.hidden = !lapsOn;
      if (lapsOn) {
        var colW = wide ? W * .3 : W * .7, rfs = Math.min(u * .05, colW / 10.5), rows = Math.max(2, Math.min(8, Math.floor((wide ? H * .74 : H * .5) / (rfs * 1.95)))), durs = [], best = -1;
        for (var i = 0; i < n; i++) durs.push(r.laps[i] - (i ? r.laps[i - 1] : 0));
        if (n >= 3) { best = 0; durs.forEach(function (d, i) { if (d < durs[best]) best = i; }); }
        var html = '<li class="tf-cur"><span class="tf-ln">Lap ' + (n + 1) + '</span><span class="tf-lt"></span></li>';
        for (var j = n - 1; j >= Math.max(0, n - rows + 1); j--) html += '<li class="' + (j === best ? "tf-best" : "") + (j === n - 1 && n > (this.nLaps || 0) && this.nLaps !== undefined ? " tf-in" : "") + '"><span class="tf-ln">Lap ' + (j + 1) + '</span><span class="tf-lt"></span></li>';
        e.laps.innerHTML = html; e.laps.style.fontSize = px(rfs); e.laps.style.width = px(colW); this.lapsH = e.laps.children.length * rfs * 1.95;
        var lis = e.laps.children;
        for (var k = 1; k < lis.length; k++) { var d = durs[n - k], f = fmtSW(d, S.hund); setDigits(lis[k].lastChild, f.main + f.frac); }
        this.curLap = lis[0].lastChild; this.curLap._t = null;
      }
      this.nLaps = n;
      var x = lapsOn && wide ? W * .31 : W / 2, y = lapsOn && !wide ? H * .3 : H / 2;
      this.place(x, y);
      if (lapsOn) {
        var lh = this.lapsH, lt = wide ? (H - lh) / 2 : H * .3 + fs * .62 + u * .05, ll = wide ? W * .6 : (W - colW) / 2;
        e.laps.style.left = px(ll); e.laps.style.top = px(Math.max(u * .04, lt));
      }
    }
    if (lapsOn && this.curLap) { var c = fmtSW(el - r.laps[r.laps.length - 1], S.hund); setDigits(this.curLap, c.main + c.frac); }
    if (!this.opt.w) this.host.setAttribute("aria-label", "Stopwatch " + t.main + t.frac + (line ? ", paused" : ""));
    return r.on && !this.opt.w ? 0 : -1;
  };

  // -- Countdown: a calm ring that empties, the time left in the middle; the last ten seconds a single number; at zero, a glow --
  Face.prototype.countdown = function (T) {
    var S = this.S, r = this.r, e = this.e, sz = this.size(), W = sz[0], H = sz[1]; if (!W || !H) return -1;
    var L = LOOKS[S.look] || LOOKS.night, left = CD.left(r, T), st = r.st, fin = st === "done", ten = st === "run" && left > 0 && left <= 10000, u = unit(W, H);
    var key = [W, H, S.look, S.ring, S.ends, pattern(fmtCD(Math.max(r.dur, left))), st, ten, metV].join();
    if (key !== this.lay) {
      this.lay = key; var m = metric(L), D = Math.min(H * .78, W * .84), ringOn = S.ring, sw = L.ring, rad = 50 - sw / 2 - .4;
      this.host.style.setProperty("--dw", m.d + "em"); this.host.style.setProperty("--sw", m.s + "em");
      e.ring.style.display = ringOn ? "" : "none";
      e.ring.style.width = e.ring.style.height = px(D); e.ring.style.left = px((W - D) / 2); e.ring.style.top = px((H - D) / 2);
      [e.arc, e.track].forEach(function (c) { c.setAttribute("r", rad.toFixed(2)); c.setAttribute("stroke-width", sw); });
      this.C = 2 * Math.PI * rad; e.arc.setAttribute("stroke-dasharray", this.C.toFixed(2));
      var em = cells(fmtCD(Math.max(r.dur, left)), m), avail = ringOn ? D * .64 : W * .78;
      var fs = this.fs = Math.min(avail / em, ringOn ? D * .3 : H * .4);
      e.time.style.fontSize = px(fs);
      var small = Math.max(u * .034, fs * .13);
      e.top.style.fontSize = e.line.style.fontSize = px(small); e.top.style.marginBottom = px(fs * .1); e.line.style.marginTop = px(fs * .12);
      e.big.style.fontSize = px(fin ? Math.min(fs * .6, avail / 4.6) : Math.min(fs * 1.5, (ringOn ? D : H) * .5));
      e.time.style.display = ten || fin ? "none" : ""; e.big.style.display = ten || fin ? "" : "none";
      this.host.classList.toggle("tf-ten", ten); this.host.classList.toggle("tf-fin", fin);
      e.glow.className = "tf-glow" + (fin ? " on" : "");
      e.hint.style.fontSize = px(u * .03); e.hint.textContent = fin && !this.opt.w ? "Press OK on your remote to stop" : "";
      if (e.snd) e.snd.style.fontSize = px(u * .026);
      this.arcAt = -1;
    }
    setDigits(e.mn, fmtCD(left));
    var big = fin ? "Time's up" : ten ? String(Math.ceil(left / 1000)) : "";
    if (e.big.textContent !== big) { e.big.textContent = big; if (ten && !calm()) { e.big.classList.remove("tf-pulse"); void e.big.offsetWidth; e.big.classList.add("tf-pulse"); } }
    var top = fin ? "" : durWords(r.dur), line = st === "idle" ? "Ready" : st === "pause" ? "Paused" : fin ? "Ended at " + clockAt(r.at) : S.ends ? "Ends at " + clockAt(r.end) : "";
    if (e.top.textContent !== top) e.top.textContent = top;
    if (e.line.textContent !== line) e.line.textContent = line;
    var place = [Math.round(W), Math.round(H), top ? 1 : 0, line ? 1 : 0, big.length].join();
    if (this.placed !== place || this.lay !== this.placedLay) { this.placed = place; this.placedLay = this.lay; this.place(W / 2, H / 2); }
    // the ring: where it is now, and a smooth run to where it will be at the next second (cheap: one transition a second)
    var p = fin || st === "idle" ? 1 : r.dur ? Math.min(1, left / r.dur) : 0, wait = st === "run" ? ((left - 1) % 1000) + 1 + 4 : -1, C = this.C, arc = e.arc;
    if (S.ring) {
      arc.style.transition = "none"; arc.style.strokeDashoffset = (C * (1 - p)).toFixed(2) + "px";
      if (st === "run" && !calm() && !this.opt.w) { arc.getBoundingClientRect(); var p2 = Math.max(0, left - wait + 4) / r.dur; arc.style.transition = "stroke-dashoffset " + (wait - 4) + "ms linear"; arc.style.strokeDashoffset = (C * (1 - p2)).toFixed(2) + "px"; }
    }
    if (!this.opt.w) this.host.setAttribute("aria-label", fin ? "Countdown finished" : "Countdown " + fmtCD(left) + " left" + (st === "pause" ? ", paused" : ""));
    return this.opt.w ? -1 : wait;
  };

  return { APP: APP, clean: clean, RUN: { stopwatch: SW, countdown: CD }[APP], SW: SW, CD: CD, Face: Face, Sound: Sound, question: question, tones: tones,
    LOOKS: LOOKS, LOOK_IDS: LOOK_IDS, TONE_IDS: TONE_IDS, fmtSW: fmtSW, fmtCD: fmtCD, durWords: durWords, clockAt: clockAt,
    copy: copy, rid: rid, two: two, calm: calm, int: int, MAXD: MAXD, relayout: relayout };
};
