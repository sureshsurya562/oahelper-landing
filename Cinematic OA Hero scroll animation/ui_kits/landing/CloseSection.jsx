import React from 'react';

export function CloseSection({ Sticker, Button, Logo }) {
  const st = [['Amazon', 'peach', 14, 20, -6], ['Goldman Sachs', 'mist', 84, 17, 5], ['Microsoft', 'sky', 18, 82, 4], ['Flipkart', 'periwinkle', 82, 84, -5], ['Uber', 'butter', 8, 52, -3], ['Atlassian', 'cyan', 92, 50, 6]];
  return (
    <section style={{ background: 'var(--surface-page)', padding: 'var(--frame-inset)' }}>
      <div style={{ position: 'relative', minHeight: 640, borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--surface-panel)', backgroundImage: 'var(--pattern-dots)', backgroundSize: 'var(--pattern-dots-size)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {st.map(([n, c, x, y, r]) => <div key={n} style={{ position: 'absolute', left: x + '%', top: y + '%', transform: 'translate(-50%,-50%)' }}><Sticker color={c} rotate={r}>{n}</Sticker></div>)}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ margin: 0, font: '300 var(--fs-display-xl)/1.02 var(--font-sans)', letterSpacing: 'var(--ls-h2)', color: 'var(--fg-1)' }}>See it before<br />you <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: 'var(--serif-accent-ls)', fontSize: 'var(--serif-accent-size)' }}>sit it.</em></h2>
          <p style={{ margin: '26px 0 34px', font: '400 16px/1.6 var(--font-sans)', color: '#c4c4c4' }}>Stop Guessing. Start Preparing Smart.</p>
          <Button arrow href="https://oahelper.in/questions">Get OA-ready</Button>
        </div>
      </div>
      <footer style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '26px 18px 16px', font: '400 13px/1 var(--font-mono)', color: 'var(--fg-5)' }}>
        <Logo variant="lockup" height={30} /><span>© 2026 OA Helper</span><a href="https://oahelper.in" style={{ color: '#c4c4c4', textDecoration: 'none' }}>oahelper.in</a>
      </footer>
    </section>
  );
}
