/**
 * @startingPoint section="Components" subtitle="Primary, secondary, ghost action button" viewport="700x140"
 */
export interface ButtonProps {
  /** Visual style. Only one primary button per screen. */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md';
  /** Shows spinner + "Working…" label */
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
