"use client";

import { useEffect, useRef } from "react";
import type { LandingData } from "@/lib/types";
import FeatureStack, { type StackCard } from "./FeatureStack";

/**
 * See · Solve · Clear — ported from the "Cinematic OA Hero" design file.
 *
 * Scroll map (0 → 1 across the sticky stage):
 * 0.00–0.12  the object rises and settles, its screen showing "OA"
 * 0.12–0.49  See, then Solve, then Clear pop in around it; the screen and the
 *            inner plate change face and colour on each step
 * 0.54–0.62  the words lift away
 * 0.62–0.76  the sticker caption lands
 * then the feature stack overlaps the tail of the stage, one card per scroll step.
 */

/** Where each word sits, in multiples of the object's size. */
const WORD_SPOTS = [
  { x: -1.0, y: -0.62, r: -8 },
  { x: 1.1, y: -0.04, r: 6 },
  { x: -0.8, y: 0.74, r: -4 },
];

/** The inner plate cross-fades through these as the screen changes face. */
const PLATES: [number, number, number][] = [
  [217, 205, 244],
  [198, 219, 243],
  [247, 211, 181],
  [191, 231, 199],
];
const PLATE_KEYS = [0.08, 0.2, 0.34, 0.48];

/**
 * Product artwork from public/feature_cards_images. `tint` is each image's own
 * background, so the well around it reads as part of the picture.
 */
type Shot = { src: string; alt: string; tint: string };
const SHOTS = {
  mock: { src: "/feature_cards_images/mockoa.png", alt: "Mock OA editor with a running timer and 3/3 tests passed", tint: "#edeef3" },
  dsa: { src: "/feature_cards_images/DSA_roadmap.png", alt: "DSA roadmap as a planet path, on Arrays & Hashing at day 12 of 60, with Sliding window, Two pointers and Graphs next", tint: "#ebe0ec" },
  groups: { src: "/feature_cards_images/oagroups.png", alt: "Google OA group with 1.8k members and an invite button", tint: "#e5f3ff" },
  coins: { src: "/feature_cards_images/oacoins.png", alt: "OA Coins redeemable on Swiggy, Zomato and Amazon", tint: "#eae5d8" },
  questions: { src: "/feature_cards_images/company wise questions.png", alt: "Company-wise questions: Google's graph shortest path, Microsoft's sliding window max, with Flipkart, Meta, PhonePe, Adobe, Amazon and more", tint: "#ffd7d8" },
  college: { src: "/feature_cards_images/collegepage.png", alt: "IIT Hyderabad's college page: 24 drives, 312 placed, 86% offers, 8 live, and 128 batchmates", tint: "#e3f4e8" },
  calendar: { src: "/feature_cards_images/oacalendar2.png", alt: "OA calendar showing a Google OA on the 16th at 10:00 AM and 3 OAs this week", tint: "#f8f4ea" },
} satisfies Record<string, Shot>;

function buildRail(): StackCard[] {
  return [
    {
      title: "Real OA Questions",
      href: "https://www.oahelper.in/problems",
      line: "9,000+ questions from 650+ companies, each tagged with the company, role and month it was asked.",
      shot: SHOTS.questions,
    },
    {
      title: "OA Calendar",
      href: "https://www.oahelper.in/oa-calendar",
      line: "Upcoming OAs for your campus in one calendar, with dates and timings.",
      shot: { ...SHOTS.calendar, fit: "contain" },
    },
    {
      title: "College Page",
      href: "https://www.oahelper.in/companies",
      line: "Drives, eligibility and cutoffs for your campus, updated by your own batch.",
      // Transparent artwork: shown whole, inset a little, on its own mint well.
      shot: { ...SHOTS.college, fit: "inset" },
    },
    {
      title: "Timed Mock OAs",
      href: "https://www.oahelper.in/mock-oa",
      line: "Practice in an exam-style editor with a timer and hidden test cases.",
      shot: SHOTS.mock,
    },
    {
      title: "60-Day DSA Roadmap",
      href: "https://www.oahelper.in/placement-prep",
      line: "Eighteen patterns, ordered by what OAs actually repeat.",
      shot: SHOTS.dsa,
    },
    {
      title: "OA Groups",
      href: "https://www.oahelper.in/companies",
      line: "Same-day intel from everyone else sitting the very same test.",
      shot: SHOTS.groups,
    },
    {
      title: "Contribute & Earn",
      href: "https://www.oahelper.in/contribute",
      line: "Share one paper anonymously, unlock premium with OA Coins.",
      shot: SHOTS.coins,
    },
  ];
}

export default function Value({ data }: { data: LandingData }) {
  const root = useRef<HTMLElement>(null);
  const cards = buildRail();

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
      faces: qa(".ss-face"),
      words: qa(".ss-word"),
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

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      E.bento.classList.remove("is-armed");
    };
  }, []);

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
              Every question here was asked in a real OA. See the pattern, solve it against the clock, and clear your round.
            </p>
          </div>
        </div>
      </div>

      <div className="ss-bento">
        <FeatureStack cards={cards} />
      </div>

    </section>
  );
}
