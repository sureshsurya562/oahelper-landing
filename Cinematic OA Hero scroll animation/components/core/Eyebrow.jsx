import React from 'react';

export function Eyebrow({ tone = 'dark', prefix = true, children }) {
  const dark = tone === 'dark';
  return (
    <span style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '8px 14px', borderRadius: 'var(--radius-pill)',
      border: '1px dashed ' + (dark ? 'rgba(255,255,255,0.22)' : 'rgba(21,21,21,0.35)'),
      font: 'var(--text-eyebrow)', color: dark ? 'var(--text-muted)' : 'var(--text-on-paper-muted)', whiteSpace: 'nowrap' }}>
      {prefix ? '/// ' : ''}{children}
    </span>
  );
}
