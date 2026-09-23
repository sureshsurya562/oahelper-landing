import React from 'react';

export function TerminalWindow({ title = 'oahelper — zsh', width = '100%', height, children }) {
  return (
    <div style={{ width, height, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border-dark)',
      overflow: 'hidden', boxShadow: 'var(--shadow-terminal)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 40, flex: 'none', position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px',
        background: '#131314', borderBottom: '1px solid #232325' }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--ink-600)' }} />)}
        <span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', font: '400 12px/1 var(--font-mono)', color: '#6f6f73', pointerEvents: 'none' }}>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: '22px 26px', font: '400 15px/30px var(--font-mono)', color: '#d8d8d8' }}>{children}</div>
    </div>
  );
}
