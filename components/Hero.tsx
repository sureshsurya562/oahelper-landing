"use client";

import { useRef } from "react";
import type { LandingData } from "@/lib/types";
import { COMPANY_NAMES, LINKS, VOICE } from "@/lib/config";
import Ticker from "./Ticker";
import { useCinematicHero } from "./useCinematicHero";

export default function Hero({ data }: { data: LandingData }) {
  const root = useRef<HTMLElement>(null);
  useCinematicHero(root);

  const company = data.hero?.company ?? "Amazon";
  const counts = new Map(data.upcoming.map((u) => [u.company, u.questionCount]));
  // The student's own company leads, so the orange sticker is the one they came for.
  const names = [company, ...COMPANY_NAMES.filter((c) => c !== company)].slice(0, 12);
  const synced = data.stats
    ? `${data.stats.companies} companies · ${data.stats.questions} questions`
    : `${names.length} companies · this season's papers`;

  return (
    <section className="cine" ref={root} aria-label="How OA Helper works">
      <div className="cine-sticky">
        <div className="cine-panel">
          <div className="cine-grid" aria-hidden />

          <div className="cine-head">
            <h1>Your next OA is closer than you think.</h1>
            <p className="cine-sub">Practice the questions, patterns companies actually ask</p>
          </div>

          <div className="cine-dim" aria-hidden />

          {/* Terminal that syncs the companies, then becomes the assessment itself. */}
          <div className="cine-term">
            <div className="cine-glow" aria-hidden />
            <div className="cine-frame">
              <div className="cine-bar">
                <span className="cine-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="cine-bar-title">oahelper — zsh</span>
              </div>

              <div className="cine-log">
                <p className="cine-cmd">
                  <span className="cine-prompt">~/oahelper $</span>
                  <span>oa sync --companies all</span>
                  <span className="cine-cur1" aria-hidden />
                </p>
                <span className="cine-status">
                  <span className="cine-wait"># every company has its own OA</span>
                  <span className="cine-load">&gt; loading company questions…</span>
                </span>
                <div className="cine-rows">
                  {names.map((name, i) => (
                    <div className="cine-row" key={name}>
                      <span className={`cine-chip c${i}`} aria-hidden />
                      <span className="cine-co">{name}</span>
                      {counts.has(name) && <span className="cine-qs">{counts.get(name)} Qs</span>}
                      <span className="cine-ok">✓</span>
                    </div>
                  ))}
                </div>
                <p className="cine-loaded">&gt; questions loaded · {synced}</p>
                <p className="cine-launch">
                  <span>&gt; launching assessment…</span>
                  <span className="cine-cur2" aria-hidden />
                </p>
              </div>

              {/* The real thing: same clock, same layout they will sit in. */}
              <div className="cine-ui">
                <div className="cine-top">
                  <span className="cine-brand">
                    <span className="cine-brand-name">
                      <b>OA</b>Helper
                    </span>
                    <i />
                    <span>{company} · SDE-1 Online Assessment</span>
                  </span>
                  <span className="cine-qnav">
                    <span className="done">Q1 ✓</span>
                    <span className="now">Q2</span>
                    <span>Q3</span>
                  </span>
                  <span className="cine-tools">
                    <span className="cine-clock">
                      <i />
                      <span className="cine-timer">44:59</span>
                    </span>
                    <span className="cine-run">Run</span>
                    <span className="cine-submit">Submit</span>
                  </span>
                </div>

                <div className="cine-body">
                  <div className="cine-prob">
                    <span className="cine-tags">
                      <i className="hot">Medium</i>
                      <i>Arrays</i>
                      <i>Prefix Sum</i>
                    </span>
                    <h2>2. Balance the Warehouses</h2>
                    <p>
                      There are n warehouses in a row. Warehouse i holds stock[i] units. In one operation you can move a single unit to an
                      adjacent warehouse.
                    </p>
                    <p>
                      Return the minimum number of operations so every warehouse holds the same number of units, or -1 if that is
                      impossible.
                    </p>
                    <span className="cine-k">Example 1</span>
                    <pre className="cine-io">{"Input:  stock = [1, 0, 5]\nOutput: 4"}</pre>
                    <span className="cine-k">Constraints</span>
                    <pre className="cine-cons">{"1 ≤ n ≤ 10⁵\n0 ≤ stock[i] ≤ 10⁴"}</pre>
                    <span className="cine-seen">
                      <i aria-hidden />
                      Seen in 14 OAs this season
                    </span>
                  </div>

                  <div className="cine-editor">
                    <div className="cine-tabs">
                      <span>
                        <b>solution.py</b>
                        <i>tests.py</i>
                      </span>
                      <span className="cine-lang">Python 3 ▾</span>
                    </div>
                    <pre className="cine-code" aria-label="Solution code">
                      <code>
                        <span className="ln">
                          <i>1</i>
                          <em>
                            <span className="kw">from</span> typing <span className="kw">import</span> <span className="ty">List</span>
                          </em>
                        </span>
                        <span className="ln">
                          <i>2</i>
                          <em> </em>
                        </span>
                        <span className="ln">
                          <i>3</i>
                          <em>
                            <span className="kw">class</span> <span className="ty">Solution</span>:
                          </em>
                        </span>
                        <span className="ln">
                          <i>4</i>
                          <em>
                            {"    "}
                            <span className="kw">def</span> <span className="fn">minOperations</span>(<span className="dim">self</span>,
                            stock: <span className="ty">List</span>[<span className="ty">int</span>]) -&gt; <span className="ty">int</span>:
                          </em>
                        </span>
                        <span className="ln">
                          <i>5</i>
                          <em>
                            {"        "}total, n = <span className="fn">sum</span>(stock), <span className="fn">len</span>(stock)
                          </em>
                        </span>
                        <span className="ln">
                          <i>6</i>
                          <em>
                            {"        "}
                            <span className="kw">if</span> total % n:
                          </em>
                        </span>
                        <span className="ln">
                          <i>7</i>
                          <em>
                            {"            "}
                            <span className="kw">return</span> <span className="num">-1</span>
                          </em>
                        </span>
                        <span className="ln">
                          <i>8</i>
                          <em> </em>
                        </span>
                        <span className="ln">
                          <i>9</i>
                          <em>{"        target = total // n"}</em>
                        </span>
                        <span className="ln">
                          <i>10</i>
                          <em>
                            {"        ops = carry = "}
                            <span className="num">0</span>
                          </em>
                        </span>
                        <span className="ln">
                          <i>11</i>
                          <em className="cm">{"        # units that must cross each boundary"}</em>
                        </span>
                        <span className="ln">
                          <i>12</i>
                          <em>
                            {"        "}
                            <span className="kw">for</span> units <span className="kw">in</span> stock:
                          </em>
                        </span>
                        <span className="ln">
                          <i>13</i>
                          <em>{"            carry += units - target"}</em>
                        </span>
                        <span className="ln is-here">
                          <i>14</i>
                          <em>
                            {"            ops += "}
                            <span className="fn">abs</span>(carry)
                          </em>
                          <span className="cine-caret" aria-hidden />
                        </span>
                        <span className="ln">
                          <i>15</i>
                          <em> </em>
                        </span>
                        <span className="ln">
                          <i>16</i>
                          <em>
                            {"        "}
                            <span className="kw">return</span> ops
                          </em>
                        </span>
                      </code>
                    </pre>

                    <div className="cine-tests">
                      <div className="cine-tests-bar">
                        <span>
                          <b>Test cases</b>
                          <i>Console</i>
                        </span>
                        <span className="cine-pass">3 / 3 passed</span>
                      </div>
                      <div className="cine-cases">
                        {[
                          { n: 1, ms: "11 ms", io: "stock = [1, 0, 5]", got: "4" },
                          { n: 2, ms: "9 ms", io: "stock = [0, 3, 0]", got: "2" },
                          { n: 3, ms: "12 ms", io: "stock = [4, 1, 1, 2]", got: "3" },
                        ].map((c) => (
                          <div className="cine-case" key={c.n}>
                            <span>
                              <b>Case {c.n}</b>
                              <i>✓ {c.ms}</i>
                            </span>
                            <span>{c.io}</span>
                            <span>
                              expected <b>{c.got}</b> · got <b>{c.got}</b>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cine-scan" aria-hidden />
              <div className="cine-flash" aria-hidden />
            </div>
            <div className="cine-rim" aria-hidden />
          </div>

          {names.map((name, i) => (
            <div className={`cine-sticker c${i}`} key={name} aria-hidden>
              <span>{name}</span>
            </div>
          ))}

          <div className="cine-vig" aria-hidden />

          <div className="cine-final">
            <h2>OA Helper makes your life easier in your next OA.</h2>
            <a className="btn btn-primary" href={LINKS.browse}>
              {VOICE.cta} <span aria-hidden>→</span>
            </a>
            <Ticker items={data.ticker} />
          </div>
        </div>
      </div>
    </section>
  );
}
