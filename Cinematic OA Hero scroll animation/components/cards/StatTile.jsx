import React from 'react';

export function StatTile({ variant = 'compact', label, value, dot = 'mint', accent = false }) {
  if (variant === 'hero') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '28px 26px 26px', borderRadius: 'var(--radius-2xl)',
        border: '1px dashed var(--border-dashed-dark)', background: 'rgba(255,255,255,0.015)' }}>
        <span style={{ width: 12, height: 12, borderRadius: 4, background: 'var(--' + dot + ')' }} />
        <span style={{ font: '300 clamp(60px, 6.6vw, 108px)/0.9 var(--font-sans)', letterSpacing: '-0.055em', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        <span style={{ font: '400 13px/1 var(--font-mono)', color: 'var(--text-muted)' }}>{label}</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '14px 8px', borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-raised)', border: '1px solid var(--border-dark)', textAlign: 'center' }}>
      <span style={{ font: '400 11.5px/1.2 var(--font-sans)', color: 'var(--text-muted)' }}>{label}</span>
      <b style={{ font: '600 clamp(26px, 2.8vw, 36px)/1 var(--font-sans)', letterSpacing: '-0.03em', color: accent ? 'var(--accent)' : 'var(--text-primary)' }}>{value}</b>
    </div>
  );
}
