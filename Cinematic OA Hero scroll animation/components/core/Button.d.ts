import type { ReactNode } from 'react';
export interface ButtonProps {
  /** primary = light pill on ink; accent = mint with hard shadow; ghost = outline on ink; ink = dark pill on paper. */
  variant?: 'primary' | 'accent' | 'ghost' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  /** true appends →; 'circle' appends a dark ↗ disc (Solve Now style). */
  arrow?: boolean | 'circle';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
