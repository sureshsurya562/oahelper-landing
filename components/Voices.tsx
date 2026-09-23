const VOICES = [
  {
    quote:
      "I stopped solving random DSA sets. Now I practise what my company actually asks, and prep finally feels focused.",
    name: "Tripti Byas",
    role: "Final-year CSE",
    initials: "TB",
    featured: false,
  },
  {
    quote:
      "Instead of digging through random resources, I only see the companies that matter for my placements.",
    name: "Priya Verma",
    role: "Final-year student",
    initials: "PV",
    featured: true,
  },
  {
    quote:
      "The interview experiences make the next round less of a black box. You walk in knowing what to expect.",
    name: "Rahul Kumar",
    role: "Aspiring SDE",
    initials: "RK",
    featured: false,
  },
];

export default function Voices() {
  return (
    <section className="voices" aria-labelledby="voices-title">
      <p className="voices-eyebrow">From the last season</p>
      <h2 id="voices-title">Students like you. Here&apos;s what they said.</h2>

      <ul className="voices-grid">
        {VOICES.map((v) => (
          <li key={v.name} className={v.featured ? "featured" : undefined}>
            <p className="stars" aria-label="5 out of 5">
              ★★★★★
            </p>
            <blockquote>
              <p>&ldquo;{v.quote}&rdquo;</p>
            </blockquote>
            <div className="who">
              <span className="who-av" aria-hidden>
                {v.initials}
              </span>
              <span>
                <b>{v.name}</b>
                <i>{v.role}</i>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
