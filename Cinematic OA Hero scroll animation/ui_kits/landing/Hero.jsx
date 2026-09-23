import React from 'react';

const STICKERS = [['Google','mint',21.5,24.5,-5],['Microsoft','sky',78.7,24.5,4],['Amazon','peach',7,46.5,-7],['Meta','lilac',86.7,48,6],['Adobe','coral',23.5,66.5,-3],['Atlassian','cyan',90,30.5,5],['Uber','butter',13,34,-4],['Walmart','aqua',77.8,57.3,3],['Deloitte','lime',18.5,47,-6],['Flipkart','periwinkle',80,43,4]];

export function Hero({ Sticker, NavBar, Button }) {
  return (
    <section style={{ padding: 'var(--frame-inset)', background: 'var(--surface-page)' }}>
      <div style={{ position: 'relative', height: 'calc(100vh - 20px)', minHeight: 640, borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-hairline)',
        backgroundColor: 'var(--surface-panel)', backgroundImage: 'var(--pattern-dots)', backgroundSize: 'var(--pattern-dots-size)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 3 }}>
          <NavBar links={['Placements', 'Questions', 'For Campus', 'Contribute', 'OA Store']} active="Placements" />
        </div>
        {STICKERS.map(([n, c, x, y, r]) => (
          <div key={n} style={{ position: 'absolute', left: x + '%', top: y + '%', transform: 'translate(-50%,-50%)', zIndex: 2 }}><Sticker color={c} rotate={r}>{n}</Sticker></div>
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '29%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px', zIndex: 1 }}>
          <h1 style={{ margin: 0, font: 'var(--text-display)', letterSpacing: 'var(--ls-display)', color: 'var(--text-primary)', textWrap: 'balance' }}>Your next OA is<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: 'var(--serif-accent-ls)', fontSize: 'var(--serif-accent-size)' }}>closer</em> than you think.</h1>
          <p style={{ margin: '26px 0 34px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, font: '400 16px/1.5 var(--font-sans)', color: '#c4c4c4' }}>
            <span style={{ padding: '6px 12px', borderRadius: 999, background: 'var(--mint)', color: 'var(--mint-ink)', border: '1.5px solid var(--paper-rim)', fontWeight: 600 }}>How??</span>
            <span>Practice the questions, patterns companies actually ask</span>
          </p>
          <Button arrow href="https://oahelper.in/questions">Get OA-ready</Button>
        </div>
      </div>
    </section>
  );
}
