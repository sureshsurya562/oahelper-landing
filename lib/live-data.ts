import "server-only";
import type { LandingData } from "./types";

/** Shape the public read-only endpoint must return. No personal fields, ever. */
export type LiveData = {
  ticker: { company: string; college: string; created_at: string }[];
  stats: { companies: number; questions: number } | null;
  hero: {
    company: string;
    questions: { title: string; created_at: string }[];
  } | null;
  upcoming: {
    company: string;
    oa_date: string;
    question_count: number;
    mock_count: number;
    last_question_at: string | null;
  }[];
  potd: {
    title: string;
    topic: string;
    difficulty: string;
    expires_at: string;
    solvers: number;
    acceptance: number;
    rank: string;
    url: string;
  } | null;
};

const EMPTY: LiveData = { ticker: [], stats: null, hero: null, upcoming: [], potd: null };

export async function getLandingData(): Promise<LandingData> {
  const url = process.env.OA_PUBLIC_API_URL;
  const useSample = process.env.USE_SAMPLE_DATA === "1" || (!url && process.env.NODE_ENV !== "production");

  let raw: LiveData = EMPTY;
  let isSample = false;

  if (url) {
    try {
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (res.ok) raw = sanitize(await res.json());
    } catch {
      raw = EMPTY;
    }
  }
  if (raw === EMPTY && useSample) {
    raw = sampleData();
    isSample = true;
  }

  const now = Date.now();
  return {
    ticker: raw.ticker.slice(0, 20).map((t) => ({ company: t.company, college: t.college, ago: ago(t.created_at, now) })),
    stats: raw.stats
      ? { companies: raw.stats.companies.toLocaleString("en-IN"), questions: raw.stats.questions.toLocaleString("en-IN") }
      : null,
    hero: raw.hero
      ? { company: raw.hero.company, questions: raw.hero.questions.slice(0, 2).map((q) => ({ title: q.title, ago: ago(q.created_at, now) })) }
      : null,
    upcoming: raw.upcoming.slice(0, 4).map((u) => ({
      company: u.company,
      inDays: inDays(u.oa_date, now),
      questionCount: u.question_count,
      mockCount: u.mock_count,
      lastAdded: u.last_question_at ? ago(u.last_question_at, now) : null,
    })),
    // The dock is a designed part of the page, not optional data — always ship one.
    potd: shapePotd(raw.potd ?? defaultPotd()),
    isSample,
  };
}

/** The daily question rotates at midnight IST, wherever the reader happens to be. */
function nextISTMidnight() {
  const OFFSET = 5.5 * 3600000;
  const ist = Date.now() + OFFSET;
  return new Date(Math.ceil(ist / 86400000) * 86400000 - OFFSET).toISOString();
}

/**
 * Shown when the API has no question of the day — including a production deploy
 * with no OA_PUBLIC_API_URL set, where sample data is deliberately off. Without
 * this the whole floating dock silently disappears.
 */
function defaultPotd(): NonNullable<LiveData["potd"]> {
  return {
    title: "Memory Buffer Access",
    topic: "Kingdom of Strings",
    difficulty: "Medium",
    expires_at: nextISTMidnight(),
    solvers: 39,
    acceptance: 89,
    rank: "#1",
    url: "https://www.oahelper.in/problems",
  };
}

function shapePotd(p: NonNullable<LiveData["potd"]>) {
  return {
    title: p.title,
    topic: p.topic,
    difficulty: p.difficulty,
    ...stamp(p.expires_at),
    expiresAt: p.expires_at,
    solvers: p.solvers,
    acceptance: p.acceptance,
    rank: p.rank,
    url: p.url,
  };
}

/** Whitelist fields so nothing else from the API can leak into the page. */
function sanitize(input: any): LiveData {
  const arr = (v: any) => (Array.isArray(v) ? v : []);
  return {
    ticker: arr(input?.ticker).map((t: any) => ({ company: String(t.company), college: String(t.college), created_at: String(t.created_at) })),
    stats:
      input?.stats && Number.isFinite(input.stats.companies) && Number.isFinite(input.stats.questions)
        ? { companies: input.stats.companies, questions: input.stats.questions }
        : null,
    hero: input?.hero
      ? {
          company: String(input.hero.company),
          questions: arr(input.hero.questions).map((q: any) => ({ title: String(q.title), created_at: String(q.created_at) })),
        }
      : null,
    upcoming: arr(input?.upcoming).map((u: any) => ({
      company: String(u.company),
      oa_date: String(u.oa_date),
      question_count: Number(u.question_count) || 0,
      mock_count: Number(u.mock_count) || 0,
      last_question_at: u.last_question_at ? String(u.last_question_at) : null,
    })),
    potd: input?.potd
      ? {
          title: String(input.potd.title),
          topic: String(input.potd.topic),
          difficulty: String(input.potd.difficulty),
          expires_at: String(input.potd.expires_at),
          solvers: Number(input.potd.solvers) || 0,
          acceptance: Number(input.potd.acceptance) || 0,
          rank: String(input.potd.rank),
          url: String(input.potd.url),
        }
      : null,
  };
}

/**
 * The calendar glyph's month and day, fixed on the server. Deriving them in the
 * browser would render a different date for anyone west of the drive's timezone.
 */
function stamp(iso: string) {
  // The badge names the day the question belongs to, not the midnight it rotates on.
  const d = new Date(new Date(iso).getTime() - 1000);
  return {
    month: d.toLocaleString("en-US", { month: "short", timeZone: "Asia/Kolkata" }).toUpperCase(),
    day: d.toLocaleString("en-US", { day: "numeric", timeZone: "Asia/Kolkata" }),
  };
}

function ago(iso: string, now: number) {
  const mins = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins || 1}m`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

function inDays(iso: string, now: number) {
  const d = Math.ceil((new Date(iso).getTime() - now) / 86400000);
  if (d <= 0) return "today";
  if (d === 1) return "tomorrow";
  return `in ${d} days`;
}

/** Local preview only. Clearly marked on the page via isSample. */
function sampleData(): LiveData {
  const h = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();
  const d = (days: number) => new Date(Date.now() + days * 86400000).toISOString();
  return {
    ticker: [
      { company: "Goldman Sachs", college: "IIT Kharagpur", created_at: h(2) },
      { company: "Uber", college: "NIT Trichy", created_at: h(5) },
      { company: "Flipkart", college: "VIT Vellore", created_at: h(9) },
      { company: "Amazon", college: "BITS Pilani", created_at: h(11) },
      { company: "Atlassian", college: "IIIT Hyderabad", created_at: h(14) },
      { company: "Microsoft", college: "DTU", created_at: h(20) },
    ],
    stats: { companies: 120, questions: 2400 },
    hero: {
      company: "Amazon",
      questions: [
        { title: "Minimum Trucks to Ship Parcels", created_at: h(3) },
        { title: "Warehouse Robot Path Cost", created_at: h(26) },
      ],
    },
    upcoming: [
      { company: "Amazon", oa_date: d(6), question_count: 48, mock_count: 3, last_question_at: h(3) },
      { company: "Goldman Sachs", oa_date: d(11), question_count: 31, mock_count: 2, last_question_at: h(20) },
      { company: "Microsoft", oa_date: d(18), question_count: 27, mock_count: 2, last_question_at: h(40) },
      { company: "Deloitte", oa_date: d(24), question_count: 19, mock_count: 1, last_question_at: h(70) },
    ],
    potd: {
      title: "Memory Buffer Access",
      topic: "Kingdom of Strings",
      difficulty: "Medium",
      expires_at: nextISTMidnight(),
      solvers: 39,
      acceptance: 89,
      rank: "#1",
      url: "https://oahelper.in/question-of-the-day",
    },
  };
}


