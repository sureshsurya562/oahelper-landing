import type { LandingData } from "@/lib/types";

export default function Ticker({ items }: { items: LandingData["ticker"] }) {
  if (items.length === 0) return null;

  const row = (
    <span className="ticker-row">
      {items.map((t, i) => (
        <span key={i} className="ticker-item">
          <b>{t.company}</b> · {t.college} · {t.ago} ago
        </span>
      ))}
    </span>
  );

  return (
    <div className="ticker" aria-label="Recently added questions">
      <span className="ticker-badge">
        <i /> Just added
      </span>
      <div className="ticker-track">
        <div className="ticker-move">
          {row}
          <span aria-hidden>{row}</span>
        </div>
      </div>
    </div>
  );
}
