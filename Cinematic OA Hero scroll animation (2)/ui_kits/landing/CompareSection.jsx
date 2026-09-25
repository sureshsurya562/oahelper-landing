import React from 'react';

export const COMPARE_ROWS = [
  { label: 'Questions', us: 'Real OA questions, company by company', them: 'Generic problem lists, same for every company' },
  { label: 'Freshness', us: 'Added hours after the drive', them: 'Old lists, updated once in a while' },
  { label: 'Format', us: 'The real screenshot, exact wording', them: 'Retyped, reworded versions' },
  { label: 'Source', us: 'Shared by students who just sat the test', them: 'Pulled from old blogs and forums' },
  { label: 'Practice', us: 'Timed mock OAs in the real format', them: 'Untimed, solve at your own pace' },
  { label: 'OA calendar', us: 'Know which company is coming, and when', them: 'You find out when the mail lands' },
  { label: 'Price', us: 'Free to start. Share a question, earn premium', them: 'Pay for a full course first' },
];

export function CompareSection({ Eyebrow, CompareTable }) {
  return (
    <section style={{ background: 'var(--surface-paper)', color: 'var(--text-on-paper)', padding: '40px 20px 180px' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
          <div style={{ alignSelf: 'center' }}><Eyebrow tone="paper">OA Helper vs others</Eyebrow></div>
          <h2 style={{ margin: 0, font: 'var(--text-h2)', fontSize: 'clamp(36px, 4.6vw, 72px)', letterSpacing: 'var(--ls-h2)' }}>Generic prep, or your <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: 'var(--serif-accent-ls)', fontSize: 'var(--serif-accent-size)' }}>actual OA.</em></h2>
        </div>
        <CompareTable rows={COMPARE_ROWS} />
      </div>
    </section>
  );
}
