"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

/** A card shows either a product image (`shot`) or its own drawn artwork (`art` on `tint`). */
export type StackCard = {
  title: string;
  line: string;
  href: string;
  shot?: { src: string; alt: string; tint: string; fit?: "contain" | "inset" };
  art?: ReactNode;
  tint?: string;
};

/**
 * "Everything you need to clear your OA": a pinned stack. The first card rests in the
 * middle; each scroll step slides the next one up over it. Covered cards step back
 * (lift 16px, shrink 5% and darken 20% per card above them) and fade out past ~3.6 deep.
 * The split headline sits either side of the stack; below 760px it moves above and below.
 */
const W = 320;
/** Share of the track before the first card moves, and the share spent stacking. */
const START = 0.04;
const SPAN = 0.88;

export default function FeatureStack({ cards }: { cards: StackCard[] }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tr = track.current;
    if (!tr) return;
    const stage = tr.querySelector<HTMLElement>(".fs-stage")!;
    const C = Array.from(tr.querySelectorAll<HTMLElement>(".fs-card"));
    const S = C.map((c) => c.querySelector<HTMLElement>(".fs-shade")!);
    const N = C.length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const out = (t: number) => 1 - Math.pow(1 - t, 3);

    let H = 344;
    const measure = () => {
      H = C[0]?.offsetHeight || H;
      for (const c of C) c.style.marginTop = `${-H / 2}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (C[0]) ro.observe(C[0]);

    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(tr);

    let sp: number | null = null;
    let lt = 0;
    let raf = 0;
    const frame = (now: number) => {
      raf = 0;
      const vh = window.innerHeight;
      const vw = stage.clientWidth;
      const r = tr.getBoundingClientRect();
      const raw = cl(-r.top / Math.max(1, r.height - vh));
      const dt = Math.min(0.05, (now - (lt || now)) / 1000);
      lt = now;
      if (sp == null || reduced) sp = raw;
      else sp += (raw - sp) * (1 - Math.exp(-dt * 8));
      if (Math.abs(raw - sp) < 1e-4) sp = raw;
      const p = sp;

      const narrow = vw < 760;
      const base = narrow ? Math.min(1, (vw - 40) / W, (vh - 190) / H) : Math.max(1, Math.min(1.5, (vh - 150) / H, (vw - 560) / W));
      const k = cl((p - START) / SPAN) * (N - 1);
      const ts = C.map((_, i) => (i === 0 ? 1 : out(cl(k - (i - 1)))));

      C.forEach((c, i) => {
        let depth = 0;
        for (let j = i + 1; j < N; j++) depth += ts[j];
        const d = Math.min(depth, 3);
        const y = (1 - ts[i]) * vh * 0.9 - d * 16 * base + 18;
        const op = cl(3.6 - depth);
        c.style.transform = `translate3d(0,${y.toFixed(1)}px,0) scale(${(base * (1 - 0.05 * d)).toFixed(4)})`;
        c.style.opacity = op.toFixed(3);
        c.style.pointerEvents = op < 0.2 || ts[i] < 0.9 ? "none" : "auto";
        S[i].style.opacity = (d * 0.2).toFixed(3);
      });
      stage.style.setProperty("--fs-off", `${((base - 1) * 160).toFixed(1)}px`);
      stage.style.setProperty("--fs-lab", `${(-(H / 2 + 26) * base).toFixed(1)}px`);

      if (visible && p !== raw) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      if (visible) kick();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", kick);
    kick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", kick);
    };
  }, []);

  return (
    <div className="fs-track" ref={track} style={{ height: `${100 + (cards.length - 1) * 80}vh` }}>
      <div className="fs-stage">
        <h3 className="fs-title">Everything you need to clear your OA</h3>
        <p className="fs-side is-l" aria-hidden>
          Everything
          <br />
          you need
        </p>
        <p className="fs-side is-r" aria-hidden>
          to clear
          <br />
          your OA.
        </p>
        <p className="fs-side is-top" aria-hidden>
          Everything you need
        </p>
        <p className="fs-side is-bot" aria-hidden>
          to clear your OA.
        </p>
        <p className="fs-lab" aria-hidden>
          <Sparkle />
          Our Features
        </p>

        {cards.map((c, i) => (
          <a className="fs-card" href={c.href} data-cursor="Explore" key={c.title} style={{ zIndex: i + 1 }}>
            <div className="fs-card-in">
              <div className="fs-head">
                <span>{c.title}</span>
                <Sparkle />
              </div>
              <div className={`fs-art${c.shot?.fit ? ` is-${c.shot.fit}` : ""}`} style={{ backgroundColor: c.shot?.tint ?? c.tint }}>
                {c.art ?? (c.shot && <Image src={c.shot.src} alt={c.shot.alt} fill sizes="480px" />)}
              </div>
              <p>{c.line}</p>
              <i className="fs-shade" aria-hidden />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M8 0C8.6 4.6 11.4 7.4 16 8C11.4 8.6 8.6 11.4 8 16C7.4 11.4 4.6 8.6 0 8C4.6 7.4 7.4 4.6 8 0Z" fill="currentColor" />
    </svg>
  );
}
