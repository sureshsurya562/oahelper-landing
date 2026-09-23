"use client";

import { useEffect, useRef } from "react";
import type { LandingData } from "@/lib/types";

const PILE_SIZE = 18;
const STACK_SIZE = 10;

/** Deterministic scatter, so the pile looks the same on every render and resize. */
const noise = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const between = (i: number, k: number, a: number, b: number) => a + (b - a) * noise(i, k);

/**
 * Scroll map (0 → 1 across the sticky section):
 * 0.00–0.12  heading and the random-prep column arrive
 * 0.12–0.40  problems drop into a messy pile on the left
 * 0.40–0.85  the ones your company actually asks fly right and stack
 * 0.85–1.00  the top card shows how fresh it is
 */
export default function Sorted({ data }: { data: LandingData }) {
  const root = useRef<HTMLElement>(null);
  const company = data.hero?.company ?? "Amazon";

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const q = (s: string) => el.querySelector(s) as HTMLElement;
    const qa = (s: string) => Array.from(el.querySelectorAll(s)) as HTMLElement[];
    const stage = q(".blind-stage");
    const pile = q(".pile");
    const left = q('[data-slot="pile"]');
    const right = q('[data-slot="stack"]');
    const cards = qa(".qcard");
    const head = q(".blind-head");
    const colL = q(".blind-col.is-random");
    const colR = q(".blind-col.is-oa");
    const fresh = q(".qcard-fresh");
    if (!stage || !pile || !cards.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.style.height = reduced ? "100vh" : "";

    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const rp = (a: number, b: number, p: number) => cl((p - a) / (b - a));
    const sm = (t: number) => t * t * (3 - 2 * t);
    const out = (t: number) => 1 - Math.pow(1 - t, 3);
    const lp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Slots never move under a transform, so client rects are safe anchors here.
    const centre = (slot: HTMLElement) => {
      const s = slot.getBoundingClientRect();
      const p = pile.getBoundingClientRect();
      return { x: s.left + s.width / 2 - (p.left + p.width / 2), y: s.top + s.height / 2 - (p.top + p.height / 2) };
    };

    let cur: number | null = null;
    let lastT = 0;
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - (lastT || now)) / 1000);
      lastT = now;

      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const target = span > 0 ? cl(-rect.top / span) : reduced ? 1 : 0;
      if (cur == null) cur = target;
      cur += (target - cur) * (1 - Math.exp(-dt * 7));
      const p = cur;

      const a = sm(rp(0, 0.1, p));
      head.style.opacity = String(a);
      head.style.transform = `translateY(${(1 - a) * 24}px)`;
      const lv = sm(rp(0.04, 0.16, p));
      colL.style.opacity = String(lv);
      colL.style.transform = `translateX(${(lv - 1) * 24}px)`;
      const rv = sm(rp(0.3, 0.44, p));
      colR.style.opacity = String(rv);
      colR.style.transform = `translateX(${(1 - rv) * 24}px)`;

      const from = centre(left);
      const to = centre(right);
      let stacked = 0;

      cards.forEach((card, i) => {
        const drop = sm(rp(0.12 + i * 0.008, 0.26 + i * 0.008, p));
        const sx = between(i, 1, -84, 84);
        const sy = between(i, 2, -48, 48);
        const rot = between(i, 3, -38, 38);

        let x = from.x + sx;
        let y = from.y + sy - (1 - drop) * 140;
        let r = lp(rot * 1.8, rot, drop);
        let z = 0;
        let op = drop;
        let blurPx = 0;

        const inStack = i < STACK_SIZE;
        if (inStack) {
          // Ordered arrival: the paper your company actually asks lands squarely on the deck.
          const fly = out(rp(0.42 + i * 0.03, 0.62 + i * 0.03, p));
          x = lp(x, to.x, fly);
          y = lp(y, to.y + (STACK_SIZE / 2 - i) * 5, fly);
          r = lp(r, 0, fly);
          z = i * 6;
          if (fly > 0) stacked = i + 1;
          const badge = card.querySelector(".qcard-on") as HTMLElement | null;
          if (badge) badge.style.opacity = String(sm(rp(0.7, 1, fly)));
        } else {
          const dim = sm(rp(0.5, 0.72, p));
          op = drop * lp(1, 0.32, dim);
          blurPx = 1.6 * dim;
        }

        card.style.transform = `translate3d(${x}px,${y}px,${z}px) rotate(${r}deg)`;
        card.style.opacity = String(op);
        card.style.filter = blurPx > 0.05 ? `blur(${blurPx}px)` : "none";
        card.style.zIndex = String(inStack ? 20 + i : 10);
      });

      const fv = stacked >= STACK_SIZE ? sm(rp(0.86, 0.96, p)) : 0;
      fresh.style.opacity = String(fv);
      // Sit at the same depth as the top card, or perspective offsets the two differently.
      fresh.style.transform = `translate3d(${to.x}px,${to.y - 96 + (1 - fv) * 10}px,${(STACK_SIZE - 1) * 6}px) translate(-50%,-50%) scale(${0.92 + 0.08 * fv})`;

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="blind" ref={root} aria-labelledby="blind-title">
      <div className="blind-stage">
        <h2 className="blind-head" id="blind-title">
          Stop practising blind.
        </h2>

        <div className="blind-grid">
          <div className="blind-col is-random">
            <p className="blind-label">Random prep</p>
            <pre className="blind-pre">{"3,000 problems\n→ pick whatever\n→ hope it shows up"}</pre>
            <div className="blind-slot" data-slot="pile" />
          </div>
          <div className="blind-col is-oa">
            <p className="blind-label accent">OA Helper</p>
            <pre className="blind-pre">{"Your company\n→ what it asked this season\n→ the questions that matter"}</pre>
            <div className="blind-slot" data-slot="stack" />
          </div>
        </div>

        <div className="pile" aria-hidden>
          {Array.from({ length: PILE_SIZE }, (_, i) => (
            <div className="qcard" key={i}>
              <span className="qcard-num">Problem #{(i * 173 + 211) % 2999}</span>
              <span className="qcard-line" />
              <span className="qcard-line short" />
              {i < STACK_SIZE && (
                <span className="qcard-on">
                  <b>{company}</b>
                  <span>OA · this season</span>
                </span>
              )}
            </div>
          ))}
          <p className="qcard-fresh">Asked in last Tuesday&apos;s drive. Shared the same night.</p>
        </div>
      </div>
    </section>
  );
}
