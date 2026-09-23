export interface QotdStat { label: string; value: string; accent?: boolean; }
/**
 * @startingPoint section="Product" subtitle="Question of the Day banner with countdown and stats" viewport="720x340"
 */
export interface QotdBannerProps {
  title: string;
  subtitle?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  month?: string;
  day?: string;
  /** [hours, minutes, seconds] */
  countdown?: [string, string, string];
  expires?: string;
  stats?: QotdStat[];
  /** Visual for the left media panel. */
  image?: string;
  ctaHref?: string;
  /** Hide the media panel on narrow screens. */
  showMedia?: boolean;
}
export declare function QotdBanner(props: QotdBannerProps): JSX.Element;
