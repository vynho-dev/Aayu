/**
 * @startingPoint section="Components" subtitle="AI appeal letter — editable preview + download PDF" viewport="700x300"
 */
export interface LetterCardProps {
  title: string;
  /** Letter body. When `editable`, becomes the seed text of an inline textarea. */
  preview: React.ReactNode;
  /** Show the "Edit letter" toggle so the user can revise before downloading (locked decision). */
  editable?: boolean;
  onDownload?: () => void;
}
