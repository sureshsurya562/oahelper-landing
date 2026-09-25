"use client";

import { useEffect, useRef } from "react";

/**
 * "What users say." — ported from the Testimonials design (Canvas-3, card style
 * "Text + small avatar", no badge). A deck of three cards: every HOLD_MS the front
 * card swings off to the left and the next one settles in, its quote revealing word
 * by word, with a progress bar along the bottom. Arrows step it by hand. Below it,
 * a marquee of the companies students cleared OAs at.
 */
const HOLD_MS = 5200;
const LEAVE_MS = 700;

const VOICES = [
  {
    q: "I was tired of solving random DSA questions without knowing what to expect in the actual OA. OAHelper helped me practice questions closer to the company's pattern, which made my preparation feel much more focused.",
    av: 1,
    name: "Tripti Byas",
    role: "Final-year CSE Student",
    bg: "#c6dbf3",
  },
  {
    q: "What stood out to me was how targeted the preparation felt. Instead of endlessly searching through different resources, I could focus on the companies that actually mattered for my placement preparation.",
    av: 3,
    name: "Priya Verma",
    role: "Designer",
    bg: "#bfe7c7",
  },
  {
    q: "The interview experiences and contributions from other students make the platform feel genuinely useful. You get a much clearer idea of what to expect before walking into an OA.",
    av: 2,
    name: "Rahul Kumar",
    role: "Aspiring Software Engineer",
    bg: "#f7d3b5",
  },
];

const LOGOS = [
  ["amazon", "Amazon"],
  ["google", "Google"],
  ["microsoft", "Microsoft"],
  ["meta", "Meta"],
  ["uber", "Uber"],
  ["atlassian", "Atlassian"],
];

const FACES = [
  [1, "#c6dbf3"],
  [2, "#f7d3b5"],
  [3, "#f5c6d6"],
  [4, "#d9cdf4"],
  [5, "#bfe7c7"],
] as const;

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const step = useRef<(d: number) => void>(() => {});

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".vt-card"));
    const idx = el.querySelector<HTMLElement>(".vt-idx");
    const mq = el.querySelector<HTMLElement>(".vt-mq");
    const n = cards.length;
    const red = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const e = (t: number) => 1 - Math.pow(1 - t, 3);

    const S = cards.map((_, i) => ({ y: -i * 22, s: 1 - i * 0.06, r: 0, x: 0 }));
    let act = 0;
    let t0 = performance.now();
    let changed = t0;
    let lt = 0;
    let raf = 0;
    let on = false;

    const go = (d: number) => {
      act = (act + d + n) % n;
      t0 = changed = performance.now();
    };
    step.current = go;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (lt || now)) / 1000);
      const K = 1 - Math.exp(-dt * 8);
      lt = now;
      if (!red && now - t0 > HOLD_MS) go(1);
      const T = now / 1000;
      const label = `0${act + 1}`;
      if (idx && idx.textContent !== label) idx.textContent = label;

      cards.forEach((c, i) => {
        const rel = (((i - act) % n) + n) % n;
        const o = S[i];
        // The card that was just in front swings off to the left, then tucks in at the back.
        const leaving = rel === n - 1 && now - changed < LEAVE_MS;
        const lk = cl((now - changed) / LEAVE_MS);
        let ty = -rel * 22;
        let ts = 1 - rel * 0.06;
        let tr = rel === 0 ? 0 : rel === 1 ? 2.5 : -2.5;
        let tx = 0;
        let op = 1;
        if (leaving) {
          tx = -e(lk) * 140;
          tr = -e(lk) * 10;
          op = 1 - lk;
          ty = 30 * lk;
          ts = 1 - 0.06 * lk;
        }
        o.y += (ty - o.y) * K;
        o.s += (ts - o.s) * K;
        o.r += (tr - o.r) * K;
        o.x = leaving ? tx : o.x + (0 - o.x) * K;
        const bob = rel === 0 ? Math.sin(T * 1.2) * 3 : 0;
        c.style.transform = `translate(${o.x.toFixed(1)}px,${(o.y + bob).toFixed(1)}px) rotate(${o.r.toFixed(2)}deg) scale(${o.s.toFixed(3)})`;
        c.style.zIndex = String(leaving ? n + 1 : n - rel);
        c.style.opacity = String(leaving ? op : rel > 2 ? 0 : 1);
        c.style.filter = rel === 0 || leaving ? "none" : `brightness(${1 - rel * 0.22})`;

        // The front quote reveals word by word each time it arrives.
        c.querySelectorAll<HTMLElement>(".vt-q span").forEach((w, j) => {
          const t = rel !== 0 || red ? 1 : e(cl(((now - changed) / 1000 - 0.25 - j * 0.03) / 0.45));
          w.style.opacity = String(t);
          w.style.filter = t < 1 ? `blur(${((1 - t) * 5).toFixed(1)}px)` : "none";
          w.style.transform = t < 1 ? `translateY(${((1 - t) * 8).toFixed(1)}px)` : "none";
        });
        const bar = c.querySelector<HTMLElement>(".vt-bar");
        if (bar) bar.style.transform = `scaleX(${(rel === 0 && !red ? cl((now - t0) / HOLD_MS) : 0).toFixed(3)})`;
      });

      if (mq && !red) {
        const half = mq.scrollWidth / 2;
        if (half) mq.style.transform = `translateX(${(-(T * 30) % half).toFixed(1)}px)`;
      }
    };

    // Only animate (and only count down) while the section is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !on) {
        on = true;
        lt = 0;
        t0 = changed = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && on) {
        on = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="vt" ref={root} aria-labelledby="vt-title">
      <div className="vt-in">
        <div className="vt-copy">
          <div className="vt-lab">
            <span>
              <svg viewBox="0 0 16 16" aria-hidden>
                <path d="M8 0C8.6 4.6 11.4 7.4 16 8C11.4 8.6 8.6 11.4 8 16C7.4 11.4 4.6 8.6 0 8C4.6 7.4 7.4 4.6 8 0Z" />
              </svg>
              Testimonials
            </span>
            <span className="vt-count" aria-hidden>
              <span className="vt-idx">01</span> / 0{VOICES.length}
            </span>
          </div>
          <h2 id="vt-title">
            What users <em className="serif">say.</em>
          </h2>
          <p className="vt-sub">Real experiences from students who prepared smarter, practised with purpose, and showed up with confidence.</p>

          <div className="vt-proof">
            <div className="vt-stat">
              <b>1000+</b>
              <span>students placed</span>
            </div>
            <div className="vt-crowd">
              <div className="vt-faces" aria-hidden>
                {FACES.map(([a, bg]) => (
                  <span key={a} style={{ background: bg }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/team/avatar-${a}.png`} alt="" width={36} height={36} loading="lazy" />
                  </span>
                ))}
                <span className="vt-more">+1k</span>
              </div>
              <span className="vt-rate">
                <span aria-hidden>★★★★★</span>4.8 from students
              </span>
            </div>
          </div>

          <div className="vt-nav">
            <button type="button" aria-label="Previous testimonial" onClick={() => step.current(-1)}>
              ←
            </button>
            <button type="button" aria-label="Next testimonial" className="is-next" onClick={() => step.current(1)}>
              →
            </button>
          </div>
        </div>

        <div className="vt-deck">
          {VOICES.map((v) => (
            <figure className="vt-card" key={v.name}>
              <div className="vt-card-in">
                <span className="vt-mark" style={{ color: v.bg }} aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="vt-q">
                  {v.q.split(/\s+/).map((w, j) => (
                    <span key={j}>{w} </span>
                  ))}
                </blockquote>
                <figcaption className="vt-who">
                  <span className="vt-av" style={{ background: v.bg }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/team/avatar-${v.av}.png`} alt="" width={48} height={48} loading="lazy" />
                  </span>
                  <span className="vt-name">
                    <b>{v.name}</b>
                    <span>{v.role}</span>
                  </span>
                  <span className="vt-go" aria-hidden>
                    ↗
                  </span>
                </figcaption>
                <span className="vt-bar" style={{ background: v.bg }} aria-hidden />
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className="vt-logos">
        <span>Our students cleared OAs at</span>
        <div className="vt-mask">
          <div className="vt-mq">
            {[...LOGOS, ...LOGOS].map(([f, n], i) => (
              <span key={`${f}-${i}`} aria-hidden={i >= LOGOS.length}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/logos/${f}.svg`} alt="" height={26} />
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
