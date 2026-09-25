import React from 'react';

export function TestimonialCard({ quote, name, role, initials, avatarColor = 'sky', featured = false }) {
  const f = featured;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, padding: 28, borderRadius: 'var(--radius-2xl)',
      background: f ? 'var(--mint)' : 'var(--surface-panel)', color: f ? 'var(--mint-ink)' : 'var(--text-secondary)',
      border: f ? '1.5px solid var(--paper-rim)' : '1px solid #242426',
      boxShadow: f ? '0 24px 50px -20px rgba(191,231,199,0.35), inset 0 1px 0 rgba(255,255,255,0.55)' : 'none' }}>
      <span style={{ fontSize: 14, letterSpacing: 3, color: f ? 'var(--mint-ink)' : 'var(--peach)' }} aria-label="5 out of 5">★★★★★</span>
      <p style={{ margin: 0, font: '400 18px/1.55 var(--font-sans)', letterSpacing: '-0.01em', textWrap: 'pretty' }}>“{quote}”</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 18, borderTop: '1px dashed ' + (f ? 'rgba(22,32,26,0.3)' : 'rgba(255,255,255,0.14)') }}>
        <span style={{ flex: 'none', width: 40, height: 40, borderRadius: '50%', background: f ? 'var(--mint-ink)' : 'var(--' + avatarColor + ')',
          color: f ? 'var(--mint)' : 'var(--paper-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 13px/1 var(--font-sans)' }}>{initials}</span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <b style={{ font: '600 14px/1 var(--font-sans)', color: f ? 'var(--mint-ink)' : 'var(--text-primary)' }}>{name}</b>
          <span style={{ font: '400 12px/1 var(--font-mono)', color: f ? '#3d5244' : 'var(--text-subtle)' }}>{role}</span>
        </span>
      </div>
    </div>
  );
}
