/**
 * @startingPoint section="Components" subtitle="Label above, hairline border, validate on blur" viewport="700x100"
 */
export interface InputProps {
  label?: string;
  placeholder?: string;
  /** Shown below the field, after first blur only */
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}
