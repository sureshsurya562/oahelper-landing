import React from 'react';

const SIZES = { sm: ['7px 14px', 12.5], md: ['8px 16px', 13.5], lg: ['9px 17px', 14.5] };

export function Sticker({ color = 'mint', rotate = 0, size = 'md', children }) {
  const [p, f] = SIZES[size] || SIZES.md;
  return (
    <span style={{ display: 'inline-block', transform: 'rotate(' + rotate + 'deg)', background: 'var(--' + color + ')',
      color: 'var(--' + color + '-ink)', border: '1.5px solid var(--paper-rim)', borderRadius: 'var(--radius-sticker)',
      padding: p, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: f, lineHeight: 1, whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-sticker)' }}>
      {children}
    </span>
  );
}
