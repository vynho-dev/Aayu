/**
 * @startingPoint section="Components" subtitle="Avatar initials + name + relation — first thing after login" viewport="700x100"
 */
export interface PatientSelectorProps {
  name: string;
  relation: string;
  age: number | string;
  selected?: boolean;
  onClick?: () => void;
}
