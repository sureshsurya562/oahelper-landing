"use client";

import { useRef } from "react";
import type { LandingData } from "@/lib/types";
import { COMPANY_NAMES } from "@/lib/config";
import { useStoryMotion } from "./useStoryMotion";
import OAWindow from "./OAWindow";
import Ticker from "./Ticker";

const EXTRA_DESKTOP_NAMES = ["Google", "Meta", "Nvidia", "Intel", "Cisco", "Zomato", "Paytm", "Infosys", "Accenture", "Visa"];

const DRIFT_SLOTS = [
  { left: "4%", top: "20%", z: -120 },
  { left: "82%", top: "16%", z: -40 },
  { left: "9%", top: "64%", z: -260 },
  { left: "86%", top: "58%", z: -180 },
  { left: "2%", top: "42%", z: 40 },
  { left: "90%", top: "38%", z: -320 },
  { left: "14%", top: "84%", z: -60 },
  { left: "76%", top: "82%", z: -220 },
];

const PILE_SIZE = 18;
const STACK_SIZE = 10;

export default function Story({ data }: { data: LandingData }) {
  const root = useRef<HTMLElement>(null);
  useStoryMotion(root, STACK_SIZE);

  const company = data.hero?.company ?? "Amazon";
  const storm = [...COMPANY_NAMES.filter((c) => c !== company), company];
  const desktopExtras = EXTRA_DESKTOP_NAMES.filter((c) => c !== company);

  return (
    <section className="story" ref={root} aria-label="How OA Helper works">
      <div className="stage">
        <div className="floor" aria-hidden />
        <div className="glow" aria-hidden />

        {/* Scene 0: hero */}
        <div className="layer scene-hero">
          <div className="drift" aria-hidden>
            {COMPANY_NAMES.slice(0, DRIFT_SLOTS.length).map((name, i) => {
              const s = DRIFT_SLOTS[i];
              return (
                <span
                  key={name}
                  className="drift-name"
                  style={{
                    left: s.left,
                    top: s.top,
                    transform: `translateZ(${s.z}px)`,
                    filter: s.z < -150 ? "blur(2px)" : undefined,
                    opacity: s.z < -150 ? 0.25 : 0.45,
                  }}
                >
                  {name}
                </span>
              );
            })}
          </div>
          <div className="hero-copy">
            <h1>Your next OA is closer than you think.</h1>
            <p className="sub">Practice the questions, patterns companies actually ask</p>
          </div>
          <p className="scroll-hint">
            Scroll to start the test <span aria-hidden>↓</span>
          </p>
          <Ticker items={data.ticker} />
        </div>

        <div className="layer oa-pos">
          <div className="oa-anchor">
            <div className="oa-tilt">
              <div className="oa-float">
                <OAWindow company={company} questions={data.hero?.questions ?? []} />
              </div>
            </div>
          </div>
        </div>

        {/* Scene 1: find your company */}
        <div className="layer s1">
          <div className="storm" aria-hidden>
            {desktopExtras.map((name) => (
              <span key={name} className="storm-name storm-extra">
                {name}
              </span>
            ))}
            {storm.map((name) => (
              <span key={name} className="storm-name">
                {name}
              </span>
            ))}
          </div>
          <div className="swap s1-lines">
            <h2 className="s1-l1">Every company has its own OA.</h2>
            <h2 className="s1-l2">OA Helper makes your life easier in your next OA.</h2>
          </div>
          <div className="s1-gap" aria-hidden />
          {data.stats && (
            <p className="s1-proof">
              {data.stats.companies}+ companies · {data.stats.questions}+ real questions · updated daily
            </p>
          )}
        </div>

        {/* Scene 2: stop practising blind */}
        <div className="layer s2">
          <h2 className="s2-head">Stop practising blind.</h2>
          <div className="s2-grid">
            <div className="s2-col s2-left">
              <p className="s2-label">Random prep</p>
              <pre className="s2-pre">{"3,000 problems\n→ pick whatever\n→ hope it shows up"}</pre>
              <div className="s2-slot" data-slot="pile" />
            </div>
            <div className="s2-col s2-right">
              <p className="s2-label accent">OA Helper</p>
              <pre className="s2-pre">{"Your company\n→ what it asked this season\n→ the questions that matter"}</pre>
              <div className="s2-slot" data-slot="stack" />
            </div>
          </div>
          <div className="pile" aria-hidden>
            {Array.from({ length: PILE_SIZE }, (_, i) => {
              const stackIndex = i < STACK_SIZE ? i : -1;
              const isTop = stackIndex === STACK_SIZE - 1;
              return (
                <div key={i} className={`qcard${stackIndex >= 0 ? " to-stack" : " stay"}`}>
                  <span className="qcard-num">Problem #{(i * 173 + 211) % 2999}</span>
                  <span className="qcard-line" />
                  <span className="qcard-line short" />
                  {stackIndex >= 0 && (
                    <span className="qcard-on">
                      <b>{company}</b>
                      <span>OA · this season</span>
                    </span>
                  )}
                  {isTop && <span className="qcard-fresh">Asked in last Tuesday&apos;s drive. Shared the same night.</span>}
                </div>
              );
            })}
          </div>
          <p className="s2-fresh-static">Asked in last Tuesday&apos;s drive. Shared the same night.</p>
        </div>

      </div>
    </section>
  );
}
