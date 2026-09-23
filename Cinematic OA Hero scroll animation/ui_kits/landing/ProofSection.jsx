import React from 'react';

const VOICES = [
  { quote: 'I stopped solving random DSA sets. Now I practise what my company actually asks, and prep finally feels focused.', name: 'Tripti Byas', role: 'Final-year CSE', initials: 'TB', avatarColor: 'sky' },
  { quote: 'Instead of digging through random resources, I only see the companies that matter for my placements.', name: 'Priya Verma', role: 'Final-year student', initials: 'PV', featured: true },
  { quote: 'The interview experiences make the next round less of a black box. You walk in knowing what to expect.', name: 'Rahul Kumar', role: 'Aspiring SDE', initials: 'RK', avatarColor: 'peach' },
];
const TICKER = [['Goldman Sachs', 'IIT Kharagpur', '2h', 'mist'], ['Uber', 'NIT Trichy', '5h', 'butter'], ['Flipkart', 'VIT Vellore', '9h', 'periwinkle'], ['Amazon', 'BITS Pilani', '11h', 'peach'], ['Atlassian', 'IIIT Hyderabad', '14h', 'cyan']];

export function ProofSection({ Eyebrow, Button, StatTile, TestimonialCard }) {
  return (
    <section style={{ background: 'var(--surface-page)', color: 'var(--text-primary)', padding: '140px 20px' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 56 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 28 }}>
          <div style={{ flex: '1 1 520px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Eyebrow>By the numbers</Eyebrow>
            <h2 style={{ margin: 0, maxWidth: 780, font: 'var(--text-h2)', letterSpacing: 'var(--ls-h2)' }}>The only place with your company's <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: 'var(--serif-accent-ls)', fontSize: 'var(--serif-accent-size)' }}>actual OA questions.</em></h2>
            <p style={{ margin: 0, font: 'var(--text-body)', color: 'var(--text-muted)' }}>Recent, verified, and added within hours of each drive.</p>
          </div>
          <Button arrow href="https://oahelper.in/questions">Get OA-ready</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <StatTile variant="hero" value="3500+" label="Real OA questions" dot="mint" />
          <StatTile variant="hero" value="400+" label="Companies tracked" dot="sky" />
          <StatTile variant="hero" value="1000+" label="Students placed" dot="peach" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 58, padding: '0 10px', borderRadius: 999, background: 'var(--surface-panel)', border: '1px solid #242426', overflow: 'hidden' }}>
          <span style={{ flex: 'none', padding: '9px 13px', borderRadius: 999, background: 'var(--mint)', color: 'var(--mint-ink)', font: '600 12px/1 var(--font-mono)' }}>● Just added</span>
          <div style={{ display: 'flex', gap: 34, whiteSpace: 'nowrap', overflow: 'hidden' }}>{TICKER.map(([c, col, a, k]) => <span key={c} style={{ display: 'flex', alignItems: 'center', gap: 9, font: '400 13px/1 var(--font-sans)', color: 'var(--text-muted)' }}><span style={{ width: 8, height: 8, borderRadius: 3, background: 'var(--' + k + ')' }} /><b style={{ color: 'var(--fg-1)', fontWeight: 600 }}>{c}</b> · {col} · {a} ago</span>)}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center', paddingTop: 100 }}>
          <Eyebrow>From the last season</Eyebrow>
          <h2 style={{ margin: 0, font: 'var(--text-h2)', letterSpacing: 'var(--ls-h2)' }}>Students like you. <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: 'var(--serif-accent-ls)', fontSize: 'var(--serif-accent-size)' }}>Here's what they said.</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, alignItems: 'start' }}>
          {VOICES.map(v => <div key={v.name} style={{ transform: v.featured ? 'translateY(-14px)' : 'none' }}><TestimonialCard {...v} /></div>)}
        </div>
      </div>
    </section>
  );
}
