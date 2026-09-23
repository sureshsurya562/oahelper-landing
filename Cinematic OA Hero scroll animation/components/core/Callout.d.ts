import type { ReactNode } from 'react';
export interface CalloutProps {
  /** Pastel token name: mint, sky, peach, lilac, coral, cyan, butter, aqua, lime, periwinkle, mist, orchid. */
  color?: string;
  size?: 'md' | 'lg';
  children?: ReactNode;
}
export declare function Callout(props: CalloutProps): JSX.Element;
