import React from 'react';

export function QotdTab({ label = 'Question of the Day', time = '08:38:53', open = false, onClick, onMouseEnter }) {
  return (
    <button type="button" onClick={onClick} onMouseEnter={onMouseEnter} aria-label={label}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: open ? '16px 14px 14px 10px' : '16px 10px 14px',
        border: '1.5px solid var(--paper-ink)', borderRight: 'none', borderRadius: '16px 0 0 16px', background: 'var(--mint)', color: 'var(--mint-ink)',
        boxShadow: 'var(--shadow-hard-left)', cursor: 'pointer', transition: 'padding .3s ease' }}>
      <span style={{ position: 'absolute', left: -5, top: -5, width: 14, height: 14, borderRadius: '50%', background: 'var(--peach)', border: '1.5px solid var(--paper-ink)', boxSizing: 'border-box' }} />
      <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', font: '600 13px/1 var(--font-sans)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: '6px 3px', borderRadius: 6, background: 'var(--mint-ink)', color: 'var(--mint)',
        font: '500 10.5px/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{time}</span>
    </button>
  );
}
