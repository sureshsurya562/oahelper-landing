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
  isSample: boolean;
};
