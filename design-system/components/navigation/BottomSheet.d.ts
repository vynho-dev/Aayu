/**
 * @startingPoint section="Components" subtitle="Consent / confirmation sheet — normal-flow, never position:fixed" viewport="480x320"
 */
export interface BottomSheetProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  primaryLabel?: string;
  onPrimary?: () => void;
}
