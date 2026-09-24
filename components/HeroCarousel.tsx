"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * `ms` is how long each slide stays up: roughly 1.5s to take in the headline plus
 * ~250ms per word, so a student can read the headline and its answer once.
 */
const SLIDES: { title: ReactNode; how: string; ms: number }[] = [
  {
    title: (
      <>
        OA Helper makes your life easier
        <br />
        in your <em>next OA.</em>
      </>
    ),
    how: "Practice the questions, patterns companies actually ask",
    ms: 5000,
  },
  {
    title: (
      <>
        Same OA as your friend.
        <br />
        You&apos;re <em>one step ahead.</em>
      </>
    ),
    how: "You've already seen the questions this company asked. They haven't.",
    ms: 6000,
  },
  {
    title: (
      <>
        Walk in knowing
        <br />
        <em>what&apos;s coming.</em>
      </>
    ),
    how: "Timed mock OAs in the exact format of the real drive",
    ms: 5000,
  },
];

const TICK_MS = 100;

/**
 * Headline rotator for the closing frame. It only counts time while the frame is
 * actually on screen, and starts from the first slide every time the frame appears.
 *
 * Two ways to stop it, so a student can take their time:
 * - hover: moving the mouse over the carousel holds it until the mouse leaves. Only a
 *   move counts, so a cursor that was already resting there when the frame arrived
 *   does not freeze it.
 * - pin: clicking/tapping the headline or the pause button holds it until toggled back.
 *   This is the touch path, where there is no hover.
 */
export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRef(0);
  const held = useRef(false);
  held.current = hover || pinned;

  const go = (n: number) => {
    shown.current = 0;
    setI(n);
  };

  useEffect(() => {
    const frame = ref.current?.closest<HTMLElement>(".cine-final");
    if (!frame) return;
    const id = window.setInterval(() => {
      const visible = Number(frame.style.opacity || 0) > 0.9 && !document.hidden;
      if (!visible) {
        if (shown.current || frame.dataset.slide !== "0") go(0);
        setHover(false);
        setPinned(false);
        return;
      }
      if (held.current) return;
      shown.current += TICK_MS;
      const at = Number(frame.dataset.slide || 0);
      if (shown.current >= SLIDES[at].ms) go((at + 1) % SLIDES.length);
    }, TICK_MS);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const frame = ref.current?.closest<HTMLElement>(".cine-final");
    if (!frame) return;
    frame.dataset.slide = String(i);
  }, [i]);

  const paused = hover || pinned;

  return (
    <div
      className="cine-car"
      ref={ref}
      aria-roledescription="carousel"
      data-paused={paused ? "" : undefined}
      onPointerMove={(e) => e.pointerType === "mouse" && !hover && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className="cine-car-track" aria-live={paused ? "off" : "polite"} onClick={() => setPinned((v) => !v)}>
        {SLIDES.map((s, n) => (
          <div
            className="cine-car-slide"
            key={n}
            data-state={n === i ? "on" : n === (i - 1 + SLIDES.length) % SLIDES.length ? "out" : "in"}
            aria-hidden={n !== i}
          >
            <h2 className="display">{s.title}</h2>
            <p className="cine-how">
              <b>How??</b>
              <span>{s.how}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Story-style bars: they say "more is coming" and how soon, at a glance. */}
      <div className="cine-car-nav">
        <button
          type="button"
          className="cine-car-pp"
          aria-label={pinned ? "Resume headlines" : "Pause headlines"}
          aria-pressed={pinned}
          onClick={() => setPinned((v) => !v)}
        >
          <svg viewBox="0 0 12 12" aria-hidden>
            {pinned ? <path d="M3 1.8v8.4L10 6z" /> : <path d="M2.5 1.5h2.4v9H2.5zM7.1 1.5h2.4v9H7.1z" />}
          </svg>
        </button>
        <span className="cine-car-count" aria-hidden>
          {String(i + 1).padStart(2, "0")} <i>/ {String(SLIDES.length).padStart(2, "0")}</i>
        </span>
        <div className="cine-car-dots" role="tablist" aria-label="Choose headline">
          {SLIDES.map((_, n) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-label={`Headline ${n + 1} of ${SLIDES.length}`}
              className={n === i ? "on" : ""}
              onClick={() => go(n)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
