export interface QotdTabProps {
  label?: string;
  /** Live countdown text, HH:MM:SS. */
  time?: string;
  open?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}
export declare function QotdTab(props: QotdTabProps): JSX.Element;
