export interface QuestionCardProps {
  company: string;
  /** Pastel token for the company chip. */
  color?: string;
  /** e.g. "SDE-1 OA · Aug 2026" */
  meta?: string;
  title: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topics?: string[];
  /** e.g. "Seen in 14 OAs this season" */
  seen?: string;
  /** Rotated mint stamp, e.g. "ASKED IN A REAL OA ✓" */
  stamp?: string;
  width?: number;
}
export declare function QuestionCard(props: QuestionCardProps): JSX.Element;
