import React from 'react';
import { Callout } from '../core/Callout';

export function BentoCard({ title, description, media, mediaHeight = 210, highlight = false, footer }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 14, borderRadius: 'var(--radius-2xl)', minWidth: 0,
        border: '1px dashed ' + (hover ? 'rgba(21,21,21,0.5)' : 'var(--border-dashed-paper)'), background: 'var(--surface-paper-card)',
        color: 'var(--text-on-paper)', transform: hover ? 'translateY(-4px)' : 'none', boxShadow: hover ? 'var(--shadow-card-hover)' : 'none',
        transition: 'transform .4s var(--ease-out), box-shadow .4s, border-color .4s' }}>
      <div style={{ position: 'relative', height: mediaHeight, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        backgroundColor: 'var(--surface-panel)', backgroundImage: 'var(--pattern-dots-fine)', backgroundSize: 'var(--pattern-dots-fine-size)',
        color: 'var(--text-primary)', boxSizing: 'border-box' }}>
        {media}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, padding: '0 6px 4px' }}>
        <div style={{ flex: '1 1 260px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: highlight ? 10 : 8 }}>
          {highlight ? <Callout>{title}</Callout>
            : <div style={{ font: 'var(--text-h3)', letterSpacing: 'var(--ls-title)' }}>{title}</div>}
          {description && <p style={{ margin: 0, font: '400 13px/1.6 var(--font-mono)', color: 'var(--text-on-paper-muted)', textWrap: 'pretty' }}>{description}</p>}
        </div>
        {footer}
      </div>
    </div>
  );
}
