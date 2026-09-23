"use client";

import { useEffect, useRef } from "react";

type Props = {
  company: string;
  questions: { title: string; ago: string }[];
};

const START_SECONDS = 47 * 60 + 32;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function OAWindow({ company, questions }: Props) {
  const timer = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let s = START_SECONDS;
    const id = window.setInterval(() => {
      s = s > 0 ? s - 1 : START_SECONDS;
      if (timer.current) timer.current.textContent = fmt(s);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const problem = questions[0]?.title ?? "Minimum Trucks to Ship Parcels";
  const added = questions[0]?.ago;

  return (
    <div className="laptop" role="img" aria-label={`Mock ${company} online assessment on a laptop screen`}>
      <div className="laptop-lid">
        <div className="laptop-bezel">
          <span className="laptop-cam" aria-hidden />
          <div className="laptop-screen">
            <div className="ide">
              <div className="ide-bar">
                <span className="swap oa-head-label">
                  <span className="oa-head-company">{company.toUpperCase()} · ONLINE ASSESSMENT</span>
                  <span className="oa-head-search">Finding your company…</span>
                </span>
                <span className="ide-tabs">
                  <i className="ide-tab done">Q1</i>
                  <i className="ide-tab active">Q2</i>
                  <i className="ide-tab">Q3</i>
                </span>
                <span className="ide-right">
                  <span className="ide-proctor">
                    <i /> proctored
                  </span>
                  <span className="oa-timer" ref={timer}>
                    {fmt(START_SECONDS)}
                  </span>
                </span>
              </div>

              <div className="ide-body">
                <div className="ide-prob">
                  <p className="ide-prob-head">
                    <span className="ide-prob-title">{problem}</span>
                    <span className="ide-chip">Medium</span>
                  </p>
                  <p className="ide-prob-meta">
                    100 points{added ? ` · added ${added} ago` : ""}
                  </p>
                  <p className="ide-prob-text">
                    A warehouse has <b>n</b> parcels with weights <code>w[i]</code>. Each truck carries at most two parcels and a
                    total weight of <code>cap</code>. Return the minimum number of trucks needed to ship every parcel.
                  </p>
                  <div className="ide-example">
                    <p>
                      <span>Input</span> w = [3, 2, 2, 1], cap = 3
                    </p>
                    <p>
                      <span>Output</span> 3
                    </p>
                    <p className="ide-example-note">Pair (1, 2); ship 2 and 3 alone.</p>
                  </div>
                  <ul className="ide-constraints">
                    <li>1 ≤ n ≤ 5 · 10^4</li>
                    <li>1 ≤ w[i] ≤ cap ≤ 3 · 10^4</li>
                  </ul>
                </div>

                <div className="ide-code">
                  <div className="ide-file">
                    <span className="ide-dots" aria-hidden>
                      <i />
                      <i />
                      <i />
                    </span>
                    solution.cpp
                    <span className="ide-lang">C++17</span>
                  </div>
                  <ol className="ide-lines">
                    <li>
                      <span className="k">class</span> <span className="t">Solution</span> {"{"}
                    </li>
                    <li>
                      <span className="k">public</span>:
                    </li>
                    <li>
                      {"  "}
                      <span className="k">int</span> <span className="f">minTrucks</span>(vector&lt;<span className="k">int</span>
                      &gt;&amp; w, <span className="k">int</span> cap) {"{"}
                    </li>
                    <li>{"    sort(w.begin(), w.end());"}</li>
                    <li>
                      {"    "}
                      <span className="k">int</span> i = <span className="n">0</span>, j = w.size() - <span className="n">1</span>,
                      trucks = <span className="n">0</span>;
                    </li>
                    <li>
                      {"    "}
                      <span className="k">while</span> (i &lt;= j) {"{"}
                    </li>
                    <li>
                      {"      "}
                      <span className="k">if</span> (w[i] + w[j] &lt;= cap) i++;
                    </li>
                    <li>{"      j--; trucks++;"}</li>
                    <li>{"    }"}</li>
                    <li>
                      {"    "}
                      <span className="c">{"// greedy: heaviest pairs with lightest"}</span>
                    </li>
                    <li>
                      {"    "}
                      <span className="k">return</span> trucks;
                      <span className="caret" />
                    </li>
                    <li>{"  }"}</li>
                    <li>{"};"}</li>
                  </ol>
                  <div className="ide-console">
                    <p className="ide-case pass">
                      <i /> Sample case 1 · passed <b>0.01s</b>
                    </p>
                    <p className="ide-case pass">
                      <i /> Sample case 2 · passed <b>0.02s</b>
                    </p>
                    <p className="ide-case run">
                      <i /> Hidden tests · running…
                    </p>
                  </div>
                </div>
              </div>

              <div className="ide-foot">
                <span className="ide-save">All changes saved</span>
                <span className="ide-btn">Run Code</span>
                <span className="ide-btn solid">Submit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="laptop-base" aria-hidden>
        <span className="laptop-lip" />
      </div>
    </div>
  );
}
