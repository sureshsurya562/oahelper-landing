import { Fragment } from "react";

const ROWS = [
  { label: "Questions", us: "Real OA questions, company by company", them: "Generic problem lists, same for every company" },
  { label: "Freshness", us: "Added hours after the drive", them: "Old lists, updated once in a while" },
  { label: "Format", us: "The real screenshot, exact wording", them: "Retyped, reworded versions" },
  { label: "Source", us: "Shared by students who just sat the test", them: "Pulled from old blogs and forums" },
  { label: "Practice", us: "Timed mock OAs in the real format", them: "Untimed, solve at your own pace" },
  { label: "OA calendar", us: "Know which company is coming, and when", them: "You find out when the mail lands" },
  { label: "Price", us: "Free to start. Share a question, earn premium", them: "Pay for a full course first" },
];

export default function Compare() {
  return (
    <section className="cmp" aria-labelledby="cmp-title">
      <div className="cmp-in">
        <div className="cmp-head" data-rv>
          <span className="eyebrow on-paper">/// OA Helper vs others</span>
          <h2 id="cmp-title">
            Generic prep, or your <em className="serif">actual OA.</em>
          </h2>
        </div>

        <div data-rv data-rv-delay="120">
          {/* Wide: one grid, with the OA Helper column cut out as a dark slab. */}
          <div className="cmp-table">
            <div className="cmp-slab" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <div className="cmp-rows">
              <span />
              <span className="cmp-us-head">
                <i aria-hidden>✦</i>OA Helper
              </span>
              <span className="cmp-them-head">Usual prep</span>
              {ROWS.map((r) => (
                <Fragment key={r.label}>
                  <span className="cmp-label">{r.label}</span>
                  <span className="cmp-us">
                    <span className="cmp-yes" aria-hidden>
                      ✓
                    </span>
                    <span>{r.us}</span>
                  </span>
                  <span className="cmp-them">
                    <span className="cmp-no" aria-hidden>
                      ✕
                    </span>
                    <span>{r.them}</span>
                  </span>
                </Fragment>
              ))}
            </div>
          </div>

          {/* Narrow: the same rows, one card each. */}
          <div className="cmp-stack">
            {ROWS.map((r) => (
              <div key={r.label}>
                <span className="cmp-label">{r.label}</span>
                <span className="cmp-us">
                  <span className="cmp-yes" aria-hidden>
                    ✓
                  </span>
                  <span>{r.us}</span>
                </span>
                <span className="cmp-them">
                  <span className="cmp-no" aria-hidden>
                    ✕
                  </span>
                  <span>{r.them}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
