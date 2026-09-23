import React from 'react';

export function ValueSection({ BentoCard, QuestionCard, Callout, StatTile }) {
  const cal = Array.from({ length: 35 }, (_, i) => i - 2);
  const marks = { 6: 'peach', 9: 'mint', 14: 'sky', 21: 'lime', 27: 'periwinkle' };
  const bars = [['Arrays', 34, 'peach'], ['Graphs', 22, 'sky'], ['DP', 18, 'lilac'], ['Strings', 14, 'mint'], ['Math', 12, 'butter']];
  return (
    <section style={{ background: 'var(--surface-paper)', color: 'var(--text-on-paper)', padding: '96px 20px 140px' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 18, font: '800 clamp(46px, 6.8vw, 112px)/1 var(--font-sans)', letterSpacing: '-0.035em', WebkitTextStroke: '3px #151515', paintOrder: 'stroke fill', textShadow: '1px 1px 0 #151515, 2px 2px 0 #151515, 3px 3px 0 #151515, 4px 4px 0 #151515, 5px 5px 0 #151515, 6px 6px 0 #151515' }}>
            <span style={{ color: 'var(--sky)', transform: 'rotate(-6deg)' }}>See</span><span style={{ color: 'var(--peach)', transform: 'rotate(4deg)' }}>Solve</span><span style={{ color: 'var(--mint)', transform: 'rotate(-3deg)' }}>Clear</span>
          </div>
          <div style={{ alignSelf: 'center' }}><Callout size="lg">See, Solve and Clear</Callout></div>
          <p style={{ margin: 0, maxWidth: 540, font: '400 14px/1.65 var(--font-mono)', color: 'var(--text-on-paper-muted)' }}>/// Every question here was asked in a real OA. See the pattern, solve it against the clock, and clear your round.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16 }}>
          <BentoCard highlight title="Real OA Questions Actually Asked in Interviews" description="Every question comes from a real online assessment, tagged with the company, role and month it was asked." mediaHeight={340}
            media={<div style={{ position: 'absolute', inset: 0 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--glow-mint)' }} />
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) translate(-150px, 26px) rotate(-11deg)' }}><QuestionCard company="Microsoft" color="sky" meta="SWE OA · Sep 2026" title="Count Valid Substrings" difficulty="easy" topics={['Strings']} width={270} /></div>
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) translate(150px, 22px) rotate(10deg)' }}><QuestionCard company="Google" color="mint" meta="STEP OA · Jul 2026" title="Minimum Cost Path in a Grid" difficulty="hard" topics={['DP']} width={270} /></div>
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) translateY(-6px) rotate(-2deg)' }}><QuestionCard company="Amazon" meta="SDE-1 OA · Aug 2026" title="Balance the Warehouses" topics={['Arrays', 'Prefix Sum']} seen="Seen in 14 OAs this season" stamp="ASKED IN A REAL OA ✓" /></div>
            </div>} />
          <BentoCard title="OA Calendar" description="Upcoming OAs for your campus in one calendar, with dates and timings." mediaHeight={340}
            media={<div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 15px/1 var(--font-sans)' }}><span>October 2026</span><span style={{ font: '400 11px var(--font-mono)', color: 'var(--text-subtle)' }}>5 OAs</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>{cal.map(d => <span key={d} style={{ aspectRatio: '1', maxHeight: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, font: '500 12px/1 var(--font-mono)', background: d < 1 || d > 31 ? 'transparent' : marks[d] ? 'var(--' + marks[d] + ')' : 'var(--surface-raised)', color: marks[d] ? '#151515' : 'var(--text-subtle)' }}>{d >= 1 && d <= 31 ? d : ''}</span>)}</div>
            </div>} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <BentoCard title="Company-wise Patterns" description="See which topics each company tests most, and prepare for those first."
            media={<div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>{bars.map(([l, p, c]) => <div key={l} style={{ display: 'grid', gridTemplateColumns: '62px 1fr 34px', alignItems: 'center', gap: 10, font: '400 11.5px/1 var(--font-mono)' }}><span style={{ color: '#b8b8bc' }}>{l}</span><span style={{ height: 10, borderRadius: 4, background: '#232326', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: p * 2.4 + '%', background: 'var(--' + c + ')' }} /></span><span style={{ textAlign: 'right' }}>{p}%</span></div>)}</div>} />
          <BentoCard title="Instant OA Alerts" description="Get notified as soon as a new OA is scheduled for your college."
            media={<div style={{ padding: 18, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>{[['Microsoft OA link is live', 'Closes in 2 hours', 'sky'], ['Deloitte OA scheduled', 'Tomorrow · 10:00 AM', 'lime']].map(([t, s, c]) => <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'var(--surface-raised-2)', border: '1px solid var(--border-dark-strong)' }}><span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--' + c + ')', color: '#151515', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 12px var(--font-sans)' }}>OA</span><span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><span style={{ font: '500 13px var(--font-sans)' }}>{t}</span><span style={{ font: '400 11px var(--font-mono)', color: 'var(--text-subtle)' }}>{s}</span></span></div>)}</div>} />
          <BentoCard title="Timed Mock OAs" description="Practice in an exam-style editor with a timer and hidden test cases."
            media={<div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, alignContent: 'center', height: '100%', boxSizing: 'border-box' }}><StatTile label="Time left" value="44:59" /><StatTile label="Question" value="2/3" /><StatTile label="Passed" value="3/3" accent /></div>} />
        </div>
      </div>
    </section>
  );
}
