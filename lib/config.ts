export const LINKS = {
  browse: "https://oahelper.in/questions",
  share: "https://oahelper.in/share",
  plans: "https://oahelper.in/pricing",
  home: "https://oahelper.in",
};

/** The design's own five items, pointed at the closest live route. */
export const NAV_LINKS = [
  { label: "Placements", href: "https://www.oahelper.in/placement-prep" },
  { label: "Questions", href: "https://www.oahelper.in/problems" },
  { label: "For Campus", href: "https://www.oahelper.in/companies" },
  { label: "Contribute", href: "https://www.oahelper.in/contribute" },
  { label: "OA Store", href: "https://www.oahelper.in/premium" },
];

export const NAV_CTA = { label: "Let's Chat!", href: "https://www.oahelper.in/contact" };

export const VOICE = {
  tagline: "See it before you sit it",
  cta: "Get OA-ready",
};

export const PRODUCT = {
  // Flip to true only once the Mock OA report card actually outputs a topic-wise breakdown.
  reportHasTopicBreakdown: true,
  // Flip to true only if the OA Calendar is filtered by the student's college.
  calendarIsPerCampus: false,
};

/** Every company carries one pastel from the design's sticker set. */
export const COMPANIES: [string, string][] = [
  ["Google", "#bfe7c7"],
  ["Microsoft", "#c6dbf3"],
  ["Amazon", "#f7d3b5"],
  ["Meta", "#d9cdf4"],
  ["Adobe", "#f5baae"],
  ["Atlassian", "#b7dcf6"],
  ["Uber", "#f3e9a8"],
  ["Walmart", "#b4eae8"],
  ["Deloitte", "#d7ee9f"],
  ["Flipkart", "#c4c9f5"],
  ["Goldman Sachs", "#d4e2f4"],
  ["JPMorgan", "#e3d7f0"],
];

export const COMPANY_NAMES = COMPANIES.map(([name]) => name);

/** Sticker ink, chosen per pastel so the label always reads. */
export const STICKER_INK: Record<string, string> = {
  "#bfe7c7": "#16201a",
  "#c6dbf3": "#161b22",
  "#f7d3b5": "#22190f",
  "#d9cdf4": "#1d1622",
  "#f5baae": "#221513",
  "#b7dcf6": "#121b22",
  "#f3e9a8": "#221f10",
  "#b4eae8": "#0f2221",
  "#d7ee9f": "#1a200f",
  "#c4c9f5": "#15172a",
  "#d4e2f4": "#141a22",
  "#e3d7f0": "#1d1622",
};

/** Hand-cut corners: each sticker gets its own wobble so none look stamped. */
export const STICKER_RADII = [
  "22px 19px 21px 18px / 18px 21px 19px 22px",
  "20px 22px 18px 21px / 21px 18px 22px 19px",
  "19px 21px 22px 18px / 22px 19px 18px 21px",
  "21px 19px 22px 18px / 19px 22px 18px 21px",
  "18px 22px 19px 21px / 20px 19px 22px 18px",
  "22px 18px 21px 19px / 18px 22px 20px 19px",
];
