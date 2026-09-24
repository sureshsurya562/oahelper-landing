import { LOGO_PATHS } from "@/lib/logos";

/**
 * The glyph on a company sticker.
 *
 * Where an open-source mark exists it renders as a solid silhouette in the
 * sticker's ink. Where it doesn't — the brands simple-icons removed on request —
 * it falls back to a monogram: the same solid shape language, so a row of
 * stickers reads as one set rather than "some have logos, some don't".
 */
export default function CompanyMark({ name, ink }: { name: string; ink: string }) {
  const path = LOGO_PATHS[name];

  if (path) {
    return (
      <svg className="mk" viewBox="0 0 24 24" aria-hidden focusable="false">
        <path d={path} fill="currentColor" />
      </svg>
    );
  }

  // Knock the initial out of a rounded tile so it reads as a mark, not a letter.
  return (
    <svg className="mk" viewBox="0 0 24 24" aria-hidden focusable="false">
      <rect x="0" y="0" width="24" height="24" rx="6" fill="currentColor" />
      <text x="12" y="12" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="700" fill={ink} fontFamily="var(--font)">
        {name.charAt(0)}
      </text>
    </svg>
  );
}
