import { LINKS, VOICE } from "@/lib/config";

const STATS = [
  { n: "3500+", label: "Real OA questions" },
  { n: "400+", label: "Companies tracked" },
  { n: "1000+", label: "Students placed" },
];

export default function Proof() {
  return (
    <section className="proof" aria-labelledby="proof-title">
      <p className="proof-eyebrow">By the numbers</p>

      <div className="proof-head">
        <div>
          <h2 id="proof-title">The only place with your company&apos;s actual OA questions.</h2>
          <p>Recent, verified, and added within hours of each drive.</p>
        </div>
        <a className="btn btn-primary" href={LINKS.browse}>
          {VOICE.cta}
        </a>
      </div>

      <ul className="proof-stats">
        {STATS.map((s) => (
          <li key={s.label}>
            <b>{s.n}</b>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
