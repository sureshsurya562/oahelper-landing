const ROWS = [
  {
    label: "Questions",
    us: "Real OA questions, company by company",
    them: "Generic problem lists, same for every company",
  },
  {
    label: "Freshness",
    us: "Added hours after the drive",
    them: "Old lists, updated once in a while",
  },
  {
    label: "Format",
    us: "The real screenshot, exact wording",
    them: "Retyped, reworded versions",
  },
  {
    label: "Source",
    us: "Shared by students who just sat the test",
    them: "Pulled from old blogs and forums",
  },
  {
    label: "Practice",
    us: "Timed mock OAs in the real format",
    them: "Untimed, solve at your own pace",
  },
  {
    label: "OA calendar",
    us: "Know which company is coming, and when",
    them: "You find out when the mail lands",
  },
  {
    label: "Price",
    us: "Free to start. Share a question, earn premium",
    them: "Pay for a full course first",
  },
];

export default function Compare() {
  return (
    <section className="vs" aria-labelledby="vs-title">
      <p className="vs-eyebrow">OA Helper vs others</p>
      <h2 id="vs-title">Generic prep, or your actual OA.</h2>

      <div className="vs-frame">
        <table className="vs-table">
          <thead>
            <tr>
              <td className="vs-corner" />
              <th scope="col" className="us">
                <span className="vs-head">
                  <span className="vs-mark" aria-hidden>
                    ✦
                  </span>
                  OA Helper
                </span>
              </th>
              <th scope="col" className="them">
                Usual prep
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                <td className="us">
                  <span className="vs-cell">
                    <span className="vs-ic yes" aria-hidden>
                      ✓
                    </span>
                    {r.us}
                  </span>
                </td>
                <td className="them">
                  <span className="vs-cell">
                    <span className="vs-ic no" aria-hidden>
                      ✕
                    </span>
                    {r.them}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
