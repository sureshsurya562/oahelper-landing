import type { ReactNode } from 'react';
export interface TagProps {
  variant?: 'topic' | 'difficulty';
  /** Difficulty level (variant="difficulty"). */
  level?: 'easy' | 'medium' | 'hard';
  /** Topic chip surface. */
  tone?: 'dark' | 'paper';
  /** Leading dot + squarer shape (QOTD header style). */
  dot?: boolean;
  children?: ReactNode;
}
export declare function Tag(props: TagProps): JSX.Element;
