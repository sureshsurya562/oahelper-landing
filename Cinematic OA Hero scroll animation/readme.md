# OAHelper Design System

OAHelper (oahelper.in) is a campus-placement prep product for Indian engineering students. Its core promise: **real online-assessment (OA) questions, shared by students who just sat them, organised company by company**, plus an OA calendar, timed mock OAs, company-wise topic patterns, interview experiences and a daily Question of the Day. The main surface covered here is the marketing landing page.

## Sources
- GitHub: `sureshsurya562/oahelper-landing` (branch `main`), a Next.js app. Copy and section structure come from `components/*.tsx` and `lib/config.ts`. Its `app/globals.css` uses an older palette (Inter, JetBrains Mono, orange `#ff6a1a`, green `#3ddc84`) that this system **replaces**.
- `OAHelper Landing.dc.html` in this project: the redesigned, scroll-animated landing page. This is the visual source of truth for this system.
- User references: a landing-page screenshot (cinematic hero with company stickers), a screen recording of a pastel bento "Build, deliver, earn" section (adapted here as "See, Solve and Clear"), and a Question of the Day banner screenshot.

## Index
- `styles.css`: the single entry point; imports every file in `tokens/`.
- `tokens/`: `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css` (radii, shadows, patterns), `motion.css`.
- `assets/logo/`: official logo PNGs.
- `guidelines/`: foundation specimen cards (Colors, Type, Spacing, Effects, Brand).
- `components/`
  - `core/`: Button, Tag, Eyebrow, Callout, Sticker, Logo, Wordmark
  - `cards/`: BentoCard, StatTile, QuestionCard, TestimonialCard
  - `navigation/`: NavBar
  - `product/`: TerminalWindow, CompareTable, QotdBanner, QotdTab
- `ui_kits/landing/`: the landing page composed from components (Hero, ValueSection, CompareSection, ProofSection, CloseSection) with a working QOTD tab.
- `_ds_loader.js`: helper the cards and kit use to load component sources in the browser.
- `SKILL.md`: Agent Skill entry point.

## Content fundamentals
- **Voice:** a peer who just sat the test, not a coaching institute. Plain, specific, a little urgent. It speaks to the student as "you/your" ("Your next OA is closer than you think."). The product refers to itself as "OA Helper" (with a space) in copy and "OAHelper" in the wordmark.
- **Headlines:** sentence case, short, usually ending with a full stop: "Stop practising blind.", "Generic prep, or your actual OA.", "See it before you sit it." One word or phrase per headline gets the italic serif accent (*closer*, *actual OA.*, *sit it.*).
- **Spelling:** the repo mixes British and American forms ("practising", "practise what my company actually asks" and also "Practice"). Keep what the source says; for new copy, prefer British "practise" (verb) and "practice" (noun).
- **Eyebrows:** mono, prefixed with `///`: "/// By the numbers", "/// OA Helper vs others".
- **Specifics over claims:** company names, roles and months ("Amazon · SDE-1 OA · Aug 2026"), recency ("Goldman Sachs · IIT Kharagpur · 2h ago"), counts with a plus ("3500+ Real OA questions"). Don't use invented superlatives.
- **CTA:** "Get OA-ready" with a trailing arrow. Secondary: "Solve Now ↗", "Browse". The tagline is "See it before you sit it."
- **Contrast framing:** "Random prep" vs "OA Helper", "Usual prep" vs OA Helper, stated as plain facts: "Old lists, updated once in a while".
- **No emoji.** The only glyphs are Unicode: → ↗ ✓ ✕ ✦ ★ · and the `///` prefix.
- **Casing exceptions:** UI labels and value props can be Title Case ("Question of the Day", "Real OA Questions Actually Asked in Interviews", "Stop Guessing. Start Preparing Smart.").

## Visual foundations
- **Two grounds, alternating:** ink (`--ink-1000` page, `--ink-900` framed panel) and warm paper (`--paper-100`). The page reads dark → paper → dark, and each switch is a **pixel-dissolve band**: a 14px (10px on mobile) blocky pixel edge that shifts as you scroll. Never use smooth gradients between the two grounds.
- **Framed panel:** hero-scale dark sections sit in a panel inset 10px from the viewport, radius 22px, 1px hairline border `rgba(255,255,255,0.07)`, filled with a 22px dot grid (`--pattern-dots`). Dark media wells inside cards use the finer 18px grid.
- **Colour:** neutrals do most of the work. Colour comes only from the twelve **sticker pastels**, each paired with a near-black ink of the same hue. Each company keeps one pastel everywhere (Amazon = peach, Google = mint, Microsoft = sky…). Mint (`--accent`) is the one action/highlight colour. Avoid saturated brand colours, blue-purple gradients and neon.
- **Type:** Geist Light (300) for display and section heads, with tight negative tracking (-0.04 to -0.045em). One word in Instrument Serif italic at 1.06em. Geist 500–600 for titles and UI, and Geist Mono for eyebrows, meta, descriptions inside bento cards, terminal and code. The See/Solve/Clear words are the one heavy-weight exception: Geist 800 with a 3px ink stroke and a stacked 7px hard shadow.
- **Stickers:** pastel fill, 1.5px cream rim (`--paper-rim`), slightly irregular radius (`--radius-sticker`), soft drop shadow plus an inner top highlight, tilted within ±7°. Stickers float gently (sine drift, 2–6px) while idle.
- **Callouts:** the "important" treatment is a pastel pill with a 1.5px *black* border and a hard 3px offset shadow (`--shadow-hard`). Use one per section.
- **Cards:** on paper, bento cards are `--paper-50` with a 1px **dashed** border `rgba(21,21,21,0.28)`, radius 22px, padding 14px, and a dark media well (radius 14px). On ink, cards are `--ink-850/800` with a 1px solid `--ink-650` border and radius 14px. Don't use coloured left-border accents.
- **Shadows:** hard offset shadows for sticker-like UI (callouts, QOTD tab `-4px 4px 0`), soft large shadows for floating dark objects (`--shadow-float`, `--shadow-terminal`), and `--shadow-card-hover` for lifted paper cards.
- **Radii:** 6 / 8 / 12 / 14 / 16 / 22 / 24 / pill. Buttons, tags and eyebrows are always pills.
- **Transparency and blur:** used sparingly. There's one glass plate (the QOTD countdown: `rgba(15,15,16,0.72)` + 8px blur), cool radial glows behind the terminal, a mint glow behind the question fan, and a vignette during the hero zoom. Everything else is opaque.
- **Imagery:** very little. Product UI (terminal, editor, calendar, question cards) stands in for illustration. User-supplied imagery (QOTD visual) sits in rounded frames with a glass overlay.
- **Motion:** scroll-scrubbed and exponentially smoothed (damping ≈7). Reveals fade up 36px over 0.85s with `--ease-out`, staggered 100–120ms. Pop-ins (See/Solve/Clear) use a back-ease overshoot. Card hover lifts 4px over 0.4s. Button press nudges down 1px; accent buttons deepen their hard shadow on hover. Every scene respects `prefers-reduced-motion` (animations become fades).
- **Hover:** light buttons go pure white, ghost buttons brighten text and border, links go from muted to `--fg-1`, the QOTD tab lightens, and fanned question cards spread apart.
- **Layout:** content max 1120px, gutter 20px, section padding roughly 100–240px vertical. The QOTD tab is the only fixed element (right edge, vertically centred). Grids use `auto-fit, minmax(280px, 1fr)` and wrap instead of shrinking type.

## Iconography
- There's no icon font or icon set in the repo, and none was supplied. Icons are Unicode glyphs: → (CTA), ↗ (Solve Now disc), ✓ / ✕ (compare, test cases), ✦ (OA Helper column mark), ★ (ratings), · (meta separator).
- The few line icons in the landing (clock, calendar on the QOTD tab, eye on the See/Solve/Clear tile) are simple 1.4–1.6px-stroke rounded outlines. If more are needed, use **Lucide** from CDN (stroke 1.5, round caps). That's a substitution, flagged in Caveats.
- Colour chips (small rounded squares in a company's pastel) act as company "icons" in lists, tickers and terminal rows.
- No emoji anywhere.

## Brand mark
Logo files are in `assets/logo/`. They were cut from the supplied screenshot as transparent PNGs; ask for vector SVGs before print or large-scale use.
- `oahelper-mark-white.png` / `-ink.png`: the circled "A" mark.
- `oahelper-logo-white.png` / `-ink.png`: the mark plus "OAHelper". Use this in the nav at 26px tall.
- `oahelper-nxtwave-lockup-dark.png` / `-light.png`: the logo, a divider and "Powered by NXTWAVE". Use this in the footer and on partner surfaces.

Use white artwork on ink and ink artwork on paper. Never recolour, outline or tilt the logo; NxtWave blue appears only inside the lockup. The **Logo** component renders these files, and **Wordmark** remains a text-only fallback.

## Intentional additions
- **Wordmark**: text fallback for places an image can't load.
- **Callout, Sticker, Eyebrow**: extracted from repeated patterns in the redesigned landing; the repo has no component library.

## Caveats
- Fonts load from Google Fonts; no local font binaries were supplied.
- Numbers, question titles and QOTD stats in examples are placeholders or the repo's sample data.
