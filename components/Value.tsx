"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { LandingData } from "@/lib/types";

/**
 * See · Solve · Clear — ported from the "Cinematic OA Hero" design file.
 *
 * Scroll map (0 → 1 across the sticky stage):
 * 0.00–0.12  the object rises and settles, its screen showing "OA"
 * 0.12–0.49  See, then Solve, then Clear pop in around it; the screen and the
 *            inner plate change face and colour on each step
 * 0.54–0.62  the words lift away
 * 0.62–0.76  the sticker caption lands
 * then the bento overlaps the tail of the stage and reveals card by card.
 */

const COMPANIES: [string, string][] = [
  ["Google", "#bfe7c7"],
  ["Microsoft", "#c6dbf3"],
  ["Amazon", "#f7d3b5"],
  ["Meta", "#d9cdf4"],
  ["Adobe", "#f5baae"],
  ["Atlassian", "#b7dcf6"],
  ["Uber", "#f3e9a8"],
  ["Walmart", "#b4eae8"],
  ["Deloitte", "#d7ee9f"],
  ["Flipkart", "#c4c9f5"],
  ["Goldman Sachs", "#d4e2f4"],
  ["JPMorgan", "#e3d7f0"],
];

/** Where each word sits, in multiples of the object's size. */
const WORD_SPOTS = [
  { x: -1.0, y: -0.62, r: -8 },
  { x: 1.1, y: -0.04, r: 6 },
  { x: -0.8, y: 0.74, r: -4 },
];

/** Resting offsets of the three fanned question cards. */
const FAN_SPOTS = [
  { x: -150, y: 26, r: -11 },
  { x: 150, y: 22, r: 10 },
  { x: 0, y: -6, r: -2 },
];

/** The inner plate cross-fades through these as the screen changes face. */
const PLATES: [number, number, number][] = [
  [217, 205, 244],
  [198, 219, 243],
  [247, 211, 181],
  [191, 231, 199],
];
const PLATE_KEYS = [0.08, 0.2, 0.34, 0.48];

const CAL_MARKS: Record<number, string> = { 6: "#f7d3b5", 9: "#bfe7c7", 14: "#c6dbf3", 21: "#d7ee9f", 27: "#c4c9f5" };

const BARS = [
  { label: "Arrays", pct: 34, color: "#f7d3b5" },
  { label: "Graphs", pct: 22, color: "#c6dbf3" },
  { label: "DP", pct: 18, color: "#d9cdf4" },
  { label: "Strings", pct: 14, color: "#bfe7c7" },
  { label: "Math", pct: 12, color: "#f3e9a8" },
];

type Rail = { title: string; line: string; art: ReactNode };

function buildRail(data: LandingData): Rail[] {
  const up = data.upcoming.length ? data.upcoming : [];
  const groupCount = up[0]?.questionCount ? `${up[0].questionCount * 38}+` : "1,800+";

  return [
    {
      title: "Company-wise Patterns",
      line: "See which topics each company tests most, and prepare for those first.",
      art: (
        <>
          <div className="ss-art-head">
            <span className="ss-co" style={{ background: "#f7d3b5", color: "#22190f" }}>
              Amazon
            </span>
            <span className="ss-when">last 40 OAs</span>
          </div>
          {BARS.map((b) => (
            <div className="ss-bar" key={b.label}>
              <span>{b.label}</span>
              <span className="ss-bar-track">
                <i data-bar={b.pct} style={{ background: b.color }} />
              </span>
              <span className="ss-bar-pct">{b.pct}%</span>
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Instant OA Alerts",
      line: "Get notified as soon as a new OA is scheduled for your college.",
      art: (
        <div className="ss-rounds" style={{ justifyContent: "center", flex: 1 }}>
          <div className="ss-toast is-now">
            <i style={{ background: "#c6dbf3" }}>OA</i>
            <span>
              <b>Microsoft OA link is live</b>
              <em>Closes in 2 hours</em>
            </span>
            <time>now</time>
          </div>
          <div className="ss-toast">
            <i style={{ background: "#d7ee9f", color: "#1a200f" }}>OA</i>
            <span>
              <b>Deloitte OA scheduled</b>
              <em>Tomorrow · 10:00 AM</em>
            </span>
            <time>2h</time>
          </div>
        </div>
      ),
    },
    {
      title: "Timed Mock OAs",
      line: "Practice in an exam-style editor with a timer and hidden test cases.",
      art: (
        <div className="ss-editor">
          <div className="ss-editor-bar">
            <span>Q2 of 3</span>
            <span className="ss-clock">
              <i />
              <span data-timer>44:59</span>
            </span>
          </div>
          <div className="ss-lines">
            <span style={{ width: "58%", background: "#c9b8f0", opacity: 0.75 }} />
            <span style={{ width: "74%", marginLeft: 14 }} />
            <span style={{ width: "40%", marginLeft: 14, background: "#a8dcb4", opacity: 0.75 }} />
            <span style={{ width: "62%", marginLeft: 28 }} />
            <span style={{ width: "30%", marginLeft: 14, background: "#f7d3b5", opacity: 0.75 }} />
          </div>
          <div className="ss-editor-foot">
            <span>Test cases</span>
            <span className="ss-pass">3 / 3 passed</span>
          </div>
        </div>
      ),
    },
    {
      title: "Real Screenshots",
      line: "The actual OA screen as students saw it, not somebody's rewrite.",
      art: (
        <div className="ss-shots">
          <span className="ss-shot-tag">Amazon OA · shared 3h ago</span>
          <i />
          <i className="lo" />
          <i />
          <i className="lo" />
          <i />
        </div>
      ),
    },
    {
      title: "Interview Experiences",
      line: "Round by round write-ups from students who already cleared it.",
      art: (
        <div className="ss-rounds">
          <div className="ss-round done">
            <i />
            Online Assessment<span>cleared</span>
          </div>
          <div className="ss-round done">
            <i />
            Tech Round 1<span>cleared</span>
          </div>
          <div className="ss-round now">
            <i />
            Tech Round 2<span>today</span>
          </div>
          <div className="ss-round">
            <i />
            HR Round<span>—</span>
          </div>
        </div>
      ),
    },
    {
      title: "60-Day DSA Roadmap",
      line: "Eighteen patterns, ordered by what OAs actually repeat.",
      art: (
        <div className="ss-road">
          <div className="done">
            Arrays &amp; Hashing<em>done</em>
          </div>
          <div className="done">
            Two Pointers<em>done</em>
          </div>
          <div>
            Sliding Window<em>day 12</em>
          </div>
          <div>
            Graphs<em>day 28</em>
          </div>
          <span className="ss-bar-track">
            <i data-bar="18" style={{ background: "#bfe7c7" }} />
          </span>
        </div>
      ),
    },
    {
      title: "Your Campus Numbers",
      line: "Drives, offers and cutoffs for your college, kept current by your batch.",
      art: (
        <div className="ss-figs">
          <div>
            <b>24</b>
            <span>drives</span>
          </div>
          <div>
            <b>312</b>
            <span>placed</span>
          </div>
          <div>
            <b>86%</b>
            <span>offers</span>
          </div>
        </div>
      ),
    },
    {
      title: "OA Groups",
      line: "Same-day intel from everyone else sitting the very same test.",
      art: (
        <>
          <div className="ss-faces">
            <i style={{ background: "#c6dbf3" }} />
            <i style={{ background: "#f7d3b5" }} />
            <i style={{ background: "#bfe7c7" }} />
            <i style={{ background: "#d9cdf4" }} />
          </div>
          <div className="ss-art-head">
            <span style={{ font: "500 14px/1.3 var(--ss-font)" }}>{groupCount} preparing for Amazon</span>
          </div>
          <p className="ss-quote">&ldquo;Graphs came twice in today&apos;s slot — revise BFS.&rdquo;</p>
        </>
      ),
    },
    {
      title: "Contribute & Earn",
      line: "Share one paper anonymously, unlock premium with OA Coins.",
      art: (
        <>
          <span className="ss-coin">+50 OA Coins</span>
          <p className="ss-quote">Posted anonymously · live in about an hour</p>
        </>
      ),
    },
  ];
}

export default function Value({ data }: { data: LandingData }) {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ ratio: 1, progress: 0 });
  const cards = buildRail(data);
  const company = data.hero?.company ?? "Amazon";

  const days: { n: string; bg: string; fg: string }[] = [];
  for (let i = 0; i < 3; i++) days.push({ n: "", bg: "transparent", fg: "transparent" });
  for (let d = 1; d <= 31; d++) {
    days.push(CAL_MARKS[d] ? { n: String(d), bg: CAL_MARKS[d], fg: "#151515" } : { n: String(d), bg: "#1c1c1e", fg: "#8a8a8e" });
  }

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const q = (s: string) => el.querySelector(s) as HTMLElement;
    const qa = (s: string) => Array.from(el.querySelectorAll(s)) as HTMLElement[];
    const E = {
      track: q(".ss-track"),
      stage: q(".ss-stage"),
      obj: q(".ss-obj"),
      tilt: q(".ss-tilt"),
      inner: q(".ss-inner"),
      shadow: q(".ss-shadow"),
      cap: q(".ss-cap"),
      bento: q(".ss-bento"),
      band: el.querySelector(".ss-band") as HTMLCanvasElement | null,
      big: q(".ss-card.is-big"),
      faces: qa(".ss-face"),
      words: qa(".ss-word"),
      slots: qa(".ss-slot"),
      fan: qa(".ss-fan"),
      fanbox: q(".ss-fanbox"),
      bars: qa("[data-bar]"),
      toasts: qa(".ss-toast"),
      chip: q(".ss-calchip"),
      marq: q(".ss-marq"),
      timer: q("[data-timer]"),
    };
    if (!E.track || !E.stage || !E.obj || E.words.length !== 3) return;

    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const rp = (a: number, b: number, p: number) => cl((p - a) / (b - a));
    const sm = (t: number) => t * t * (3 - 2 * t);
    const lp = (a: number, b: number, t: number) => a + (b - a) * t;
    // Slight overshoot, so each word lands like a stamp rather than a fade.
    const back = (t: number) => {
      const c1 = 2.2;
      return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) E.track.style.height = "100vh";
    E.bento.classList.add("is-armed");

    let S = 200;
    let wordSize: [number, number][] = [];
    let seed: number[] = [];
    let bandShift: number | null = null;
    let bandDirty = true;

    const layout = () => {
      const vw = E.stage.clientWidth || window.innerWidth;
      const vh = window.innerHeight;
      S = Math.max(130, Math.min(230, vw * 0.16, vh * 0.26));
      E.obj.style.width = E.obj.style.height = `${S}px`;
      wordSize = E.words.map((w) => [w.offsetWidth, w.offsetHeight]);
      // The caption sits just under the object; the bento then slides up to meet it.
      const capTop = 0.27 * vh + S * 0.62 * 0.5 + 44;
      E.cap.style.top = `${capTop}px`;
      E.bento.style.marginTop = `${-Math.max(0, vh - (capTop + E.cap.offsetHeight) - 64)}px`;
      bandDirty = true;
      // Seed the opening band so it is never blank before the first scroll tick.
      if (E.band) drawBand(E.band, bandShift ?? -0.2);
    };

    /** The dark page above breaks into pixels that thin out onto the paper. */
    const drawBand = (c: HTMLCanvasElement, shift: number) => {
      const w = c.clientWidth;
      const h = 220;
      if (!w) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const b = w < 640 ? 10 : 14;
      const cols = Math.ceil(w / b);
      const rows = Math.ceil(h / b);
      if (seed.length !== cols * rows) {
        let x = 1234567;
        const rnd = () => (x = (x * 16807) % 2147483647) / 2147483647;
        seed = Array.from({ length: cols * rows }, rnd);
      }
      const g = c.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      g.fillStyle = "#08080a";
      for (let r = 0; r < rows; r++) {
        const v = (r + 0.5) / rows;
        const amp = 0.85 * Math.sin(Math.PI * v);
        for (let k = 0; k < cols; k++) {
          if (v + (seed[r * cols + k] - 0.5) * amp + shift <= 0.55) g.fillRect(k * b, r * b, b, b);
        }
      }
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(E.stage);

    let fanNow = 0;
    let fanTo = 0;
    const spread = () => (fanTo = 1);
    const collapse = () => (fanTo = 0);
    E.big.addEventListener("mouseenter", spread);
    E.big.addEventListener("mouseleave", collapse);

    let marq = 0;
    let bump = 0;
    let lastStep = 0;
    const faceOp = [1, 0, 0, 0];
    let cur: number | null = null;
    let lastT = 0;
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - (lastT || now)) / 1000);
      lastT = now;
      const T = now / 1000;
      const vh = window.innerHeight;
      const vw = E.stage.clientWidth;

      const sr = el.getBoundingClientRect();
      if (E.band && sr.top < vh + 40 && sr.top > -260) {
        const shift = Math.round((cl((vh - sr.top) / (vh + 220)) * 0.4 - 0.2) * 48) / 48;
        if (shift !== bandShift || bandDirty) {
          bandShift = shift;
          drawBand(E.band, shift);
          bandDirty = false;
        }
      }

      const tr = E.track.getBoundingClientRect();
      const total = tr.height - vh;
      const target = reduced ? 1 : total > 0 ? cl(-tr.top / total) : 0;
      if (cur == null) cur = target;
      cur += (target - cur) * (1 - Math.exp(-dt * 8));
      if (Math.abs(target - cur) < 1e-4) cur = target;
      const p = cur;

      const ent = sm(rp(0, 0.12, p));
      const out = sm(rp(0.56, 0.74, p));
      const step = p < 0.15 ? 0 : p < 0.29 ? 1 : p < 0.43 ? 2 : 3;
      if (step !== lastStep) {
        bump = 1;
        lastStep = step;
      }
      bump *= Math.exp(-dt * 5);

      const oy = lp(lp(0.6, 0.5, ent), 0.27, out) * vh;
      const os = lp(lp(0.82, 1, ent), 0.62, out) * (1 + 0.09 * bump * Math.sin(bump * Math.PI));
      const float = (1 - out) * 6 * Math.sin(T * 1.2);
      E.obj.style.transform = `translate3d(${vw / 2 - S / 2}px,${oy - S / 2 + float}px,0) scale(${os})`;

      const ry = lp(-22 + 44 * rp(0, 0.56, p), 0, out) + 3 * Math.sin(T * 0.7);
      const rx = lp(14, 6, out) + 2 * Math.sin(T * 0.9);
      E.tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

      E.faces.forEach((f, i) => {
        faceOp[i] += ((i === step ? 1 : 0) - faceOp[i]) * (1 - Math.exp(-dt * 12));
        f.style.opacity = String(faceOp[i]);
        f.style.transform = `scale(${0.7 + 0.3 * faceOp[i]})`;
      });

      let ci = 0;
      while (ci < 2 && p > PLATE_KEYS[ci + 1]) ci++;
      const ct = sm(rp(PLATE_KEYS[ci], PLATE_KEYS[ci + 1], p));
      const A = PLATES[ci];
      const B = PLATES[ci + 1];
      E.inner.style.background = `rgb(${A.map((v, j) => Math.round(lp(v, B[j], ct))).join(",")})`;

      const sw = S * os * 1.15;
      E.shadow.style.width = `${sw}px`;
      E.shadow.style.transform = `translate3d(${vw / 2 - sw / 2}px,${oy + S * os * 0.5 + 14}px,0) scale(${1 - float / 60})`;
      E.shadow.style.opacity = String(ent * (1 - 0.6 * out));

      const exit = sm(rp(0.54, 0.62, p));
      E.words.forEach((w, i) => {
        const t = rp(0.12 + 0.14 * i, 0.21 + 0.14 * i, p);
        const pop = t > 0 ? back(t) : 0;
        const [ww, wh] = wordSize[i] || [0, 0];
        const spot = WORD_SPOTS[i];
        // Clamped so a long word never slides off a narrow stage.
        const x = Math.max(ww / 2 + 12, Math.min(vw - ww / 2 - 12, vw / 2 + spot.x * S));
        const y = oy + spot.y * S;
        w.style.opacity = String(Math.min(1, t * 3) * (1 - exit));
        w.style.transform = `translate3d(${x - ww / 2}px,${y - wh / 2 - 30 * exit}px,0) rotate(${
          spot.r + 2 * Math.sin(T * 0.8 + i * 2)
        }deg) scale(${Math.max(0, pop) * (1 - 0.35 * exit)})`;
      });

      const ca = sm(rp(0.62, 0.76, p));
      E.cap.style.opacity = String(ca);
      E.cap.style.transform = `translate3d(0,${(1 - ca) * 26}px,0)`;

      // Each tile reveals off its own position, so the rail behaves when scrolled.
      const keys = E.slots.map((s, i) => {
        const r = s.getBoundingClientRect();
        const k = reduced ? 1 : sm(cl((vh - r.top - 20 - (i >= 2 ? (i - 2) * 40 : i * 50)) / (vh * 0.3)));
        s.style.opacity = String(k);
        s.style.transform = `translate3d(0,${(1 - k) * 48}px,0)`;
        return k;
      });

      fanNow += (fanTo - fanNow) * (1 - Math.exp(-dt * 6));
      const fk = keys[0] ?? 1;
      const fsc = Math.min(1, (E.fanbox.clientWidth || 600) / 640);
      E.fan.forEach((f, i) => {
        const s = FAN_SPOTS[i];
        const sp = (0.25 + 0.75 * fk) * (1 + 0.22 * fanNow);
        f.style.transform = `translate(-50%,-50%) translate3d(${s.x * sp * fsc}px,${
          (s.y + (1 - fk) * 40 - (i === 2 ? 10 * fanNow : 0)) * fsc
        }px,0) rotate(${s.r * sp}deg) scale(${fsc})`;
      });

      E.bars.forEach((b) => {
        const holder = b.closest(".ss-slot") as HTMLElement | null;
        const k = holder ? sm(cl((vh - holder.getBoundingClientRect().top - 40) / (vh * 0.3))) : 1;
        b.style.width = `${Math.min(100, Number(b.dataset.bar) * 2.4) * k}%`;
      });
      E.toasts.forEach((t, i) => {
        const holder = t.closest(".ss-slot") as HTMLElement | null;
        const hk = holder ? sm(cl((vh - holder.getBoundingClientRect().top - 40) / (vh * 0.3))) : 1;
        const k = sm(rp(0.2 + i * 0.3, 0.7 + i * 0.3, hk));
        t.style.opacity = String(k);
        t.style.transform = `translate3d(0,${(1 - k) * 24}px,0) scale(${0.96 + 0.04 * k})`;
      });
      const ck = sm(rp(0.4, 1, keys[1] ?? 1));
      E.chip.style.opacity = String(ck);
      E.chip.style.transform = `translate3d(0,${(1 - ck) * 20}px,0)`;

      if (!reduced && E.marq) {
        const half = E.marq.scrollWidth / 2;
        marq = (marq + dt * 32) % (half || 1);
        E.marq.style.transform = `translate3d(${-marq}px,0,0)`;
      }
      if (E.timer) {
        const left = 2699 - Math.floor(T % 2699);
        const txt = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
        if (E.timer.textContent !== txt) E.timer.textContent = txt;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      E.big.removeEventListener("mouseenter", spread);
      E.big.removeEventListener("mouseleave", collapse);
      E.bento.classList.remove("is-armed");
    };
  }, []);

  /* ---- rail paging ---- */
  const paint = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPos({ ratio: el.clientWidth / el.scrollWidth, progress: max > 0 ? el.scrollLeft / max : 0 });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    paint();
    el.addEventListener("scroll", paint, { passive: true });
    const ro = new ResizeObserver(paint);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", paint);
      ro.disconnect();
    };
  }, [paint]);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".ss-slot");
    el.scrollBy({ left: dir * (card ? card.offsetWidth + 16 : el.clientWidth * 0.8), behavior: "smooth" });
  };

  /* Mouse users can drag the rail; touch and trackpad already scroll natively. */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rail.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    const startX = e.clientX;
    const startLeft = el.scrollLeft;
    el.classList.add("dragging");
    const move = (ev: PointerEvent) => {
      el.scrollLeft = startLeft - (ev.clientX - startX);
    };
    const up = () => {
      el.classList.remove("dragging");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const atStart = pos.progress <= 0.01;
  const atEnd = pos.progress >= 0.99;

  return (
    <section className="ss" ref={root} aria-labelledby="ss-title">
      <canvas className="ss-band" aria-hidden />

      <div className="ss-track">
        <div className="ss-stage">
          <div className="ss-shadow" aria-hidden />

          <div className="ss-obj" aria-hidden>
            <div className="ss-tilt">
              <div className="ss-bezel">
                <div className="ss-inner">
                  <span className="ss-gloss" />
                  <div className="ss-screen">
                    <div className="ss-face f-oa">OA</div>
                    <div className="ss-face f-eye">
                      <svg viewBox="0 0 48 48" fill="none" stroke="#c6dbf3" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 24 C 11 13, 37 13, 44 24 C 37 35, 11 35, 4 24 Z" />
                        <circle cx="24" cy="24" r="6" />
                      </svg>
                    </div>
                    <div className="ss-face f-code">{"{ }"}</div>
                    <div className="ss-face f-check">
                      <svg viewBox="0 0 48 48" fill="none" stroke="#bfe7c7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 25 L20 34 L39 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="ss-word w0">See</p>
          <p className="ss-word w1">Solve</p>
          <p className="ss-word w2">Clear</p>

          <div className="ss-cap">
            <h2 className="ss-pill" id="ss-title">
              See, Solve and Clear
            </h2>
            <p className="ss-sub">
              /// Every question here was asked in a real OA. See the pattern, solve it against the clock, and clear your round.
            </p>
          </div>
        </div>
      </div>

      <div className="ss-bento">
        <div className="ss-top">
          {/* The headline promise: real papers, stamped and dated. */}
          <div className="ss-slot is-big">
            <div className="ss-card is-big">
              <div className="ss-fanbox">
                <div className="ss-fan">
                  <div className="ss-fan-row">
                    <span className="ss-co" style={{ background: "#c6dbf3" }}>
                      Microsoft
                    </span>
                    <span className="ss-when">SWE OA · Sep 2026</span>
                  </div>
                  <div className="ss-fan-q">Count Valid Substrings</div>
                  <div className="ss-tags">
                    <span className="t-easy">Easy</span>
                    <span>Strings</span>
                  </div>
                </div>
                <div className="ss-fan">
                  <div className="ss-fan-row">
                    <span className="ss-co" style={{ background: "#bfe7c7", color: "#16201a" }}>
                      Google
                    </span>
                    <span className="ss-when">STEP OA · Jul 2026</span>
                  </div>
                  <div className="ss-fan-q">Minimum Cost Path in a Grid</div>
                  <div className="ss-tags">
                    <span className="t-hard">Hard</span>
                    <span>DP</span>
                  </div>
                </div>
                <div className="ss-fan is-front">
                  <span className="ss-stamp">ASKED IN A REAL OA ✓</span>
                  <div className="ss-fan-row">
                    <span className="ss-co" style={{ background: "#f7d3b5", color: "#22190f" }}>
                      {company}
                    </span>
                    <span className="ss-when">SDE-1 OA · Aug 2026</span>
                  </div>
                  <div className="ss-fan-q">Balance the Warehouses</div>
                  <div className="ss-tags">
                    <span className="t-med">Medium</span>
                    <span>Arrays</span>
                    <span>Prefix Sum</span>
                  </div>
                  <div className="ss-seen">
                    <i />
                    Seen in 14 OAs this season
                  </div>
                </div>
              </div>

              <div className="ss-big-foot">
                <div className="ss-big-copy">
                  <h3>Real OA Questions Actually Asked in Interviews</h3>
                  <p>
                    {data.stats
                      ? `${data.stats.questions}+ questions from ${data.stats.companies}+ companies, each tagged with the company, role and month it was asked.`
                      : "Every question comes from a real online assessment, tagged with the company, role and month it was asked."}
                  </p>
                </div>
                <div className="ss-marqbox" aria-hidden>
                  <div className="ss-marq">
                    {[...COMPANIES, ...COMPANIES].map(([name, color], i) => (
                      <span key={`${name}-${i}`}>
                        <i style={{ background: color }} />
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ss-slot is-side">
            <div className="ss-card">
              <div className="ss-art">
                <div className="ss-cal-head">
                  <b>October 2026</b>
                  <span>5 OAs</span>
                </div>
                <div className="ss-dow" aria-hidden>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>
                <div className="ss-days" aria-hidden>
                  {days.map((d, i) => (
                    <span key={i} style={{ background: d.bg, color: d.fg }}>
                      {d.n}
                    </span>
                  ))}
                </div>
                <div className="ss-calchip">
                  <i />
                  <span>
                    <b>{company} SDE-1 OA</b>
                    <em>Tue, Oct 6 · 10:00 AM</em>
                  </span>
                </div>
              </div>
              <div className="ss-copy">
                <h3>OA Calendar</h3>
                <p>Upcoming OAs for your campus in one calendar, with dates and timings.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="ss-railhead">
          <div>
            <h3>Everything else you get</h3>
            <p>Scroll across — {cards.length} more features in your season.</p>
          </div>
          <div className="ss-nav">
            <span className="ss-count" aria-hidden>
              {Math.min(cards.length, Math.round(pos.progress * (cards.length - 3)) + 3)} / {cards.length}
            </span>
            <button type="button" onClick={() => page(-1)} disabled={atStart} aria-label="Previous features">
              ←
            </button>
            <button type="button" onClick={() => page(1)} disabled={atEnd} aria-label="More features">
              →
            </button>
          </div>
        </div>

        <div className="ss-rail" ref={rail} onPointerDown={onPointerDown} tabIndex={0} role="group" aria-label="More features, scroll sideways">
          {cards.map((c) => (
            <div className="ss-slot" key={c.title}>
              <div className="ss-card">
                <div className="ss-art">{c.art}</div>
                <div className="ss-copy">
                  <h3>{c.title}</h3>
                  <p>{c.line}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ss-railbar" aria-hidden>
          <i style={{ width: `${pos.ratio * 100}%`, left: `${pos.progress * (100 - pos.ratio * 100)}%` }} />
        </div>
      </div>

    </section>
  );
}
