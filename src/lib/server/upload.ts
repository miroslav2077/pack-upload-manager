import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { Buffer } from 'buffer';
import { MAGIC_BYTES, MAX_FILE_SIZE } from '$lib/utils';

const UPLOAD_DIR = path.resolve('static', 'uploads');

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