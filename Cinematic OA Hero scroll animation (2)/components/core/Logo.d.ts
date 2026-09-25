export interface LogoProps {
  /** mark = circled A only; logo = mark + OAHelper; lockup = logo | Powered by NxtWave. */
  variant?: 'mark' | 'logo' | 'lockup';
  /** Surface it sits on: dark = white artwork, paper = ink artwork. */
  tone?: 'dark' | 'paper';
  /** Rendered height in px. Nav 26, footer lockup 30, favicon-scale mark 20. */
  height?: number;
  /** URL prefix for assets/logo/ relative to the consuming page. */
  base?: string;
}
export declare function Logo(props: LogoProps): JSX.Element;
