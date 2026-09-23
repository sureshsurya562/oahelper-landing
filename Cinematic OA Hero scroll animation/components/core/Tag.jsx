import React from 'react';

const DIFF = {
  easy: ['var(--diff-easy-bg)', 'var(--diff-easy-fg)', 'Easy', 'var(--mint)'],
  medium: ['var(--diff-medium-bg)', 'var(--diff-medium-fg)', 'Medium', 'var(--peach)'],
  hard: ['var(--diff-hard-bg)', 'var(--diff-hard-fg)', 'Hard', 'var(--coral)'],
};

export function Tag({ variant = 'topic', level = 'medium', tone = 'dark', dot = false, children }) {
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 9px', borderRadius: 'var(--radius-pill)',
    fontFamily: 'var(--font-sans)', fontSize: 11.5, lineHeight: 1, whiteSpace: 'nowrap' };
  if (variant === 'difficulty') {
    const [bg, fg, label, dc] = DIFF[level] || DIFF.medium;
    return (
      <span style={{ ...pill, background: bg, color: fg, ...(dot ? { padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500 } : {}) }}>
        {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dc }} />}
        {children || label}
      </span>
    );
  }
  const topic = tone === 'paper'
    ? { background: 'var(--surface-paper-chip)', color: 'var(--text-on-paper)' }
    : { background: 'var(--surface-chip-dark)', color: 'var(--text-muted)' };
  return <span style={{ ...pill, ...topic }}>{children}</span>;
}
