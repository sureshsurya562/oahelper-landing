import React from 'react';

const COLS = 'minmax(120px, 0.6fr) minmax(0, 1.25fr) minmax(0, 1fr)';

export function CompareTable({ rows = [], usLabel = 'OA Helper', themLabel = 'Usual prep' }) {
  const ic = (yes) => ({ flex: 'none', width: 20, height: 20, borderRadius: '50%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: yes ? 11 : 10, fontWeight: yes ? 700 : 400, background: yes ? 'var(--mint)' : 'transparent', color: yes ? 'var(--mint-ink)' : '#8a877f',
    border: yes ? 'none' : '1px solid rgba(21,21,21,0.25)' });
  return (
    <div style={{ position: 'relative', color: 'var(--text-on-paper)' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: COLS, columnGap: 12, pointerEvents: 'none' }}>
        <span />
        <span style={{ margin: '-14px 0', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--surface-panel)', backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.3px)',
          backgroundSize: 'var(--pattern-dots-fine-size)', boxShadow: '0 34px 60px -30px rgba(21,21,21,0.6)' }} />
        <span />
      </div>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: COLS, columnGap: 12 }}>
        <span />
        <span style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 10, font: '600 17px/1 var(--font-sans)', color: 'var(--fg-1)' }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--mint)', color: 'var(--mint-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✦</span>{usLabel}
        </span>
        <span style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', font: '500 16px/1 var(--font-sans)', color: 'var(--text-on-paper-subtle)' }}>{themLabel}</span>
        {rows.map(r => (
          <React.Fragment key={r.label}>
            <span style={{ padding: '18px 4px', borderTop: '1px dashed rgba(21,21,21,0.2)', font: '500 12.5px/1.4 var(--font-mono)', color: 'var(--text-on-paper-muted)', display: 'flex', alignItems: 'center' }}>{r.label}</span>
            <span style={{ padding: '18px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, font: '400 15px/1.45 var(--font-sans)', color: '#ececec' }}><span style={ic(true)}>✓</span><span>{r.us}</span></span>
            <span style={{ padding: '18px 24px', borderTop: '1px dashed rgba(21,21,21,0.14)', display: 'flex', alignItems: 'center', gap: 12, font: '400 15px/1.45 var(--font-sans)', color: 'var(--text-on-paper-subtle)' }}><span style={ic(false)}>✕</span><span>{r.them}</span></span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
