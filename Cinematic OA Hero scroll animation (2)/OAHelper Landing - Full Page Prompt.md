# OAHelper Landing Page — Full Build Prompt

Build a single-page, scroll-driven marketing site for **OAHelper** (oahelper.in), a platform with real online-assessment (OA) questions shared by students, organised company by company. Tone: confident, minimal, dark-first, playful stickers. All copy below is final — use it verbatim.

---

## 1. Global style

**Colors**
- Page ground (dark): `#0b0b0b` · panels `#151515` · deeper panel `#050506` · borders `#242426` / `#2a2a2c`
- Cream ground (light sections): `#f3efe6` · ink on cream `#151515` · muted on cream `#55534e` / `#7a776f`
- Text on dark: `#f3f3f3` (headings), `#d8d8d8` (body), `#a8a8ac` / `#8a8a8e` (muted)
- Pastel accents (stickers, dots, chips): mint `#bfe7c7` (primary accent), blue `#c6dbf3`, peach `#f7d3b5`, lavender `#d9cdf4`, coral `#f5baae`, sky `#b7dcf6`, yellow `#f3e9a8`, teal `#b4eae8`, lime `#d7ee9f`, periwinkle `#c4c9f5`, pink `#f5c6d6`, apricot `#f7dcae`
- Dark text on pastel: a very dark tint of the same hue (e.g. `#16201a` on mint)

**Type**
- Main section titles (h1/h2): **Inter SemiBold 600**, tight tracking (≈ −0.035em), line-height ~1.04, sizes clamp(36px → 96px)
- Italic emphasis word inside every title: **Instrument Serif Italic 400**, ~1.06em
- Body/UI: **Geist** 400–600
- Labels, meta, code, timestamps: **Geist Mono** 400–500, 11–13px
- Section eyebrows: small ✦ four-point sparkle icon (11px) + label in Geist 500 13px, no pill/border

**Shape & surface**
- Rounded cards 22–26px radius, pill buttons 999px
- Dashed 1px dividers (`rgba(255,255,255,0.14)` on dark, `rgba(21,21,21,0.28)` on cream)
- Dotted grid backgrounds: 1px dots on a 22px grid
- "Sticker" elements: pastel fill, 1.5px off-white `#f4f1ea` or ink border, hard offset shadow `0 3px 0 #151515`, slight rotation (±2–7°), organic uneven border-radius
- Primary CTA: pill, `#f3f3f3` fill, `#111` text, "Get OA-ready →", magnetic hover, custom cursor label "Let's go"

**Motion**
- Everything reveals on scroll (fade + 24px rise, staggered 100ms)
- Custom cursor: small dot that grows into a labelled pill ("Explore", "Let's go") over interactive items
- Respect `prefers-reduced-motion` (show final states)

---

## 2. Top nav (floating over hero)
Logo left. Links: **Placements · Questions · For Campus · Contribute · OA Store**. CTA pill right.

---

## 3. Cinematic OA hero (sticky, ~320vh of scroll)
One pinned full-screen dark panel (inset 10px, radius 22px, dotted grid) that plays in phases as the user scrolls:

1. **Headline** centered: "Your next OA is *closer* than you think." (*closer* in Instrument Serif italic)
2. **12 company stickers** float around the headline, balanced so each side mixes warm and cool colors:
   - Left: Google (mint), Uber (yellow), Deloitte (sky), Amazon (peach), Goldman Sachs (lavender), Adobe (coral)
   - Right: Microsoft (blue), Atlassian (pink), Flipkart (periwinkle), Meta (apricot), Walmart (teal), JPMorgan (lime)
3. **Terminal window** rises from the bottom, titled "oahelper — zsh":
   `~/oahelper $ oa sync --companies all`
   `# every company has its own OA`
   `> loading company questions…`
   Then rows tick in with ✓: Google 186 Qs, Microsoft 164, Amazon 212, Meta 118, Adobe 97, Atlassian 84, Uber 106, Walmart 131, Deloitte 142, Flipkart 158, Goldman Sachs 123, JPMorgan 139. As each row loads, its sticker flies into the terminal.
   `> questions loaded · 12 companies · this season's papers`
   `> launching assessment…`
4. **Terminal zooms into a full OA IDE mock**: "Amazon · SDE-1 Online Assessment", tabs Q1 ✓ / Q2 / Q3, timer 44:59, Run / Submit.
   - Problem: tags Medium · Arrays · Prefix Sum. "2. Balance the Warehouses — There are n warehouses in a row. Warehouse i holds stock[i] units. In one operation you can move a single unit to an adjacent warehouse. Return the minimum number of operations so every warehouse holds the same number of units, or -1 if that is impossible." Example: `stock = [1, 0, 5]` → `4`. Constraints `1 ≤ n ≤ 10⁵`, `0 ≤ stock[i] ≤ 10⁴`. Badge: "Seen in 14 OAs this season".
   - Editor (solution.py / tests.py, "Auto-saved", Python 3): prefix-carry solution types itself in with syntax highlighting.
   - Console: "3 / 3 passed" — Case 1 ✓ 11ms, Case 2 ✓ 9ms, Case 3 ✓ 12ms. Confetti burst.
5. **Hero 2** fades in over a vignette: "OA Helper makes your life easier in your next OA." + chip "How??" + "Practice the questions, patterns companies actually ask" + CTA.

---

## 4. Stop practising blind
Dark section, dotted background. Title centered: "Stop practising *blind.*"

Below, one wide split card (radius 26px, max 1120px), two equal halves with a circular **"vs"** badge (ink circle, Instrument Serif italic) on the seam:
- **Left — mid-grey `#3a3a3d` with light dots.** Label "RANDOM PREP", title "3,000 problems. Pick whatever." A messy pile of ~11 dark "Problem #211 / #384 / #730…" cards, rotated.
- **Right — cream.** Label "OA HELPER", title "Your company. What it *actually* asked." Mint sticker note: "Asked in last Tuesday's drive. Shared the same night." Below, a stacked **company card deck** (white card, gradient banner, logo, name, role, "Practise" pill, stats Questions / This week / Practised). Deck cycles Amazon (12 · 3 · 2.4k) → Google (9 · 2 · 3.1k) → Microsoft (14 · 4 · 2.8k) → Meta (7 · 1 · 1.9k) → Uber (8 · 2 · 1.2k).

Animation (starts when in view, loops ~12s): problem cards drop into the pile → "vs" spins in → **all problem cards fly across and shrink into the company deck** → deck pops up with a bounce → note pops → deck shuffles card by card (top card swings off right and tucks to the back).

---

## 5. See, Solve and Clear (cream)
A pixel-block dissolve band transitions dark → cream. Big animated words **See → Solve → Clear** (heavy weight) around an "OA { }" motif. Then a mint sticker pill "See, Solve and Clear" and caption: "Every question here was asked in a real OA. See the pattern, solve it against the clock, and clear your round."

---

## 6. Our Features (cream, sticky carousel ~620vh)
Center: "✦ Our Features" eyebrow. Text either side of a centered card: "Everything you need beyond solving problems" (serif italic on *solving* / *problems*). Scrolling swaps the center card one by one (scale + fade), each with a small live UI mock and one-line description:

1. **OA Calendar** — month grid with company marks, "3 OAs this week", Google 10:00 AM slot 90 min. "Keep every online assessment, deadline, and interview in one calm, organized view."
2. **60-Day DSA Roadmap** — checklist Arrays & Hashing ✓, Sliding window ✓, Stack with min() (Today), Graphs locked. "120 problems, 18 patterns, built from questions students reported this season."
3. **OA Groups** — avatar stack, Google group 1.8k Members, chat bubbles, "Invite Friends". "Join peers targeting the same companies, exchange insights, and stay accountable."
4. **College Page** — IIT Hyderabad, Class of 2027 · CSE, 8 live, 24 drives, 312 placed, 86% offers, "+128 batchmates". "Drives, eligibility and cutoffs for your campus, updated by your own batch."
5. **Company-wise Questions** — three marquee rows of company logo chips with topic tags (Graph shortest path, Sliding window max, Interval merging). "Know what each company repeats, from 186 student reports this season."
6. **Mock OAs** — timer 00:42:10, Q2 OF 4 Medium, solution.py, "3/3 tests passed", Submit. "Practice on the real clock, with the same question mix and a full editor."
7. **OA Store** — ₹ voucher, gift card, "+120 OA Coins". "Solve real OA questions, contribute to the community, earn OA Coins, and redeem them for rewards."
8. **Contribute Questions** — form "New OA question · Amazon · SDE-1", "Post anonymously", Submit, "+50 OA Coins". "Type OA questions anonymously and earn rewards."

---

## 7. Compare (cream)
Eyebrow "✦ OA Helper vs others". Title "Generic prep, or your *actual OA.*" Table with a dark highlighted "✦ OA Helper" column vs "Usual prep"; rows reveal one by one with ✓ / ✕:

| | OA Helper | Usual prep |
|---|---|---|
| Questions | Real OA questions, company by company | Generic problem lists, same for every company |
| Freshness | Added hours after the drive | Old lists, updated once in a while |
| Format | The real screenshot, exact wording | Retyped, reworded versions |
| Source | Shared by students who just sat the test | Pulled from old blogs and forums |
| Practice | Timed mock OAs in the real format | Untimed, solve at your own pace |
| OA calendar | Know which company is coming, and when | You find out when the mail lands |
| Price | Free to start. Share a question, earn premium | Pay for a full course first |

---

## 8. By the numbers (dark)
Pixel band transitions cream → dark. Eyebrow "✦ By the numbers". Title "The only place with your company's *actual OA questions.*" Sub: "Recent, verified, and added within hours of each drive." CTA right.

Three dashed stat cards with a colored dot, counting up on reveal: **3500+** Real OA questions (mint) · **400+** Companies tracked (blue) · **1000+** Students placed (peach).

Ticker pill below: mint "● Just added" badge + infinite marquee: Goldman Sachs · IIT Kharagpur · 2h ago — Uber · NIT Trichy · 5h ago — Flipkart · VIT Vellore · 9h ago — Amazon · BITS Pilani · 11h ago — Atlassian · IIIT Hyderabad · 14h ago — Microsoft · DTU · 20h ago.

---

## 9. Testimonials (dark)
Two columns. Left: eyebrow "✦ Testimonials" + counter "01 / 03", title "What users *say.*", sub "Real experiences from students who prepared smarter, practised with purpose, and showed up with confidence.", stats card (avatar stack +1k, "1000+ students placed", ★★★★★ "4.8 from students"), prev/next arrows.

Right: **stacked card deck** (cards behind scale down + darken). Card style: text + small avatar, no verified chip. Auto-advances every few seconds; active card's quote reveals word by word; thin progress bar along the card's bottom edge; top card slides away and tucks to the back.
- Tripti Byas, Final-year CSE Student — "I was tired of solving random DSA questions without knowing what to expect in the actual OA. OAHelper helped me practice questions closer to the company's pattern, which made my preparation feel much more focused."
- Priya Verma, Designer — "What stood out to me was how targeted the preparation felt. Instead of endlessly searching through different resources, I could focus on the companies that actually mattered for my placement preparation."
- Rahul Kumar, Aspiring Software Engineer — "The interview experiences and contributions from other students make the platform feel genuinely useful. You get a much clearer idea of what to expect before walking into an OA."

Below: "Our students cleared OAs at" + greyscale logo marquee (Amazon, Google, Microsoft, Meta, Uber, Atlassian).

---

## 10. Close (dark)
Near-black panel `#050506`, animated canvas background, left gradient scrim. Title "See it before *you* sit it." Sub: "Stop Guessing. Start Preparing Smart." CTA.

---

## 11. Footer (dark `#0b0b0b`)
- Left: "Your next OA is closer than you think." + mono "/// Real questions from this season's OAs"
- **Product:** Company OAs, All Problems, OA Calendar, Mock OAs, DSA Sheet
- **Resources:** Interview experiences, OA groups, Contribute, Pricing
- Giant "OAHelper" wordmark (Geist 600, full width) — letters slide up one by one when it enters view
- Bottom bar (dashed top rule): white "OAHelper, powered by NxtWave" logo · About OAHelper · Privacy · Terms · © 2026 OA Helper
- Links light grey, hover mint + underline

---

## 12. Floating "Question of the Day" widget (fixed, right edge, all pages)
A vertical mint tab on the right edge: calendar icon, "Question of the Day", live countdown (e.g. 08:21:31). On hover it slides out a dark card: code-preview panel (solution.py, "2/3 passed · 1 hidden", "New question daily · 12 AM", Hours : Min : Sec countdown), "QUESTION OF THE DAY", Medium, date SEP 23, title "Memory Buffer Access", subtitle "Kingdom of Strings", "Expires in 08h 29m 58s", "Solve Now ↗" button, and stats: Solvers Today 39 · Acceptance Rate 89% · Your Rank If You Solve #1.

---

## Responsive
- Below ~760px: split cards stack, stat grids wrap, testimonials become a horizontal auto-scrolling strip, sticky scroll lengths shorten, stickers scale down.
- No horizontal page scroll at any width.
