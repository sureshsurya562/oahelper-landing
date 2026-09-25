# OAHelper "Our Features" stacked cards: build prompt

Build a scroll-pinned "Our Features" section for the OAHelper landing page. The cards stack one on top of another as the user scrolls. There's no final spread or row: the section ends with the last card on top of the stack.

## Layout
- The page background is #161616. The section is about 720vh tall, with a sticky inner stage of 100vh (overflow hidden).
- In the centre of the stage is a 320px-wide card stack. Above it is a small label, "✦ Our Features" (Geist 500, 13px, white, four-point sparkle icon).
- Split headline on either side of the stack, in Geist 400, clamp(22px, 2.1vw, 30px), letter-spacing -0.02em, white:
  - Left, sitting 24px from the card's left edge: "Everything you / solving"
  - Right, sitting 24px from the card's right edge: "need beyond / problems"
- Below 760px wide, the text moves above ("Everything you") and below ("need beyond solving problems") the stack, centred, and the cards scale to fit.

## Card style
- Card: 320px wide, background #2b2b2b, radius 12px, padding 14px 14px 16px, 12px gap between rows, shadow 0 30px 60px -24px rgba(0,0,0,.7).
- Header row: title (Geist 600, 16px, white) on the left, white ✦ sparkle (14px) on the right.
- Illustration panel: 240px tall, radius 10px, overflow hidden, with a pastel background for each card.
- Description: Geist 400, 11.5px/1.45, #e4e4e4.
- Hover: 2px #66708f outline ring, 0.25s transition.

## Cards (in order, with panel colour and illustration)
1. **OA Calendar** (grey gradient #f3f3f5 → #d6d6db). A dark calendar grid (#141414, 7 columns, 28 cells of #262626) rising from the bottom, with a few marked cells (red "A", yellow, blue "G"). Two elements float up and down: a purple "3 OAs this week" pill at the top right, and a white chip at the bottom left reading "Google · 10:00 AM slot 90 min" with a yellow "16" date.
   Copy: "Keep every online assessment, deadline, and interview in one calm, organized view."
2. **60-Day DSA Roadmap** (mint #dcfce5). A thick green snake path (13px stroke, #3ecf6a over a #bdeecb track) with checkpoints: two green ✓ tiles and one yellow "current" tile. White pills read "Arrays & Hashing", "Sliding window" and "Stack with min()" (with an orange "Today" tag). Grey placeholder pills sit beside a "Graphs locked" pill.
   Copy: "120 problems, 18 patterns, built from questions students reported this season."
3. **OA Groups** (light blue #e2edfc). A row of five avatar circles along the top, the middle one largest with a pink ring. Below is a phone frame with a header ("Google · 1.8k Members" and a black "Invite Friends" pill), a green chat bubble (Blackninja 10:40 PM), reaction counts (12, 4, 2), a blue bubble (Player001 10:58 PM) and a "Your Message" input.
   Copy: "Join peers targeting the same companies, exchange insights, and stay accountable."
4. **College Page** (green-grey #e4f1e7). Two tilted cards sit behind a front white card showing "IIT Hyderabad · Class of 2027 · CSE", a green "8 live" tag, and the stats 24 drives, 312 placed and 86% offers. A tilted "Pick your campus" pill is at the top left, and stacked avatars with "+128 batchmates" are at the bottom right.
   Copy: "Drives, eligibility and cutoffs for your campus, updated by your own batch."
5. **Company-wise Questions** (pink #fdd8d8). Three rows of white pill and circle chips holding company letter-logos, with the topic pills "Graph shortest path", "Sliding window max" and "Interval merging".
   Copy: "Know what each company repeats, from 186 student reports this season."
6. **Mock OAs** (light grey #eceef2). A black timer pill at the top right ("● 00:42:10", yellow dot). Below it is a white editor card: a "Q2 OF 4 · Medium" / "solution.py" header, code bars in blue, grey and green, "3/3 tests passed" in green, and an orange "Submit" button.
   Copy: "Practice on the real clock, with the same question mix and a full editor."
7. **OA Store** (warm cream radial #f6e2b8 → #efe9e0). A floating gold ₹ coin above a stack of coins, faint orbit rings, and floating reward chips ("Voucher", "Gift card", "+120 OA Coins").
   Copy: "Solve real OA questions, contribute to the community, earn OA Coins, and redeem them for rewards."
8. **Contribute Questions** (lavender #ebe5fb). A white form card: "New OA question" with an "Amazon · SDE-1" tag, grey text lines, a green "Post anonymously" toggle and a purple "Submit" button.
   Copy: "Type OA questions anonymously and earn rewards."

## Scroll animation (stacking only)
- Progress p (0 to 1) is how far the stage has scrolled through the section, smoothed with exponential damping (factor about 8 per second).
- Card 1 is in place from the start. Cards 2 to 8 enter one after another between p = 0.04 and p = 0.92. Each card's entry, t (0 to 1), is eased out with a cubic curve.
- An entering card slides up from about 0.9 × viewport height below the centre to its resting place, and sits above the card before it (z-index = index).
- Covered cards: depth is the sum of the entry progress of every card above them, capped at 3. Each step of depth:
  - raises the card by 16px,
  - scales it down by 5%,
  - darkens it with a #0b0b0b overlay at 20% opacity.
  - Cards deeper than about 3.6 fade out.
- The label and the side headline stay fixed. The section ends with the stack complete, with no spread into a row.

## Card micro-animations (loop while visible)
- **Float:** chips and avatars drift up and down on a sine wave (2–4px, 1.1–1.7s, with different phases).
- **Roadmap:** the green path draws itself in (stroke-dashoffset) as the card enters, and the checkpoints pop in one after another with a slight overshoot.
- **Groups:** the chat bubbles and reaction chips pop in one after another (0.55s apart, fading up and scaling from 0.85) on a 5s loop, then fade out and repeat.
- **Company-wise:** the three chip rows scroll sideways without end in alternating directions (about 22px/s), using duplicated lists for a seamless loop.
- **Mock OAs:** the timer counts down each second from 00:42:10, and the code bars grow in from the left (scaleX, staggered) as the card enters.
- **OA Store:** the coin and the reward chips float.
- **Contribute:** a "+50 OA Coins" chip rises about 38px and fades out on a 3.2s loop.
- **Reduced motion:** with prefers-reduced-motion on, everything shows in its final state and nothing loops.

## Tech notes
- Use one requestAnimationFrame loop. Animate only transform and opacity, with will-change: transform on the cards.
- Font: Geist, with Geist Mono for small meta text. Cards use no coloured left borders and no gradients except in the panel backgrounds.
