import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

// Maximum file size in bytes (e.g., 80MB)
export const MAX_FILE_SIZE = 80 * 1024 * 1024;

// Allowed mime types and their magic bytes (expanded for learning materials)
export const MAGIC_BYTES = [
  // Documents
  { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', bytes: [0x50, 0x4B, 0x03, 0x04] }, // DOCX (ZIP-based)
  { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', bytes: [0x50, 0x4B, 0x03, 0x04] }, // PPTX (ZIP-based)
  { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', bytes: [0x50, 0x4B, 0x03, 0x04] }, // XLSX (ZIP-based)
  { mime: 'application/msword', bytes: [0xD0, 0xCF, 0x11, 0xE0] }, // DOC (legacy)
  { mime: 'application/vnd.ms-powerpoint', bytes: [0xD0, 0xCF, 0x11, 0xE0] }, // PPT (legacy)
  { mime: 'application/vnd.ms-excel', bytes: [0xD0, 0xCF, 0x11, 0xE0] }, // XLS (legacy)
  { mime: 'application/rtf', bytes: [0x7B, 0x5C, 0x72, 0x74, 0x66] }, // {\rtf

  // Images
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4E, 0x47] }, // PNG
  { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] }, // JPEG
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8

  // Video
  { mime: 'video/mp4', bytes: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70] }, // MP4 (common)
  { mime: 'video/mp4', bytes: [0x66, 0x74, 0x79, 0x70] }, // MP4 (offset 4)
  { mime: 'video/quicktime', bytes: [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20] }, // MOV
  { mime: 'video/x-msvideo', bytes: [0x52, 0x49, 0x46, 0x46] }, // AVI (needs further check at offset 8)
  { mime: 'video/x-matroska', bytes: [0x1A, 0x45, 0xDF, 0xA3] }, // MKV
  { mime: 'video/x-ms-wmv', bytes: [0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11] }, // WMV

  // Audio
  { mime: 'audio/mpeg', bytes: [0x49, 0x44, 0x33] }, // MP3 (ID3)
  { mime: 'audio/mpeg', bytes: [0xFF, 0xFB] }, // MP3 (frame)
  { mime: 'audio/wav', bytes: [0x52, 0x49, 0x46, 0x46] }, // WAV (needs further check at offset 8)
  { mime: 'audio/aac', bytes: [0xFF, 0xF1] }, // AAC
  { mime: 'audio/aac', bytes: [0xFF, 0xF9] }, // AAC
  { mime: 'audio/ogg', bytes: [0x4F, 0x67, 0x67, 0x53] }, // OggS
];

export function formatDateTime(dateInput: Date) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const dateStr = date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  });

  return `${dateStr} at ${timeStr}`;
}