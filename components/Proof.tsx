import type { LandingData } from "@/lib/types";
import { COMPANIES, CTA } from "@/lib/config";

export default function Proof({ data }: { data: LandingData }) {
  const tint = new Map(COMPANIES);
  const fallback = [
    { company: "Goldman Sachs", college: "IIT Kharagpur", ago: "2h" },
    { company: "Uber", college: "NIT Trichy", ago: "5h" },
    { company: "Flipkart", college: "VIT Vellore", ago: "9h" },
    { company: "Amazon", college: "BITS Pilani", ago: "11h" },
    { company: "Atlassian", college: "IIIT Hyderabad", ago: "14h" },
    { company: "Microsoft", college: "DTU", ago: "20h" },
  ];
  const feed = data.ticker.length ? data.ticker : fallback;
  // Doubled so the marquee can wrap at the halfway point without a seam.
  const loop = [...feed, ...feed];

  // Rounded marketing figures (9,081 published questions across 654 companies),
  // pinned so the headline numbers don't wobble with every sync.
  const stats = [
    { n: 9000, label: "Real OA questions", tint: "#bfe7c7" },
    { n: 650, label: "Companies tracked", tint: "#c6dbf3" },
    { n: 1000, label: "Students placed", tint: "#f7d3b5" },
  ];

  return (
    <section className="pf" aria-labelledby="pf-title">
      <canvas className="pf-band" aria-hidden />

      <div className="pf-in">
        <div className="pf-head" data-rv>
          <div>
            <span className="eyebrow">
              <i aria-hidden />
              By the numbers
            </span>
            <h2 id="pf-title">
              The only place with your company&apos;s <em className="serif">actual OA questions.</em>
            </h2>
            <p>Recent, verified, and added within hours of each drive.</p>
          </div>
          <a className="btn" href={CTA.proofBrowse.href} data-cursor="It's free">
            {CTA.proofBrowse.label} <span aria-hidden>→</span>
          </a>
        </div>

        <div className="pf-stats">
          {stats.map((s, i) => (
            <div className="pf-stat" key={s.label} data-rv data-rv-delay={i * 110}>
              <i style={{ background: s.tint }} aria-hidden />
              <b data-count={s.n} data-suffix="+">
                {s.n.toLocaleString("en-IN")}+
              </b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="pf-tick" data-rv data-rv-delay="200">
          <span className="pf-tick-tag">
            <i aria-hidden />
            Just added
          </span>
          <div className="pf-tick-mask">
            <div className="pf-tick-move">
              {loop.map((t, i) => (
                <span key={`${t.company}-${t.college}-${i}`}>
                  <i style={{ background: tint.get(t.company) ?? "#d4e2f4" }} aria-hidden />
                  <b>{t.company}</b>
                  <span>
                    · {t.college} · {t.ago} ago
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
