import React from 'react';

export function Wordmark({ tone = 'dark', size = 17 }) {
  return (
    <span style={{ fontFamily: 'var(--font-sans)', fontSize: size, lineHeight: 1, whiteSpace: 'nowrap',
      color: tone === 'dark' ? 'var(--text-primary)' : 'var(--text-on-paper)' }}>
      <b style={{ fontWeight: 600 }}>OA</b>Helper
    </span>
  );
}
