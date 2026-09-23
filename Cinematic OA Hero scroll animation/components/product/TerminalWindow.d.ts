import type { ReactNode } from 'react';
export interface TerminalWindowProps {
  title?: string;
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
}
export declare function TerminalWindow(props: TerminalWindowProps): JSX.Element;
