"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { LandingData } from "@/lib/types";

type Card = {
  tag: string;
  title: string;
  line: string;
  path: string;
  screen: string;
  /** Drop a real screenshot in /public/shots and point here; the mock below is the stand-in. */
  shot?: string;
  mock: ReactNode;
};

function buildCards(data: LandingData): Card[] {
  const upcoming = data.upcoming.length
    ? data.upcoming
    : [
        { company: "Amazon", inDays: "in 6 days", questionCount: 48, mockCount: 3, lastAdded: "3h" },
        { company: "Goldman Sachs", inDays: "in 11 days", questionCount: 31, mockCount: 2, lastAdded: "20h" },
        { company: "Microsoft", inDays: "in 18 days", questionCount: 27, mockCount: 2, lastAdded: "2d" },
      ];

  return [
    {
      tag: "Company questions",
      title: "What your company actually asks",
      line: data.stats
        ? `${data.stats.questions}+ real questions, ${data.stats.companies}+ companies.`
        : "Real questions, company by company.",
      path: "oahelper.in/questions/amazon",
      screen: "Amazon · this season",
      mock: (
        <ul className="mk-list">
          <li>
            <span>Graph shortest path</span>
            <b>4×</b>
          </li>
          <li>
            <span>Sliding window max</span>
            <b>3×</b>
          </li>
          <li>
            <span>Interval merging</span>
            <b>3×</b>
          </li>
        </ul>
      ),
    },
    {
      tag: "OA calendar",
      title: "Know the date before the mail",
      line: "Every drive and deadline, weeks ahead.",
      path: "oahelper.in/calendar",
      screen: "Next 30 days",
      mock: (
        <ul className="mk-list">
          {upcoming.slice(0, 3).map((u, i) => (
            <li key={u.company} className={i === 0 ? "next" : undefined}>
              <span>{u.company}</span>
              <b>{u.inDays}</b>
            </li>
          ))}
        </ul>
      ),
    },
    {
      tag: "Mock OAs",
      title: "Sit it before you sit it",
      line: "Same clock. Same format.",
      path: "oahelper.in/mock-oa",
      screen: "Mock OA · Amazon",
      mock: (
        <div className="mk-mock">
          <p className="mk-clock">00:42:10</p>
          <p className="mk-mock-row">
            <span>Q2 of 4</span>
            <b className="ok">3 / 3 passed</b>
          </p>
          <span className="mk-track">
            <i style={{ width: "62%" }} />
          </span>
        </div>
      ),
    },
    {
      tag: "DSA roadmap",
      title: "60 days, 18 patterns",
      line: "Ordered by what OAs repeat.",
      path: "oahelper.in/dsa-sheet",
      screen: "60-day plan",
      mock: (
        <div className="mk-road">
          <ul>
            <li className="done">Arrays &amp; hashing</li>
            <li className="done">Two pointers</li>
            <li className="now">Sliding window</li>
            <li className="lock">Graphs</li>
          </ul>
          <span className="mk-track">
            <i style={{ width: "42%" }} />
          </span>
        </div>
      ),
    },
    {
      tag: "Real screenshots",
      title: "The real screen, not a rewrite",
      line: "Actual shots, full solutions.",
      path: "oahelper.in/questions/amazon/q2",
      screen: "Question 2 of 3",
      mock: (
        <div className="mk-shot">
          <span className="mk-shot-tag">Amazon OA · shared 3h ago</span>
          <span className="mk-shot-line" />
          <span className="mk-shot-line short" />
          <span className="mk-shot-line" />
          <span className="mk-shot-line short" />
        </div>
      ),
    },
    {
      tag: "Interview experiences",
      title: "What comes after the OA",
      line: "Round by round, from students who cleared.",
      path: "oahelper.in/interviews",
      screen: "Amazon · SDE-1",
      mock: (
        <div className="mk-rounds">
          <span className="done">OA</span>
          <span className="done">Tech 1</span>
          <span className="now">Tech 2</span>
          <span>HR</span>
        </div>
      ),
    },
    {
      tag: "Your campus",
      title: "Your college's real numbers",
      line: "Cutoffs kept current by your batch.",
      path: "oahelper.in/campus/iiit-hyderabad",
      screen: "Class of 2027",
      mock: (
        <div className="mk-stats">
          <span>
            <b>24</b>drives
          </span>
          <span>
            <b>312</b>placed
          </span>
          <span>
            <b>86%</b>offers
          </span>
        </div>
      ),
    },
    {
      tag: "OA groups",
      title: "Everyone sitting the same test",
      line: "Same-day intel from other slots.",
      path: "oahelper.in/groups/amazon",
      screen: "Amazon · 2027 batch",
      mock: (
        <div className="mk-group">
          <span className="mk-avatars" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
          <p>
            <b>1,800+</b> preparing for Amazon
          </p>
          <p className="mk-msg">&ldquo;Graphs came twice in today&apos;s slot&rdquo;</p>
        </div>
      ),
    },
    {
      tag: "Contribute",
      title: "Share one, unlock premium",
      line: "Anonymous posts earn OA Coins.",
      path: "oahelper.in/contribute",
      screen: "New submission",
      mock: (
        <div className="mk-coins">
          <span className="mk-coin">+50 OA Coins</span>
          <p className="mk-msg">Posted anonymously · live in ~1h</p>
        </div>
      ),
    },
  ];
}

export default function Value({ data }: { data: LandingData }) {
  const rail = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const flat = useRef(false);
  const [pos, setPos] = useState({ ratio: 1, progress: 0, index: 1 });
  const cards = buildCards(data);

  /** Cards tilt away from the front of the rail, like a deck being flicked through. */
  const paint = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    // Pivot on the leading card, so the deck opens on card 01 sitting upright.
    const step = first.offsetWidth + 20;
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const pivot = box.left + padLeft + first.offsetWidth / 2;
    const reach = step * 2.2;
    let closest = { i: 0, d: Infinity };

    const spins: HTMLElement[] = [];
    Array.from(el.children).forEach((node, i) => {
      const card = node as HTMLElement;
      const r = card.getBoundingClientRect();
      const raw = (r.left + r.width / 2 - pivot) / reach;
      const d = Math.max(-1.4, Math.min(1.4, raw));
      if (Math.abs(d) < closest.d) closest = { i, d: Math.abs(d) };

      // Transform the inner layer, never the snap target itself, or snapping fights the tilt.
      const inner = card.firstElementChild as HTMLElement | null;
      if (inner && !flat.current) {
        inner.style.transform = `perspective(1400px) rotateY(${-d * 26}deg) translateZ(${-Math.abs(d) * 150}px) scale(${
          1 - Math.abs(d) * 0.04
        })`;
        inner.style.opacity = String(1 - Math.min(0.62, Math.abs(d) * 0.5));
      }
      spins.push(card);
    });
    spins.forEach((card, i) => card.classList.toggle("is-focus", i === closest.i));

    const max = el.scrollWidth - el.clientWidth;
    setPos({
      ratio: el.clientWidth / el.scrollWidth,
      progress: max > 0 ? el.scrollLeft / max : 0,
      index: closest.i + 1,
    });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    flat.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        paint();
      });
    };

    paint();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [paint]);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".vcard");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
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
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="value" aria-labelledby="value-title">
      <div className="value-head">
        <div>
          <p className="value-eyebrow">What you get</p>
          <h2 id="value-title">Your whole OA season, handled.</h2>
        </div>
        <div className="value-nav">
          <span className="value-count" aria-hidden>
            {pad(pos.index)} / {pad(cards.length)}
          </span>
          <button type="button" onClick={() => page(-1)} disabled={atStart} aria-label="Previous card">
            ←
          </button>
          <button type="button" onClick={() => page(1)} disabled={atEnd} aria-label="Next card">
            →
          </button>
        </div>
      </div>

      <div
        className={`rail${atStart ? " at-start" : ""}${atEnd ? " at-end" : ""}`}
        ref={rail}
        onPointerDown={onPointerDown}
        tabIndex={0}
        role="group"
        aria-label="What you get, scroll sideways"
      >
        {cards.map((c, i) => (
          <article className="vcard" key={c.title}>
            <div className="vc-3d">
              <div className="vc-bar">
                <span className="vc-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="vc-url">{c.path}</span>
                <span className="vc-num">{pad(i + 1)}</span>
              </div>
              <div className="vc-screen">
                {c.shot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="vc-shot" src={c.shot} alt={`${c.tag} on OA Helper`} loading="lazy" decoding="async" />
                ) : (
                  <div className="vc-mock">
                    <p className="vc-mock-top">
                      <span>{c.screen}</span>
                      <b>
                        <i aria-hidden /> live
                      </b>
                    </p>
                    <div className="vc-mock-body">{c.mock}</div>
                  </div>
                )}
              </div>
              <div className="vc-body">
                <span className="vc-label">{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.line}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="rail-bar" aria-hidden>
        <i style={{ width: `${pos.ratio * 100}%`, left: `${pos.progress * (100 - pos.ratio * 100)}%` }} />
      </div>
    </section>
  );
}
