/**
 * @startingPoint section="Components" subtitle="Large tap area + per-file status thumbnails" viewport="700x260"
 */
export interface UploadFile {
  name: string;
  status: 'reading' | 'done' | 'unreadable';
}
export interface UploadDropzoneProps {
  files?: UploadFile[];
  onAdd?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
