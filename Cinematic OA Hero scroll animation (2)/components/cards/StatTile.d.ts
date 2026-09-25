import type { ReactNode } from 'react';
export interface StatTileProps {
  /** compact = QOTD tile on raised ink; hero = big light numeral in dashed frame. */
  variant?: 'compact' | 'hero';
  label: string;
  value: ReactNode;
  /** Pastel dot colour (hero). */
  dot?: string;
  /** Render value in accent mint (compact). */
  accent?: boolean;
}
export declare function StatTile(props: StatTileProps): JSX.Element;
