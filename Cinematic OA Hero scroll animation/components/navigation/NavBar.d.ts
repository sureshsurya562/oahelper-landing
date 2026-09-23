/**
 * @startingPoint section="Navigation" subtitle="Wordmark, pill nav and light CTA on ink" viewport="1200x84"
 */
export interface NavBarProps {
  /** Forwarded to Logo base. */
  logoBase?: string;
  links?: string[];
  active?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Hide the pill nav (mobile). */
  compact?: boolean;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
