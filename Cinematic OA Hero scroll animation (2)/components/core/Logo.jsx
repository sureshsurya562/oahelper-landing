import React from 'react';

const FILES = {
  mark: ['oahelper-mark-white.png', 'oahelper-mark-ink.png'],
  logo: ['oahelper-logo-white.png', 'oahelper-logo-ink.png'],
  lockup: ['oahelper-nxtwave-lockup-dark.png', 'oahelper-nxtwave-lockup-light.png'],
};

export function Logo({ variant = 'logo', tone = 'dark', height = 26, base = '../../assets/logo/' }) {
  const f = (FILES[variant] || FILES.logo)[tone === 'dark' ? 0 : 1];
  const alt = variant === 'lockup' ? 'OAHelper, powered by NxtWave' : 'OAHelper';
  return <img src={base + f} alt={alt} style={{ display: 'block', height, width: 'auto' }} />;
}
