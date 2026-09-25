export interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor?: string;
  /** Mint card, raised. Use for one card per row. */
  featured?: boolean;
}
export declare function TestimonialCard(props: TestimonialCardProps): JSX.Element;
