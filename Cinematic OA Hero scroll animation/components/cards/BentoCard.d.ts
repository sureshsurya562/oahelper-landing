import type { ReactNode } from 'react';
/**
 * @startingPoint section="Cards" subtitle="Paper bento card with a dark media well" viewport="700x420"
 */
export interface BentoCardProps {
  title: string;
  description?: string;
  /** Content of the dotted dark media well. */
  media?: ReactNode;
  mediaHeight?: number;
  /** Render the title as a mint hard-shadow Callout (use for the one hero value prop). */
  highlight?: boolean;
  /** Extra content to the right of the text (e.g. a marquee). */
  footer?: ReactNode;
}
export declare function BentoCard(props: BentoCardProps): JSX.Element;
