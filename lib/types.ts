/** Pre-formatted on the server so client hydration never disagrees about "3h ago". */
export type LandingData = {
  ticker: { company: string; college: string; ago: string }[];
  stats: { companies: string; questions: string } | null;
  hero: { company: string; questions: { title: string; ago: string }[] } | null;
  upcoming: {
    company: string;
    inDays: string;
    questionCount: number;
    mockCount: number;
    lastAdded: string | null;
  }[];
  /** Today's featured question for the floating dock. */
  potd: {
    title: string;
    topic: string;
    difficulty: string;
    /** Pre-split so the calendar glyph never re-derives a date on the client. */
    month: string;
    day: string;
    /** ISO instant the question rotates; the dock counts down to it. */
    expiresAt: string;
    solvers: number;
    acceptance: number;
    rank: string;
    url: string;
  };
  isSample: boolean;
};
