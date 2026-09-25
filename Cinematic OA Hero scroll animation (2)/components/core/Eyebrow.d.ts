import type { ReactNode } from 'react';
export interface EyebrowProps {
  tone?: 'dark' | 'paper';
  /** Prepend the "/// " mono prefix. Default true. */
  prefix?: boolean;
  children?: ReactNode;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
