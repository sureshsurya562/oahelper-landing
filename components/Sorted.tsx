"use client";

import { useEffect, useRef } from "react";
import type { LandingData } from "@/lib/types";

const PILE = 18;
const STACK = 10;

/** Deterministic scatter, so the pile looks identical on every render and resize. */
const nz = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Scroll map (0 → 1 across the 300vh track):
 * 0.00–0.10  the heading arrives
 * 0.04–0.44  both columns slide in
 * 0.12–0.26  problems drop into a messy pile on the left
 * 0.42–0.62  the ten your company actually asks fly right and stack
 * 0.86–0.96  the freshness sticker lands on top
 */
export default function Sorted({ data }: { data: LandingData }) {
  const root = useRef<HTMLElement>(null);
  const company = data.hero?.company ?? "Amazon";

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const q = (s: string) => el.querySelector(s) as HTMLElement;
    const qa = (s: string) => Array.from(el.querySelectorAll(s)) as HTMLElement[];
    const stage = q(".sb-stage");
    const head = q(".sb-head");
    const cols = qa(".sb-col");
    const slots = qa(".sb-slot");
    const cards = qa(".sb-card");
    const badges = cards.map((c) => c.querySelector(".sb-badge") as HTMLElement | null);
    const fresh = q(".sb-fresh");
    if (!stage || !cards.length || cols.length < 2) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) el.style.height = "100vh";

    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const rp = (a: number, b: number, p: number) => cl((p - a) / (b - a));
    const sm = (t: number) => t * t * (3 - 2 * t);
    const lp = (a: number, b: number, t: number) => a + (b - a) * t;
    const out = (t: number) => 1 - Math.pow(1 - t, 3);

    let cw = 160;
    let ch = 96;
    const layout = () => {
      const vw = stage.clientWidth || window.innerWidth;
      cw = Math.round(Math.max(116, Math.min(170, vw * 0.13)));
      ch = Math.round(cw * 0.6);
      cards.forEach((c) => {
        c.style.width = `${cw}px`;
        c.style.height = `${ch}px`;
      });
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(stage);

    let cur: number | null = null;
    let last = 0;
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const vh = window.innerHeight;
      const tr = el.getBoundingClientRect();
      if (tr.bottom < -50 || tr.top > vh + 50) return;

      const span = tr.height - vh;
      const tg = reduced ? 1 : span > 0 ? cl(-tr.top / span) : 0;
      if (cur == null) cur = tg;
      cur += (tg - cur) * (1 - Math.exp(-dt * 7));
      if (Math.abs(tg - cur) < 1e-4) cur = tg;
      const p = cur;

      const a = sm(rp(0, 0.1, p));
      head.style.opacity = String(a);
      head.style.transform = `translateY(${(1 - a) * 24}px)`;
      const lv = sm(rp(0.04, 0.16, p));
      const rvv = sm(rp(0.3, 0.44, p));
      cols[0].style.opacity = String(lv);
      cols[0].style.transform = `translateX(${(lv - 1) * 24}px)`;
      cols[1].style.opacity = String(rvv);
      cols[1].style.transform = `translateX(${(1 - rvv) * 24}px)`;

      // Slots never move under a transform, so their rects are safe anchors.
      const sr = stage.getBoundingClientRect();
      const cen = (node: HTMLElement) => {
        const r = node.getBoundingClientRect();
        return { x: r.left + r.width / 2 - sr.left, y: r.top + r.height / 2 - sr.top, w: r.width, h: r.height };
      };
      const A = cen(slots[0]);
      const B = cen(slots[1]);
      let stacked = 0;

      cards.forEach((card, i) => {
        const drop = sm(rp(0.12 + i * 0.008, 0.26 + i * 0.008, p));
        const sx = nz(i, 1) * 2 - 1;
        const sy = nz(i, 2) * 2 - 1;
        const rot = (nz(i, 3) * 2 - 1) * 30;
        let x = A.x + sx * Math.max(8, A.w / 2 - cw / 2 - 4);
        let y = A.y + sy * Math.max(6, A.h / 2 - ch / 2 - 4) - (1 - drop) * 160;
        let r = lp(rot * 1.8, rot, drop);
        let op = drop;
        let bl = 0;

        if (i < STACK) {
          const fly = out(rp(0.42 + i * 0.03, 0.62 + i * 0.03, p));
          x = lp(x, B.x, fly);
          y = lp(y, B.y + (STACK / 2 - i) * 5 + 10, fly);
          r = lp(r, 0, fly);
          if (fly > 0) stacked = i + 1;
          const badge = badges[i];
          if (badge) badge.style.opacity = String(sm(rp(0.7, 1, fly)));
        } else {
          const dim = sm(rp(0.5, 0.72, p));
          op = drop * lp(1, 0.3, dim);
          bl = 1.6 * dim;
        }

        card.style.transform = `translate3d(${x - cw / 2}px,${y - ch / 2}px,0) rotate(${r}deg)`;
        card.style.opacity = String(op);
        card.style.filter = bl > 0.05 ? `blur(${bl}px)` : "none";
        card.style.zIndex = String(i < STACK ? 20 + i : 10);
      });

      const fv = stacked >= STACK ? sm(rp(0.86, 0.96, p)) : 0;
      const topY = B.y + (STACK / 2 - (STACK - 1)) * 5 + 10 - ch / 2;
      fresh.style.maxWidth = `${Math.max(180, B.w - 16)}px`;
      fresh.style.opacity = String(fv);
      fresh.style.transform = `translate3d(${B.x}px,${topY - 14 + (1 - fv) * 10}px,0) translate(-50%,-100%) scale(${0.94 + 0.06 * fv})`;
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="sb" ref={root} aria-labelledby="sb-title">
      <div className="sb-stage">
        <div className="sb-inner">
          <h2 className="sb-head display" id="sb-title">
            Stop practising <em>blind.</em>
          </h2>

          <div className="sb-grid">
            <div className="sb-col">
              <span className="sb-label">Random prep</span>
              <div className="sb-lines">
                3,000 problems
                <br />→ pick whatever
                <br />→ hope it shows up
              </div>
              <div className="sb-slot" />
            </div>
            <div className="sb-col is-oa">
              <span className="sb-label">OA Helper</span>
              <div className="sb-lines">
                Your company
                <br />→ what it asked this season
                <br />→ the questions that matter
              </div>
              <div className="sb-slot" />
            </div>
          </div>
        </div>

        <div className="sb-field" aria-hidden>
          {Array.from({ length: PILE }, (_, i) => (
            <div className="sb-card" key={i}>
              <div className="sb-card-face">
                <span>Problem #{(i * 173 + 211) % 2999}</span>
                <i />
                <i />
              </div>
              {i < STACK && (
                <div className="sb-badge">
                  <b>{company}</b>
                  <span>OA · this season</span>
                </div>
              )}
            </div>
          ))}
          <p className="sb-fresh">Asked in last Tuesday&apos;s drive. Shared the same night.</p>
        </div>
      </div>
    </section>
  );
}
