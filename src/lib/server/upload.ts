import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = path.resolve('static', 'uploads');

export async function saveFileLocally(file: FormDataEntryValue): Promise<string> {
  if (!(file instanceof File)) {
    throw new TypeError('Expected a File instance');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
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