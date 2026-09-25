import React from 'react';
import { Logo } from '../core/Logo';
import { Button } from '../core/Button';

export function NavBar({ logoBase, links = [], active, ctaLabel = 'Get OA-ready', ctaHref = 'https://oahelper.in/questions', compact = false }) {
  return (
    <div style={{ height: 84, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '0 28px', boxSizing: 'border-box' }}>
      <a href="https://oahelper.in" style={{ display: 'flex' }}><Logo height={26} base={logoBase} /></a>
      {!compact && links.length > 0 && (
        <nav style={{ display: 'flex', gap: 2, padding: 5, borderRadius: 'var(--radius-pill)', background: '#1b1b1b', border: '1px solid #2a2a2a', fontSize: 12 }}>
          {links.map(l => (
            <a key={l} href="#" style={{ padding: '7px 14px', textDecoration: 'none', fontFamily: 'var(--font-sans)',
              color: l === active ? 'var(--text-primary)' : 'var(--text-subtle)', fontWeight: l === active ? 500 : 400 }}>{l}</a>
          ))}
        </nav>
      )}
      <Button size="sm" arrow href={ctaHref}>{ctaLabel}</Button>
    </div>
  );
}
