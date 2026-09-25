"use client";

import { useEffect, useRef, useState } from "react";
import type { LandingData } from "@/lib/types";
import Hero from "./Hero";
import { mountIntro, pickTier, TIERS, type Tier } from "./intro/engine";

const SRC = "/intro";

/**
 * Scroll-driven opening shot: a student at a desk in a meadow, the camera dollies past him
 * into the monitor, and the monitor is the hero. The screen shows a still copy of the hero's
 * first frame; for the last few percent the real hero is pinned onto the glass and then simply
 * takes over, so the page never cuts. Reduced motion skips the intro entirely (see globals.css).
 */
export default function CinematicIntro({ data }: { data: LandingData }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const bgBlur = useRef<HTMLImageElement>(null);
  const brand = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const focus = useRef<HTMLDivElement>(null);
  const focusBlur = useRef<HTMLImageElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const screenBox = useRef<HTMLDivElement>(null);
  const student = useRef<HTMLDivElement>(null);
  const studentBlur = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bloom = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);

  const [tier, setTier] = useState<Tier>("desktop");
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const sync = () => {
      setTier(pickTier(window.innerWidth, window.innerHeight, coarse.matches));
      setReduced(mq.matches);
    };
    sync();
    window.addEventListener("resize", sync);
    mq.addEventListener("change", sync);
    return () => {
      window.removeEventListener("resize", sync);
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const m = tier === "mobile";
    const imgs = [bg, plate, focus, student].map((r) => r.current?.querySelector("img") ?? null);
    for (const im of imgs) {
      const want = im?.dataset.src?.replace(".webp", m ? ".m.webp" : ".webp");
      if (im && want && im.getAttribute("src") !== want) im.setAttribute("src", want);
    }

    // Cover the stage until the plates have decoded, or 1.2 s at most.
    let alive = true;
    const settle = (im: HTMLImageElement | null) =>
      new Promise<void>((res) => {
        if (!im) return res();
        if (im.complete && im.naturalWidth > 0) {
          (im.decode ? im.decode() : Promise.resolve()).then(
            () => res(),
            () => res(),
          );
          setTimeout(res, 150);
          return;
        }
        im.addEventListener("load", () => res(), { once: true });
        im.addEventListener("error", () => res(), { once: true });
      });
    Promise.race([Promise.all(imgs.map(settle)), new Promise((r) => setTimeout(r, 1200))]).then(() => {
      if (alive) setReady(true);
    });

    const need = <T,>(r: { current: T | null }) => r.current as T;
    const destroy = mountIntro(
      {
        section: need(section),
        stage: need(stage),
        layers: { bg: need(bg), brand: need(brand), plate: need(plate), focus: need(focus), student: need(student) },
        blurs: { bg: need(bgBlur), focus: need(focusBlur), student: need(studentBlur) },
        screen: need(screen),
        screenBox: need(screenBox),
        glow: need(glow),
        shade: need(shade),
        bloom: need(bloom),
        cue: need(cue),
        canvas: need(canvas),
        live: section.current?.nextElementSibling instanceof HTMLElement ? section.current.nextElementSibling : null,
      },
      tier,
    );
    return () => {
      alive = false;
      destroy();
    };
  }, [tier, reduced]);

  return (
    <section className="intro" ref={section} aria-hidden style={{ height: `${TIERS[tier].sectionVh}vh` }}>
      <div className="intro-stage" ref={stage}>
        <div className="intro-scene">
          <div className="intro-card" ref={bg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/bg.webp`} data-src={`${SRC}/bg.webp`} alt="" draggable={false} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/bg-blur.webp`} alt="" draggable={false} ref={bgBlur} className="intro-blur" />
          </div>

          {/* The wordmark sits behind the meadow, so the grass overlaps its feet. */}
          <div className="intro-card intro-brand" ref={brand}>
            <h1 aria-label="OAHELPER">
              {"OAHELPER".split("").map((ch, i) => (
                <span data-l key={i} aria-hidden>
                  {ch}
                </span>
              ))}
            </h1>
          </div>

          <div className="intro-card" ref={plate}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/plate.webp`} data-src={`${SRC}/plate.webp`} alt="" draggable={false} />
          </div>

          <div className="intro-card" ref={focus}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/focus.webp`} data-src={`${SRC}/focus.webp`} alt="" draggable={false} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/focus-blur.webp`} alt="" draggable={false} ref={focusBlur} className="intro-blur" />
          </div>

          <div className="intro-shade" ref={shade} />

          <div className="intro-screen" ref={screen}>
            <div className="intro-glow" ref={glow} />
            <div className="intro-glass">
              <div className="intro-box" ref={screenBox} inert>
                <Hero data={data} still />
              </div>
              <div className="intro-px" />
              <div className="intro-sheen" />
            </div>
            <div className="intro-ca">
              <i />
              <i />
            </div>
          </div>

          <div className="intro-card" ref={student}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/student.webp`} data-src={`${SRC}/student.webp`} alt="" draggable={false} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/student-blur.webp`} alt="" draggable={false} ref={studentBlur} className="intro-blur" />
          </div>

          <canvas className="intro-motes" ref={canvas} />
          <div className="intro-bloom" ref={bloom} />
          <div className="intro-cue" ref={cue}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6.5l6 5 6-5" />
              <path d="M6 12.5l6 5 6-5" />
            </svg>
          </div>
        </div>

        <div className={`intro-cover${ready ? " is-ready" : ""}`} />
      </div>
    </section>
  );
}
