import React from 'react';
import { Tag } from '../core/Tag';

export function QuestionCard({ company, color = 'peach', meta, title, difficulty = 'medium', topics = [], seen, stamp, width = 290 }) {
  return (
    <div style={{ position: 'relative', width, boxSizing: 'border-box', padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--surface-raised-2)',
      border: '1px solid var(--border-dark-strong)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: 12,
      boxShadow: '0 26px 50px rgba(0,0,0,0.55)' }}>
      {stamp && (
        <div style={{ position: 'absolute', right: -14, top: -14, padding: '7px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--mint)',
          color: 'var(--mint-ink)', border: '1.5px solid var(--paper-ink)', font: '700 11px/1 var(--font-sans)', letterSpacing: '0.04em',
          transform: 'rotate(6deg)', boxShadow: 'var(--shadow-hard)' }}>{stamp}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ padding: '5px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--' + color + ')', color: 'var(--' + color + '-ink)', font: '600 12px/1 var(--font-sans)' }}>{company}</span>
        {meta && <span style={{ font: '400 11px/1 var(--font-mono)', color: 'var(--text-subtle)' }}>{meta}</span>}
      </div>
      <div style={{ font: '500 18px/1.3 var(--font-sans)', letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <Tag variant="difficulty" level={difficulty} />
        {topics.map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      {seen && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid var(--ink-650)', font: '400 11.5px/1 var(--font-mono)', color: 'var(--text-subtle)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mint)' }} />{seen}
        </div>
      )}
    </div>
  );
}
