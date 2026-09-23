import { LINKS, VOICE } from "@/lib/config";

export default function Close() {
  return (
    <section className="close" aria-labelledby="close-title">
      <div className="close-card">
        <h2 id="close-title">{VOICE.tagline}.</h2>
        <p>Stop Guessing. Start Preparing Smart.</p>
        <a className="btn btn-light" href={LINKS.browse}>
          {VOICE.cta} <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
