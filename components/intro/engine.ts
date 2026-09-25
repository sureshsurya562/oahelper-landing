/**
 * Camera model and render loop for the cinematic intro (student at the desk → into the monitor).
 *
 * Every layer is a flat card at a depth; the camera dollies toward the monitor so that at
 * p = 1 its screen exactly fills the viewport. Cards scale by focal / (depth − camera), so
 * nearer layers grow faster and the parallax is real.
 *
 * Timeline (p):
 * 0.00–0.20  scene leans with the mouse; the OAHELPER wordmark behind the meadow and the
 *            scroll cue fade
 * 0.24–0.50  monitor turns on showing the hero's first frame, a soft blue glow spreads
 * 0.30–0.76  the student rises out of frame, blurs and fades as the camera passes him
 * 0.55–0.92  background then desk defocus, a vignette closes in, pollen streams past
 * 0.80–0.975 pixel stripes, colour fringing and a short bloom as the camera meets the glass
 * 0.955–1.00 the real hero fades in on top of the screen, pinned to it, then takes over
 */

export const SCENE_W = 1672;
export const SCENE_H = 941;
/** The monitor's glass in master-image pixels. */
const SCREEN = { x: 729, y: 442, w: 184, h: 75 };
const M = { x: SCREEN.x + SCREEN.w / 2, y: SCREEN.y + SCREEN.h / 2 };

type Rect = { x: number; y: number; w: number; h: number; res: number };
const LAYERS: Record<LayerKey, Rect> = {
  bg: { x: 0, y: 0, w: 1672, h: 941, res: 1 },
  plate: { x: 0, y: 435, w: 1672, h: 506, res: 1 },
  focus: { x: 596, y: 378, w: 452, h: 256, res: 4 },
  student: { x: 740, y: 390, w: 181, h: 228, res: 4 },
  /** The OAHELPER wordmark card: full-scene sized, set between the sky and the meadow. */
  brand: { x: 0, y: 0, w: 1672, h: 941, res: 1 },
};
const MOBILE_RES: Record<LayerKey, number> = { bg: 0.5980861244019139, plate: 0.5980861244019139, focus: 2, student: 2, brand: 1 };
/** Depth of the wordmark: behind the meadow plate (z = 1), in front of the sky. */
const Z_BRAND = 1.45;

export type Tier = "desktop" | "tablet" | "mobile";
export const TIERS: Record<Tier, { sectionVh: number; zBg: number; zStudent: number; rise: number; mouse: number; particles: number; smoothing: number }> = {
  desktop: { sectionVh: 300, zBg: 2.4, zStudent: 0.83, rise: 150, mouse: 1, particles: 70, smoothing: 0.085 },
  tablet: { sectionVh: 265, zBg: 1.9, zStudent: 0.85, rise: 140, mouse: 0.6, particles: 40, smoothing: 0.08 },
  mobile: { sectionVh: 225, zBg: 1.55, zStudent: 0.87, rise: 130, mouse: 0, particles: 18, smoothing: 0.07 },
};

export function pickTier(w: number, h: number, coarse: boolean): Tier {
  if (w < 700 || (coarse && Math.min(w, h) < 600)) return "mobile";
  if (w < 1100 || coarse) return "tablet";
  return "desktop";
}

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const bump = (a: number, b: number, c: number, v: number) => (v <= b ? smoothstep(a, b, v) : 1 - smoothstep(b, c, v));

/** Camera distance over p: slow start, fast middle, soft landing (monotone cubic through the keys). */
const KEYS: [number, number][] = [
  [0, 0],
  [0.15, 0.035],
  [0.3, 0.15],
  [0.45, 0.32],
  [0.6, 0.5],
  [0.72, 0.655],
  [0.82, 0.8],
  [0.9, 0.905],
  [0.96, 0.975],
  [1, 1],
];
const TAN = (() => {
  const n = KEYS.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((KEYS[i + 1][1] - KEYS[i][1]) / (KEYS[i + 1][0] - KEYS[i][0]));
  const m = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return m;
})();
function dolly(p: number) {
  p = clamp(p);
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
  const [x0, y0] = KEYS[i];
  const [x1, y1] = KEYS[i + 1];
  const h = x1 - x0;
  const t = (p - x0) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h * TAN[i] + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h * TAN[i + 1];
}

type Geo = { vw: number; vh: number; c: number; kEnd: number; sEnd: number; box: { x: number; y: number; w: number; h: number } };
function geometry(vw: number, vh: number): Geo {
  const c = Math.max(vw / (2 * Math.min(M.x, SCENE_W - M.x)), vh / (2 * Math.min(M.y, SCENE_H - M.y))) * 1.025;
  const aspect = vw / vh;
  const sAspect = SCREEN.w / SCREEN.h;
  const bw = aspect > sAspect ? SCREEN.w : SCREEN.h * aspect;
  const bh = aspect > sAspect ? SCREEN.w / aspect : SCREEN.h;
  const box = { x: M.x - bw / 2, y: M.y - bh / 2, w: bw, h: bh };
  const kEnd = vw / bw;
  return { vw, vh, c, kEnd, sEnd: Math.max(kEnd / c, 1.001), box };
}
type Cam = { s: number; cz: number; rise: number };
function camera(p: number, g: Geo, rise: number): Cam {
  const s = Math.pow(g.sEnd, dolly(p));
  return { s, cz: 1 - 1 / s, rise: -rise * smoothstep(0.3, 0.76, p) };
}
function cardTransform(r: { x: number; y: number }, res: number, z: number, cam: Cam, g: Geo, offX = 0, offY = 0, rise = 0) {
  const denom = Math.max(z - cam.cz, 0.012);
  const K = g.c * (z / denom);
  return {
    tx: g.vw / 2 + K * (r.x - M.x) + offX,
    ty: g.vh / 2 + K * (r.y - M.y) - (g.c * rise) / denom + offY,
    scale: K / res,
  };
}

/* ---------------------------------------------------------------- motes */
type Mote = { x: number; y: number; z0: number; ph: number; sz: number };
const NEAR = 0.07;
const RANGE = 1.15;
const FLOW = 1.35;
const frac = (v: number) => v - Math.floor(v);
function makeMotes(n: number, seed = 11): Mote[] {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: n }, () => ({ x: rnd() * 2 - 1, y: rnd() * 1.6 - 0.65, z0: rnd(), ph: rnd() * Math.PI * 2, sz: 0.6 + rnd() * 0.9 }));
}
function sprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,236,200,1)");
  grd.addColorStop(0.25, "rgba(255,208,140,0.55)");
  grd.addColorStop(1, "rgba(255,190,120,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return c;
}
class MoteField {
  ctx: CanvasRenderingContext2D;
  spr = sprite();
  w = 0;
  h = 0;
  dpr = 1;
  constructor(
    private canvas: HTMLCanvasElement,
    private motes: Mote[],
  ) {
    this.ctx = canvas.getContext("2d")!;
  }
  resize(w: number, h: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
  }
  depth(m: Mote, cz: number) {
    return NEAR + RANGE * frac(m.z0 - cz * FLOW);
  }
  draw(cz: number, czPrev: number, t: number, alpha: number, mx: number, my: number) {
    const { ctx, w, h, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (alpha <= 0.002) return;
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    const cx = w / 2;
    const cy = h / 2;
    const sx = w * 0.5;
    const sy = h * 0.5;
    for (const m of this.motes) {
      const z = this.depth(m, cz);
      const zp = this.depth(m, czPrev);
      const wx = m.x + 0.03 * Math.sin(t * 0.21 + m.ph);
      const wy = m.y + 0.025 * Math.cos(t * 0.17 + m.ph) - ((t * 0.004) % 0.2);
      const par = 0.45 / z;
      const px = cx + (wx * sx) / z - mx * 8 * par;
      const py = cy + (wy * sy) / z - my * 6 * par;
      if (px < -60 || px > w + 60 || py < -60 || py > h + 60) continue;
      const a = alpha * smoothstep(NEAR + RANGE, NEAR + RANGE * 0.72, z) * smoothstep(NEAR, NEAR + 0.16, z) * 0.85;
      if (a < 0.01) continue;
      const r = Math.min(9, (m.sz * 1.1) / z);
      const wrapped = Math.abs(z - zp) > RANGE * 0.5;
      const qx = cx + (wx * sx) / zp - mx * 8 * (0.45 / zp);
      const qy = cy + (wy * sy) / zp - my * 6 * (0.45 / zp);
      const len = wrapped ? 0 : Math.hypot(px - qx, py - qy);
      if (len > r * 1.2) {
        ctx.globalAlpha = a * Math.min(1, (r * 3) / len) * 0.9;
        ctx.strokeStyle = "rgba(255,214,160,1)";
        ctx.lineWidth = Math.max(0.8, r * 0.7);
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(px, py);
        ctx.stroke();
      } else {
        ctx.globalAlpha = a;
        const d = r * 2.6;
        ctx.drawImage(this.spr, px - d / 2, py - d / 2, d, d);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/* ---------------------------------------------------------------- loop */
type LayerKey = "bg" | "brand" | "plate" | "focus" | "student";
const DEPTH: LayerKey[] = ["bg", "brand", "plate", "focus", "student"];

export type IntroNodes = {
  section: HTMLElement;
  stage: HTMLElement;
  layers: Record<LayerKey, HTMLElement>;
  blurs: { bg: HTMLElement; focus: HTMLElement; student: HTMLElement };
  screen: HTMLElement;
  screenBox: HTMLElement;
  glow: HTMLElement;
  shade: HTMLElement;
  bloom: HTMLElement;
  cue: HTMLElement;
  canvas: HTMLCanvasElement;
  /** The real hero. It sits right under the intro's last screen and is pinned onto the glass for the handoff. */
  live: HTMLElement | null;
};

export function mountIntro(o: IntroNodes, tier: Tier): () => void {
  const { section, stage, layers, blurs, screen, screenBox, glow, shade, bloom, cue, canvas, live } = o;
  const cfg = TIERS[tier];
  const resOf = (k: LayerKey) => (tier === "mobile" ? MOBILE_RES[k] : LAYERS[k].res);

  let g = geometry(stage.clientWidth || 1, stage.clientHeight || 1);
  const field = cfg.particles > 0 ? new MoteField(canvas, makeMotes(cfg.particles)) : null;
  let letters: HTMLElement[] = [];

  const sizeLayers = () => {
    g = geometry(stage.clientWidth || 1, stage.clientHeight || 1);
    for (const k of DEPTH) {
      layers[k].style.width = `${LAYERS[k].w * resOf(k)}px`;
      layers[k].style.height = `${LAYERS[k].h * resOf(k)}px`;
    }
    // Fit the wordmark to the visible crop, centred on the camera axis.
    const visW = g.vw / g.c;
    const bs = layers.brand.style;
    bs.setProperty("--bw", visW.toFixed(1));
    bs.setProperty("--bcx", (M.x - LAYERS.brand.x).toFixed(1));
    letters = Array.from(layers.brand.querySelectorAll<HTMLElement>("[data-l]"));
    screen.style.width = `${SCREEN.w * g.kEnd}px`;
    screen.style.height = `${SCREEN.h * g.kEnd}px`;
    screen.style.setProperty("--intro-r", `${1.6 * g.kEnd}px`);
    screenBox.style.left = `${(g.box.x - SCREEN.x) * g.kEnd}px`;
    screenBox.style.top = `${(g.box.y - SCREEN.y) * g.kEnd}px`;
    screenBox.style.width = `${g.vw}px`;
    screenBox.style.height = `${g.vh}px`;
    field?.resize(g.vw, g.vh);
  };

  let last = new WeakMap<HTMLElement, Record<string, string>>();
  const set = (el: HTMLElement, prop: string, v: string) => {
    let m = last.get(el);
    if (!m) {
      m = {};
      last.set(el, m);
    }
    if (m[prop] === v) return;
    m[prop] = v;
    el.style.setProperty(prop, v);
  };
  const tf = (x: number, y: number, s: number) => `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${s.toFixed(5)})`;

  let p = 0;
  let pPrev = 0;
  let vel = 0;
  let czPrev = 0;
  let mx = 0;
  let my = 0;
  let tmx = 0;
  let tmy = 0;
  // Wordmark hover: hh eases toward thh (cursor over the word), hx/hy toward where on it.
  let hh = 0;
  let thh = 0;
  let hx = 0;
  let hy = 0;
  let thx = 0;
  let thy = 0;
  const t0 = performance.now();

  // p reaches 1 exactly when the intro's track runs out, which is where the hero's top meets the viewport.
  const target = () => {
    const rect = section.getBoundingClientRect();
    const travel = rect.height - stage.clientHeight;
    return travel > 0 ? clamp(-rect.top / travel) : 0;
  };

  const render = (pp: number, t: number) => {
    const cam = camera(pp, g, cfg.rise);
    const amp = cfg.mouse * (1 - smoothstep(0.02, 0.2, pp));
    const ox = -mx * amp;
    const oy = -my * amp;
    const card = (k: LayerKey, z: number, par: number, rise = 0) => {
      const T = cardTransform(LAYERS[k], resOf(k), z, cam, g, ox * par, oy * par, rise);
      set(layers[k], "transform", tf(T.tx, T.ty, T.scale));
    };
    card("bg", cfg.zBg, 3);
    card("brand", Z_BRAND, 0);
    const bo = 1 - smoothstep(0.03, 0.22, pp);
    set(layers.brand, "opacity", bo.toFixed(3));
    set(layers.brand, "visibility", bo < 0.001 ? "hidden" : "visible");
    // Letters lean toward the cursor: nearby ones lift and tilt, the whole word drifts with it.
    const n = letters.length;
    for (let i = 0; i < n; i++) {
      const pos = ((i - (n - 1) / 2) / ((n - 1) / 2)) * 0.9;
      const prox = Math.max(0, 1 - Math.abs(hx - pos) * 1.7);
      const pk = prox * prox * (3 - 2 * prox);
      const lx = hh * (-hx * 22 + (hx - pos) * pk * 14);
      const ly = hh * (-hy * 12 - pk * 34);
      const rx = hh * (-hy * 10 - pk * 8);
      const ry = hh * (hx * 16 + (hx - pos) * pk * 10);
      set(
        letters[i],
        "transform",
        hh < 0.0005
          ? "none"
          : `translate3d(${lx.toFixed(2)}px,${ly.toFixed(2)}px,0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${(1 + hh * pk * 0.06).toFixed(4)})`,
      );
    }
    card("plate", 1, 5);
    card("focus", 1, 5);
    card("student", cfg.zStudent, 7, cam.rise);

    const S = cardTransform(SCREEN, g.kEnd, 1, cam, g, ox * 5, oy * 5);
    set(screen, "transform", tf(S.tx, S.ty, S.scale));

    const mb = clamp((Math.abs(vel) - 0.35) / 1.4) * 0.55;
    const screenOn = smoothstep(0.24, 0.5, pp);
    const studentOut = smoothstep(0.54, 0.7, pp);
    set(screen, "opacity", screenOn.toFixed(3));
    set(glow, "opacity", (screenOn * (0.35 + 0.65 * smoothstep(0.45, 0.9, pp))).toFixed(3));
    set(blurs.bg, "opacity", Math.max(smoothstep(0.55, 0.86, pp), mb).toFixed(3));
    set(blurs.focus, "opacity", Math.max(smoothstep(0.7, 0.92, pp) * 0.92, mb * 0.8).toFixed(3));
    set(blurs.student, "opacity", Math.max(smoothstep(0.44, 0.66, pp), mb).toFixed(3));
    set(layers.student, "opacity", (1 - studentOut).toFixed(3));
    set(layers.student, "visibility", studentOut > 0.999 ? "hidden" : "visible");
    set(shade, "opacity", (smoothstep(0.58, 0.94, pp) * 0.92).toFixed(3));
    set(bloom, "opacity", (bump(0.86, 0.935, 0.99, pp) * 0.42).toFixed(3));
    set(cue, "opacity", (1 - smoothstep(0.004, 0.045, pp)).toFixed(3));

    const st = stage.style;
    st.setProperty("--intro-ca", bump(0.83, 0.915, 0.975, pp).toFixed(3));
    st.setProperty("--intro-px", (bump(0.8, 0.9, 0.955, pp) * 0.2).toFixed(3));
    st.setProperty("--intro-glass", (1 - smoothstep(0.78, 0.93, pp)).toFixed(3));

    const lv = smoothstep(0.955, 0.995, pp);
    const landed = lv > 0.999;
    if (live) {
      // The hero's box starts right where the intro's last screen does; pin it onto the glass until p = 1.
      const done = pp >= 0.9999;
      const top = section.getBoundingClientRect().bottom - stage.clientHeight;
      const bx = S.tx + (g.box.x - SCREEN.x) * g.kEnd * S.scale;
      const by = S.ty + (g.box.y - SCREEN.y) * g.kEnd * S.scale;
      set(live, "opacity", lv.toFixed(3));
      set(live, "transform", done ? "none" : tf(bx, by - top, S.scale));
      set(live, "clip-path", done ? "none" : `inset(0 0 calc(100% - ${g.vh}px) 0)`);
      set(live, "pointer-events", lv > 0.9 ? "auto" : "none");
    }
    set(stage, "visibility", landed ? "hidden" : "visible");
    if (landed) section.dataset.landed = "";
    else delete section.dataset.landed;

    field?.draw(cam.cz, czPrev, t, 1 - smoothstep(0.66, 0.84, pp), mx * amp, my * amp);
    czPrev = cam.cz;
  };

  sizeLayers();
  p = pPrev = target();
  render(p, 0);

  let raf = 0;
  let visible = true;
  let lastT = performance.now();
  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(0.1, Math.max(0.001, (now - lastT) / 1000));
    lastT = now;
    const tgt = target();
    const k = 1 - Math.exp(-dt / cfg.smoothing);
    const maxStep = 2.2 * dt;
    p += clamp((tgt - p) * k, -maxStep, maxStep);
    if (Math.abs(tgt - p) < 0.00005) p = tgt;
    const v = (p - pPrev) / dt;
    vel += (v - vel) * Math.min(1, dt * 12);
    pPrev = p;
    hh += (thh - hh) * Math.min(1, dt * 6);
    if (Math.abs(thh - hh) < 0.0005) hh = thh;
    hx += (thx - hx) * Math.min(1, dt * 8);
    hy += (thy - hy) * Math.min(1, dt * 8);
    mx += (tmx - mx) * Math.min(1, dt * 4);
    my += (tmy - my) * Math.min(1, dt * 4);
    render(p, (now - t0) / 1000);
    const settled =
      p === tgt &&
      Math.abs(vel) < 0.001 &&
      Math.abs(tmx - mx) < 0.001 &&
      Math.abs(tmy - my) < 0.001 &&
      hh === thh &&
      Math.abs(thx - hx) < 0.001 &&
      Math.abs(thy - hy) < 0.001;
    // The motes drift on their own, so the loop keeps running while they are on screen.
    if ((visible && field && p < 0.85) || !settled) raf = requestAnimationFrame(tick);
  };
  const kick = () => {
    if (!raf) {
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };

  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    },
    { rootMargin: "120px" },
  );
  io.observe(section);
  const ro = new ResizeObserver(() => {
    sizeLayers();
    last = new WeakMap();
    render(p, (performance.now() - t0) / 1000);
    kick();
  });
  ro.observe(stage);
  const onScroll = () => kick();
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    tmx = (e.clientX / window.innerWidth) * 2 - 1;
    tmy = (e.clientY / window.innerHeight) * 2 - 1;
    const word = layers.brand.querySelector("h1");
    if (word && layers.brand.style.visibility !== "hidden") {
      const r = word.getBoundingClientRect();
      const pad = 24;
      const inside = e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
      thh = inside ? 1 : 0;
      if (inside) {
        thx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
        thy = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
      }
    } else thh = 0;
    kick();
  };
  const onDocLeave = () => {
    thh = 0;
    kick();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  if (cfg.mouse > 0) {
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocLeave);
  }
  kick();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointer);
    document.documentElement.removeEventListener("mouseleave", onDocLeave);
    field?.clear();
    if (live) {
      for (const prop of ["opacity", "transform", "clip-path", "pointer-events"]) live.style.removeProperty(prop);
    }
    stage.style.removeProperty("visibility");
  };
}
