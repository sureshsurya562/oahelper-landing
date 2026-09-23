import React from 'react';

const SIZES = { sm: { p: '10px 16px', f: 12.5 }, md: { p: '14px 24px', f: 15 }, lg: { p: '16px 28px', f: 16 } };

export function Button({ variant = 'primary', size = 'md', arrow = false, href, onClick, disabled = false, children }) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const h = hover && !disabled, d = down && !disabled;
  const s = SIZES[size] || SIZES.md;
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 10, padding: s.p, borderRadius: 'var(--radius-pill)',
    fontFamily: 'var(--font-sans)', fontSize: s.f, fontWeight: 600, lineHeight: 1, textDecoration: 'none', whiteSpace: 'nowrap',
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
    transform: d ? 'translateY(1px)' : 'none',
    transition: 'background var(--dur-1) ease, color var(--dur-1) ease, border-color var(--dur-1) ease, transform var(--dur-1) var(--ease-out), box-shadow var(--dur-1) ease',
  };
  const v = {
    primary: { background: h ? 'var(--btn-light-bg-hover)' : 'var(--btn-light-bg)', color: 'var(--btn-light-fg)' },
    accent: { background: 'var(--accent)', color: 'var(--accent-ink)', border: '1.5px solid var(--paper-ink)',
      boxShadow: d ? 'var(--shadow-hard-sm)' : h ? '0 4px 0 #151515' : 'var(--shadow-hard)',
      transform: d ? 'translateY(1px)' : h ? 'translateY(-1px)' : 'none' },
    ghost: { background: 'transparent', color: h ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: '1px solid ' + (h ? 'var(--fg-5)' : 'var(--border-dark-strong)') },
    ink: { background: h ? '#000' : 'var(--paper-ink)', color: 'var(--paper-50)' },
  }[variant] || {};
  const circle = arrow === 'circle' ? { padding: size === 'sm' ? '5px 5px 5px 14px' : '6px 6px 6px 16px' } : {};
  const El = href ? 'a' : 'button';
  return (
    <El href={href} onClick={disabled ? undefined : onClick} disabled={El === 'button' ? disabled : undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{ ...base, ...v, ...circle }}>
      {children}
      {arrow === true && <span aria-hidden="true">→</span>}
      {arrow === 'circle' && (
        <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: '50%', background: '#111', color: '#f3f3f3',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>↗</span>
      )}
    </El>
  );
}
