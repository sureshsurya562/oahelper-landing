"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { LandingData } from "@/lib/types";
import CompanyMark from "./CompanyMark";

/**
 * Stop practising blind — layout 3a ("split ground") from the Claude design file.
 * Dark chaos on the left, cream clarity on the right, a "vs" seal between them.
 *
 * Timeline, played from the top each time the stage comes into view:
 * 0.05–1.3  the whole problem pile tumbles in, one card after another
 * 1.1       the "vs" seal spins in
 * 1.6–2.5   the pile lifts off together and arcs across the seam into the deck
 * 2.35      the company deck pops up where the cards land
 * 2.9       the freshness note lands
 * 3.4→      the deck keeps dealing: every 1.05s the front card flicks to the back
 */

/** Launch order of the pile cards as they fly across: the whole pile, a beat apart. */
const FLY_AT = 1.6;
const FLY_GAP = 0.035;
const FLY_DUR = 0.8;
const DECK_AT = 2.35;
const NOTE_AT = 2.9;
const DEAL_AT = 3.4;

/** [x %, y px, rotation °, problem number] — the design's hand-placed scatter. */
const PILE: [number, number, number, number][] = [
  [4, 10, -12, 211],
  [38, 0, 7, 384],
  [18, 60, 14, 730],
  [52, 70, -8, 1249],
  [0, 120, -6, 1541],
  [30, 128, 18, 153],
  [60, 150, 9, 1768],
  [12, 190, -15, 2066],
  [44, 206, -4, 903],
  [66, 230, 11, 2233],
  [24, 250, 6, 2979],
];

/** The whole pile flies, nearest the seam first, so it peels off like a hand of cards. */
const FLY = PILE.map((_, i) => i).sort((a, b) => PILE[b][0] - PILE[a][0]);

type Co = { n: string; sub: string; st: [string, string, string]; bg: string; mark: string };

const DECK: Co[] = [
  {
    n: "Amazon",
    sub: "SDE-1 · OA this season",
    st: ["12", "3", "2.4k"],
    mark: "#151515",
    bg: "radial-gradient(60% 110% at 18% 20%, #ff8f2e 0%, rgba(255,143,46,0) 62%), radial-gradient(70% 120% at 82% 80%, #ffd29a 0%, rgba(255,210,154,0) 64%), radial-gradient(45% 90% at 58% 0%, #e25a12 0%, rgba(226,90,18,0) 62%), #f6ad62",
  },
  {
    n: "Google",
    sub: "STEP · OA this season",
    st: ["9", "2", "3.1k"],
    mark: "#4285f4",
    bg: "radial-gradient(55% 110% at 15% 25%, #7fb2ff 0%, rgba(127,178,255,0) 62%), radial-gradient(60% 120% at 85% 75%, #8fd8a4 0%, rgba(143,216,164,0) 64%), radial-gradient(40% 90% at 55% 0%, #ffd66e 0%, rgba(255,214,110,0) 60%), #a9c8f5",
  },
  {
    n: "Microsoft",
    sub: "SWE Intern · OA",
    st: ["14", "4", "2.8k"],
    mark: "#151515",
    bg: "radial-gradient(55% 110% at 20% 20%, #5cc4ff 0%, rgba(92,196,255,0) 62%), radial-gradient(60% 120% at 82% 80%, #b6e36a 0%, rgba(182,227,106,0) 64%), radial-gradient(40% 90% at 60% 0%, #ffcb52 0%, rgba(255,203,82,0) 60%), #9fd4f2",
  },
  {
    n: "Meta",
    sub: "Rotational · OA",
    st: ["7", "1", "1.9k"],
    mark: "#0866ff",
    bg: "radial-gradient(60% 110% at 18% 20%, #3d8bff 0%, rgba(61,139,255,0) 62%), radial-gradient(70% 120% at 82% 80%, #c8d9ff 0%, rgba(200,217,255,0) 64%), radial-gradient(45% 90% at 58% 0%, #0a4fc4 0%, rgba(10,79,196,0) 62%), #8fb4f7",
  },
  {
    n: "Uber",
    sub: "SDE-1 · OA this season",
    st: ["8", "2", "1.2k"],
    mark: "#151515",
    bg: "radial-gradient(60% 110% at 20% 20%, #5a5a60 0%, rgba(90,90,96,0) 62%), radial-gradient(70% 120% at 82% 80%, #c9c9cf 0%, rgba(201,201,207,0) 64%), #8c8c93",
  },
];

export default function Sorted({ data }: { data: LandingData }) {
  const root = useRef<HTMLElement>(null);
  // The student's own company leads the deck when it's one of ours.
  const lead = data.hero?.company;
  const deck = lead && DECK.some((c) => c.n === lead) ? [...DECK].sort((a, b) => Number(b.n === lead) - Number(a.n === lead)) : DECK;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stage = el.querySelector(".sb-split") as HTMLElement | null;
    if (!stage) return;
    const qa = (s: string) => Array.from(stage.querySelectorAll(s)) as HTMLElement[];
    const pile = qa(".sb-pc");
    const amz = stage.querySelector(".sb-deck") as HTMLElement;
    const cards = qa(".sb-co");
    const pop = stage.querySelector(".sb-note") as HTMLElement;
    const vs = stage.querySelector(".sb-vs") as HTMLElement;

    const red = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io2 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // How far each flying card travels: from its spot in the pile to the deck's centre.
    const off = (n: HTMLElement) => {
      let x = 0;
      let y = 0;
      let cur: HTMLElement | null = n;
      while (cur && cur !== stage) {
        x += cur.offsetLeft;
        y += cur.offsetTop;
        cur = cur.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };
    let hop: { dx: number; dy: number }[] = [];
    const measure = () => {
      const d = off(amz);
      const tx = d.x + amz.offsetWidth / 2;
      const ty = d.y + amz.offsetHeight / 2;
      hop = pile.map((c) => {
        const o = off(c);
        return { dx: tx - (o.x + c.offsetWidth / 2), dy: ty - (o.y + c.offsetHeight / 2) };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const e = (t: number) => 1 - Math.pow(1 - t, 3);
    const back = (t: number) => {
      const c1 = 1.7;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    let raf = 0;
    let t0 = 0;
    let on = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const T = now / 1000;
      // The loop starts from its first beat each time the stage comes into view.
      const f = red ? 4 : (now - t0) / 1000;

      pile.forEach((c, i) => {
        const r0 = PILE[i][2];
        const t = red ? 1 : e(cl((f - 0.05 - i * 0.07) / 0.6));
        const dr = Math.sin(T * 0.9 + i * 1.7) * 2.2;
        const dy = Math.sin(T * 1.1 + i) * 3;
        const j = FLY.indexOf(i);
        // Lifts, sharpens, arcs over the seam and shrinks into the deck.
        const ft = red ? 1 : io2(cl((f - FLY_AT - j * FLY_GAP) / FLY_DUR));
        const h = hop[i] || { dx: 0, dy: 0 };
        const arc = Math.sin(Math.PI * ft) * 70;
        const lift = cl(ft * 4);
        const x = h.dx * ft;
        const y = (1 - t) * -70 + dy * (1 - ft) + h.dy * ft - arc;
        const rot = (r0 + (1 - t) * (i % 2 ? 24 : -24) + dr) * (1 - ft);
        const sc = 1 + 0.08 * Math.sin(Math.PI * ft) - 0.25 * ft;
        c.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
        c.style.opacity = String(t * (0.55 + 0.45 * lift) * (1 - cl((ft - 0.8) / 0.2)));
        c.style.filter = lift > 0.5 ? "none" : `blur(${(0.6 * (1 - lift * 2)).toFixed(2)}px)`;
        c.style.zIndex = ft > 0 ? String(10 + j) : "";
      });

      const ta = red ? 1 : cl((f - DECK_AT) / 0.7);
      const ka = ta > 0 ? back(ta) : 0;
      amz.style.transform = `translateY(${((1 - ka) * 46).toFixed(1)}px) scale(${(0.9 + 0.1 * ka).toFixed(3)})`;
      amz.style.opacity = String(cl(ta * 2));

      const nC = cards.length;
      const dealT = red ? 0 : Math.max(0, f - DEAL_AT);
      const step = 1.05;
      const dk = Math.floor(dealT / step);
      const fr = e(cl((dealT % step) / 0.55));
      cards.forEach((c, i) => {
        const slot = (((i - dk) % nC) + nC) % nC;
        let x = 0;
        let y = slot * 4;
        let r = slot * (i % 2 ? 1.2 : -1.2);
        let op = slot > 3 ? 0 : 1;
        let z = nC - slot;
        // The card just dealt swings out to the right, then tucks in at the back.
        if (slot === nC - 1 && dk > 0) {
          const s = Math.sin(Math.PI * fr);
          x = s * 250;
          r = s * 14;
          y = slot * 4 * fr;
          z = fr < 0.5 ? nC + 1 : 0;
          op = fr < 0.5 ? 1 : 1 - (fr - 0.5) * 2;
        }
        c.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg)`;
        c.style.opacity = String(op);
        c.style.zIndex = String(z);
      });

      const tp = red ? 1 : cl((f - NOTE_AT) / 0.45);
      const kp = tp > 0 ? back(tp) : 0;
      pop.style.opacity = String(tp);
      pop.style.transform = `translateY(${((1 - kp) * 10).toFixed(1)}px) scale(${(0.86 + 0.14 * kp).toFixed(3)})`;

      const tv = red ? 1 : cl((f - 1.1) / 0.5);
      vs.style.transform = `translate(-50%,-50%) scale(${(tv > 0 ? back(tv) : 0).toFixed(3)}) rotate(${((1 - tv) * -90).toFixed(0)}deg)`;
    };

    // Only animate while the stage is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !on) {
          on = true;
          t0 = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && on) {
          on = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(stage);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="sb" ref={root} aria-labelledby="sb-title">
      <div className="sb-in">
        <h2 className="sb-head display" id="sb-title" data-rv>
          Stop practising <em>blind.</em>
        </h2>

        <div className="sb-split">
          <div className="sb-side is-rand">
            <span className="sb-label">RANDOM PREP</span>
            <b className="sb-say">
              3,000 problems.
              <br />
              Pick whatever.
            </b>
            <span className="sb-hope">→ hope it shows up</span>
            <div className="sb-pile" aria-hidden>
              {PILE.map(([x, y, , n], i) => (
                <div className="sb-pc" key={n} style={{ left: `${x}%`, top: y } as CSSProperties}>
                  <span>Problem #{n}</span>
                  <i />
                  <i />
                </div>
              ))}
            </div>
          </div>

          <div className="sb-side is-oa">
            <span className="sb-label">OA HELPER</span>
            <b className="sb-say">
              Your company.
              <br />
              What it <em>actually</em> asked.
            </b>
            <div className="sb-show">
              <span className="sb-note">Asked in last Tuesday&apos;s drive. Shared the same night.</span>
              <div className="sb-deck">
                <div className="sb-plate p2" aria-hidden />
                <div className="sb-plate p1" aria-hidden />
                {deck.map((c, i) => (
                  <div className="sb-co" key={c.n} aria-hidden={i > 0}>
                    <div className="sb-ban" style={{ background: c.bg }} />
                    <div className="sb-who">
                      <span className="sb-av" style={{ color: c.mark }}>
                        <CompanyMark name={c.n} ink="#fff" />
                      </span>
                      <span className="sb-name">
                        <b>{c.n}</b>
                        <span>{c.sub}</span>
                      </span>
                      <span className="sb-go">Practise</span>
                    </div>
                    <div className="sb-stats">
                      <span>
                        <b>{c.st[0]}</b>
                        <span>Questions</span>
                      </span>
                      <span>
                        <b>{c.st[1]}</b>
                        <span>This week</span>
                      </span>
                      <span>
                        <b>{c.st[2]}</b>
                        <span>Practised</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <span className="sb-vs" aria-hidden>
            vs
          </span>
        </div>
      </div>
    </section>
  );
}
