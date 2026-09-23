import React from 'react';
import { Button } from '../core/Button';
import { Tag } from '../core/Tag';
import { StatTile } from '../cards/StatTile';

export function QotdBanner({ title, subtitle, difficulty = 'medium', month = 'SEP', day = '23', countdown = ['08', '38', '53'], expires = '08h 29m 58s',
  stats = [], image, ctaHref = 'https://oahelper.in/questions', showMedia = true }) {
  const unit = (v, l) => (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <b style={{ font: '600 20px/1 var(--font-mono)', color: 'var(--fg-1)' }}>{v}</b>
      <span style={{ font: '400 10.5px/1 var(--font-sans)', color: 'var(--text-subtle)' }}>{l}</span>
    </span>
  );
  const colon = <b style={{ font: '600 18px/1 var(--font-mono)', color: 'var(--fg-5)', marginBottom: 14 }}>:</b>;
  return (
    <div style={{ width: '100%', maxWidth: 700, display: 'flex', gap: 10, padding: 10, boxSizing: 'border-box', borderRadius: 'var(--radius-3xl)',
      background: 'var(--surface-sunken)', border: '1px solid var(--border-dark)', boxShadow: 'var(--shadow-float)' }}>
      {showMedia && (
        <div style={{ position: 'relative', flex: 'none', width: 210, minHeight: 300, borderRadius: 'var(--radius-xl)', overflow: 'hidden',
          background: image ? 'center/cover url(' + image + ')' : 'var(--surface-raised)' }}>
          <div style={{ position: 'absolute', left: 10, right: 10, top: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 10px',
            borderRadius: 'var(--radius-md)', background: 'rgba(15,15,16,0.72)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)' }}>
            {unit(countdown[0], 'Hours')}{colon}{unit(countdown[1], 'Min')}{colon}{unit(countdown[2], 'Sec')}
          </div>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18, padding: '18px 18px 16px', borderRadius: 'var(--radius-xl)', background: 'var(--surface-panel)', color: 'var(--fg-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ font: '500 12px/1 var(--font-mono)', letterSpacing: 'var(--ls-eyebrow)', color: 'var(--text-muted)' }}>QUESTION OF THE DAY</span>
          <Tag variant="difficulty" level={difficulty} dot />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <span style={{ flex: 'none', width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(160deg, var(--orchid), var(--periwinkle))',
            border: '1.5px solid var(--paper-rim)', boxShadow: 'var(--shadow-sticker)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, color: 'var(--periwinkle-ink)' }}>
            <span style={{ font: '700 9.5px/1 var(--font-mono)', letterSpacing: '0.06em' }}>{month}</span>
            <span style={{ font: '700 21px/1 var(--font-sans)', letterSpacing: '-0.03em' }}>{day}</span>
          </span>
          <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ font: '600 clamp(20px, 2.2vw, 28px)/1.1 var(--font-sans)', letterSpacing: '-0.025em', color: 'var(--fg-1)' }}>{title}</span>
            <span style={{ font: '400 14px/1.2 var(--font-sans)', color: 'var(--text-subtle)' }}>{subtitle}</span>
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ padding: '8px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--ink-650)', font: '400 13px/1 var(--font-sans)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            Expires in <b style={{ fontWeight: 600, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{expires}</b>
          </span>
          <Button size="sm" arrow="circle" href={ctaHref}>Solve Now</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + Math.max(1, stats.length) + ', minmax(0,1fr))', gap: 8 }}>
          {stats.map(s => <StatTile key={s.label} label={s.label} value={s.value} accent={s.accent} />)}
        </div>
      </div>
    </div>
  );
}
