/**
 * @startingPoint section="Components" subtitle="Dropdown — prefer selects over typing" viewport="700x100"
 */
export interface SelectOption {
  value: string;
  label: string;
}
export interface SelectProps {
  label?: string;
  /** String[] or {value,label}[] */
  options?: (string | SelectOption)[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}
