import AskAI from "./AskAI";
import Team from "./Team";
import ClosingFx from "./ClosingFx";
import { CTA, LINKS } from "@/lib/config";

const PRODUCT = [
  { label: "Company OAs", href: "https://www.oahelper.in/companies" },
  { label: "All Problems", href: "https://www.oahelper.in/problems" },
  { label: "OA Calendar", href: "https://www.oahelper.in/oa-calendar" },
  { label: "Mock OAs", href: "https://www.oahelper.in/mock-oa" },
  { label: "DSA Sheet", href: "https://www.oahelper.in/placement-prep" },
];

const RESOURCES = [
  { label: "Interview experiences", href: "https://www.oahelper.in/interview-experiences" },
  { label: "Topics", href: "https://www.oahelper.in/topics" },
  { label: "Contribute", href: "https://www.oahelper.in/contribute" },
  { label: "Company Insights", href: "https://www.oahelper.in/company-insights" },
  { label: "Premium", href: "https://www.oahelper.in/premium" },
];

/** Taken as-is from the footer on oahelper.in. */
const LEGAL = [
  { label: "Terms", href: "https://www.oahelper.in/terms-of-service" },
  { label: "Privacy", href: "https://www.oahelper.in/privacy-policy" },
  { label: "Refunds", href: "https://www.oahelper.in/refund-policy" },
  { label: "Trust & Safety", href: "https://www.oahelper.in/trust-oahelper" },
  { label: "Contact", href: "https://www.oahelper.in/contact" },
];

const WORDMARK = "OAHelper";

export default function Close() {
  return (
    <section className="cl" aria-labelledby="cl-title">
      <div className="pr-panel">
        <canvas className="pr-canvas" aria-hidden />
        <div className="pr-scrim" aria-hidden />

        <div className="pr-body" data-rv>
          <h2 className="display" id="cl-title">
            See it before
            <br />
            you <em>sit it.</em>
            <span className="pr-caret" aria-hidden />
          </h2>
          <p>Stop Guessing. Start Preparing Smart.</p>
          {/* Only now, with the whole argument read, does the page ask for an account. */}
          <a className="btn" href={CTA.closeSignup.href} data-cursor="30 seconds">
            {CTA.closeSignup.label} <span aria-hidden>→</span>
          </a>
          <p className="pr-note">
            Free forever. An account saves your progress, bookmarks questions and warns you before your next drive.
          </p>
          <a className="pr-alt" href={CTA.closeAlt.href}>
            {CTA.closeAlt.label}
          </a>
        </div>
      </div>

      <Team />

      <footer className="fw-foot">
        <div className="fw-in">
          <AskAI />

          <div className="fw-top">
            <div className="fw-say">
              <span>Your next OA is closer than you think.</span>
              <span className="fw-live">
                <i aria-hidden />
                Real questions from this season&apos;s OAs
              </span>
            </div>
            <nav className="fw-col" aria-label="Product">
              <span className="fw-mono">Product</span>
              {PRODUCT.map((l) => (
                <a href={l.href} key={l.label}>
                  {l.label}
                </a>
              ))}
            </nav>
            <nav className="fw-col" aria-label="Resources">
              <span className="fw-mono">Resources</span>
              {RESOURCES.map((l) => (
                <a href={l.href} key={l.label}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Set at 100px, then scaled by ClosingFx to fill the line exactly. */}
          <div className="fw-wrap">
            <div className="fw" aria-label={WORDMARK} role="img">
              {WORDMARK.split("").map((ch, i) => (
                <i key={`${ch}-${i}`} aria-hidden>
                  {ch}
                </i>
              ))}
            </div>
          </div>

          <div className="fw-base">
            <a className="fw-lockup" href={LINKS.home} aria-label="OA Helper home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/oahelper-nxtwave-lockup-dark.png" alt="OA Helper, powered by NxtWave" width={1181} height={180} />
            </a>
            <nav className="fw-legal" aria-label="Legal">
              {LEGAL.map((l) => (
                <a href={l.href} key={l.label}>
                  {l.label}
                </a>
              ))}
              <span className="fw-mono">© 2026 OA Helper</span>
            </nav>
          </div>
        </div>
      </footer>

      <ClosingFx />
    </section>
  );
}
