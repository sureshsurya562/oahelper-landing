export interface CompareRow { label: string; us: string; them: string; }
export interface CompareTableProps {
  rows: CompareRow[];
  usLabel?: string;
  themLabel?: string;
}
export declare function CompareTable(props: CompareTableProps): JSX.Element;
