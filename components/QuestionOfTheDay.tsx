"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LandingData } from "@/lib/types";

/** Placeholder until the client ticks, so server and client HTML agree. */
const BLANK = { h: "--", m: "--", s: "--" };

function remaining(iso: string) {
  const left = new Date(iso).getTime() - Date.now();
  if (!Number.isFinite(left) || left <= 0) return { h: "00", m: "00", s: "00" };
  const total = Math.floor(left / 1000);
  return {
    h: String(Math.floor(total / 3600)).padStart(2, "0"),
    m: String(Math.floor(total / 60) % 60).padStart(2, "0"),
    s: String(total % 60).padStart(2, "0"),
  };
}

/** Sticker pastels, each piece outlined in ink like the rest of the system. */
const CONF_TINTS = ["#bfe7c7", "#c6dbf3", "#f7d3b5", "#d9cdf4", "#f5baae", "#f3e9a8", "#b4eae8", "#d7ee9f"];

type Piece = { el: HTMLSpanElement; x: number; y: number; vx: number; vy: number; r: number; vr: number; life: number; dur: number };

export default function QuestionOfTheDay({ data }: { data: LandingData }) {
  const q = data.potd;
  const wrap = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const conf = useRef<HTMLDivElement>(null);
  const burst = useRef<(() => void) | null>(null);
  const shut = useRef<number | null>(null);
  const pinned = useRef(false);
  const hovering = useRef(false);
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState(BLANK);

  const clear = () => {
    if (shut.current) {
      window.clearTimeout(shut.current);
      shut.current = null;
    }
  };
  const show = useCallback(() => {
    hovering.current = true;
    clear();
    setOpen(true);
  }, []);
  /** Small grace period so crossing the gap between tab and card doesn't close it. */
  const hide = useCallback(() => {
    hovering.current = false;
    clear();
    shut.current = window.setTimeout(() => {
      if (!pinned.current) setOpen(false);
    }, 220);
  }, []);

  useEffect(() => {
    if (!q) return;
    const tick = () => setClock(remaining(q.expiresAt));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [q]);

  /* Clicking anywhere else releases a pinned card; Escape closes it outright. */
  useEffect(() => {
    if (!q) return;
    const onDown = (e: PointerEvent) => {
      if (pinned.current && !wrap.current?.contains(e.target as Node)) {
        pinned.current = false;
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      pinned.current = false;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [q]);

  /* The design's highlight: it peeks on its own 3.5s in, then withdraws. */
  useEffect(() => {
    if (!q) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const peek = window.setTimeout(() => {
      setOpen(true);
      shut.current = window.setTimeout(() => {
        if (!hovering.current && !pinned.current) setOpen(false);
      }, 4200);
    }, 3500);
    return () => window.clearTimeout(peek);
  }, [q]);

  /* The pulse ring on the tab's peach dot. */
  useEffect(() => {
    if (!q) return;
    const node = ring.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = (now % 1800) / 1800;
      node.style.transform = `scale(${1 + t * 1.8})`;
      node.style.opacity = String(open ? 0 : 1 - t);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [q, open]);

  /**
   * Confetti out of the tab whenever the card opens. Pieces are DOM spans rather
   * than a canvas — sixteen of them, and they inherit the sticker ink outline.
   */
  useEffect(() => {
    const host = conf.current;
    if (!q || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const pieces: Piece[] = [];
    for (let i = 0; i < (fine ? 16 : 8); i++) {
      const el = document.createElement("span");
      const tall = i % 3 === 0;
      el.style.cssText =
        `position:absolute;left:0;top:0;width:${tall ? 4 : 7}px;height:${tall ? 11 : 7}px;border-radius:2px;` +
        `background:${CONF_TINTS[i % CONF_TINTS.length]};border:1px solid #151515;opacity:0;will-change:transform,opacity;`;
      host.appendChild(el);
      pieces.push({ el, x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0, life: 9, dur: 1 });
    }

    let lastBurst = -1e9;
    burst.current = () => {
      const now = performance.now();
      // The dock can re-open quickly; don't let bursts stack up.
      if (now - lastBurst < 1500) return;
      lastBurst = now;
      for (const p of pieces) {
        // Fan up and to the left, away from the screen edge the tab is welded to.
        const a = Math.PI * (0.6 + Math.random() * 0.75);
        const v = 220 + Math.random() * 260;
        p.x = 0;
        p.y = 0;
        p.vx = Math.cos(a) * v - 60;
        p.vy = -Math.sin(a) * v * 0.9;
        p.r = Math.random() * 360;
        p.vr = (Math.random() - 0.5) * 900;
        p.life = 0;
        p.dur = 0.9 + Math.random() * 0.5;
      }
    };

    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      for (const p of pieces) {
        if (p.life > p.dur || p.life === 9) {
          if (p.el.style.opacity !== "0") p.el.style.opacity = "0";
          continue;
        }
        p.life += dt;
        p.vy += 760 * dt;
        p.vx *= Math.pow(0.35, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.vr * dt;
        p.el.style.opacity = String(1 - cl((p.life - p.dur * 0.55) / (p.dur * 0.45)));
        p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0) rotate(${p.r}deg)`;
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      burst.current = null;
      pieces.forEach((p) => p.el.remove());
    };
  }, [q]);

  /* Fire on every open, however it was triggered — hover, click or the peek. */
  useEffect(() => {
    if (open) burst.current?.();
  }, [open]);

  useEffect(() => () => clear(), []);

  if (!q) return null;

  return (
    <div
      className={`qd${open ? " is-open" : ""}`}
      ref={wrap}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <div className="qd-card" aria-hidden={!open}>
        <div className="qd-shell">
          <div className="qd-media">
            <div className="qd-visual" aria-hidden>
              <i />
            </div>
            <div className="qd-clock" aria-hidden>
              <span>
                <b>{clock.h}</b>
                <span>Hours</span>
              </span>
              <b>:</b>
              <span>
                <b>{clock.m}</b>
                <span>Min</span>
              </span>
              <b>:</b>
              <span>
                <b>{clock.s}</b>
                <span>Sec</span>
              </span>
            </div>
          </div>

          <div className="qd-main">
            <div className="qd-top">
              <span className="qd-eyebrow">QUESTION OF THE DAY</span>
              <span className="qd-diff">
                <i aria-hidden />
                {q.difficulty}
              </span>
            </div>

            <div className="qd-q">
              <span className="qd-cal" aria-hidden>
                <b>{q.month}</b>
                <span>{q.day}</span>
              </span>
              <span className="qd-name">
                <b>{q.title}</b>
                <span>{q.topic}</span>
              </span>
            </div>

            <div className="qd-act">
              <span className="qd-exp">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
                  <circle cx="8" cy="9" r="5.5" />
                  <path d="M8 6.5V9l1.6 1.2M6.5 1.5h3" />
                </svg>
                <span>
                  Expires in{" "}
                  <b>
                    {clock.h}h {clock.m}m {clock.s}s
                  </b>
                </span>
              </span>
              <a className="qd-go" href={q.url} tabIndex={open ? 0 : -1} data-cursor="Solve">
                Solve Now <span aria-hidden>↗</span>
              </a>
            </div>

            <dl className="qd-stats">
              <div>
                <dt>Solvers Today</dt>
                <dd>{q.solvers}</dd>
              </div>
              <div>
                <dt>Acceptance Rate</dt>
                <dd>{q.acceptance}%</dd>
              </div>
              <div>
                <dt>Your Rank If You Solve</dt>
                <dd>{q.rank}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="qd-tab"
        aria-label="Question of the day"
        aria-expanded={open}
        onClick={() => {
          pinned.current = !open || !pinned.current;
          setOpen(pinned.current);
        }}
      >
        <span className="qd-dot" aria-hidden />
        <span className="qd-ring" ref={ring} aria-hidden />
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="3" width="12" height="11" rx="2.5" />
          <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
        </svg>
        <span className="qd-tab-text">Question of the Day</span>
        <span className="qd-tab-time" aria-hidden>
          {clock.h}:{clock.m}:{clock.s}
        </span>
      </button>

      <div className="qd-conf" ref={conf} aria-hidden />
    </div>
  );
}
