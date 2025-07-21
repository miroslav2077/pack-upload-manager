import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { Buffer } from 'buffer';

const UPLOAD_DIR = path.resolve('static', 'uploads');

// Maximum file size in bytes (e.g., 80MB)
const MAX_FILE_SIZE = 80 * 1024 * 1024;

// Allowed mime types and their magic bytes (expanded for learning materials)
const MAGIC_BYTES = [
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

// Note: Some formats (e.g., ZIP-based Office files, AVI, WAV) require deeper inspection for strict validation.
// This implementation allows them by magic bytes only for now.
function checkMagicBytes(buffer: Buffer): string | null {
  for (const { mime, bytes } of MAGIC_BYTES) {
    if (buffer.slice(0, bytes.length).every((b: number, i: number) => b === bytes[i])) {
      return mime;
    }
  }
  return null;
}

export async function saveFileLocally(file: FormDataEntryValue): Promise<string> {
  if (!(file instanceof File)) {
    throw new TypeError('Expected a File instance');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Maximum allowed size is 80MB.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Magic byte check
  const detectedMime = checkMagicBytes(buffer);
  if (!detectedMime) {
    throw new Error('Unsupported or unrecognized file type.');
  }

  // Optionally, check file.type matches detectedMime (for extra safety)
  if (file.type && file.type !== detectedMime) {
    throw new Error('File type does not match file content.');
  }

  const safeName = file.name.replace(/[^\w.-]/g, '_'); // sanitize filename
  const filename = `${randomUUID()}_${safeName}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(filepath, buffer);
    return filename;
  } catch (err) {
    console.error('Failed to save file locally:', err);
    throw new Error('Unable to save file');
  }
}