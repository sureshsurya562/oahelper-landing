import type { ReactNode } from 'react';
export interface StickerProps {
  /** Pastel token name; ink colour is paired automatically. */
  color?: 'mint' | 'sky' | 'peach' | 'lilac' | 'coral' | 'cyan' | 'butter' | 'aqua' | 'lime' | 'periwinkle' | 'mist' | 'orchid';
  /** Tilt in degrees; keep within ±7. */
  rotate?: number;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}
export declare function Sticker(props: StickerProps): JSX.Element;
