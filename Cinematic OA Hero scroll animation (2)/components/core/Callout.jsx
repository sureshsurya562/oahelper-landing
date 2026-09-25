import React from 'react';

export function Callout({ color = 'mint', size = 'md', children }) {
  const lg = size === 'lg';
  return (
    <span style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: lg ? '11px 22px' : '8px 14px', borderRadius: 'var(--radius-pill)',
      background: 'var(--' + color + ')', color: 'var(--paper-ink)', border: '1.5px solid var(--paper-ink)',
      boxShadow: lg ? 'var(--shadow-hard)' : 'var(--shadow-hard-sm)', fontFamily: 'var(--font-sans)',
      fontWeight: lg ? 700 : 600, fontSize: lg ? 'clamp(18px, 1.8vw, 24px)' : 17, lineHeight: 1.15, letterSpacing: '-0.015em' }}>
      {children}
    </span>
  );
}
