import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { Buffer } from 'buffer';
import { MAX_FILE_SIZE } from '$lib/utils';
import { createId } from '@paralleldrive/cuid2';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { filetypemime } from 'magic-bytes.js';

const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || 'uploads';

const UPLOAD_DIR = path.resolve('static', UPLOAD_FOLDER);

export async function validateFile(file: File): Promise<Buffer> {
  if (!(file instanceof File)) {
    throw new TypeError('Expected a File instance');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Maximum allowed size is 80MB.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // magic byte check
  const guessedFile = filetypemime(buffer);

  // check file.type matches detectedMime (for extra safety)
  if (!guessedFile.includes(file.type)) {
    console.error('Mimetype mismatch!!!', file.name, file.type, guessedFile);
    throw new Error('File type does not match file content.');
  }

  return buffer;
}

export async function saveFileLocally(file: File): Promise<string> {
  const buffer = await validateFile(file);
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

export async function saveFileToS3Bucket(file: File): Promise<string> {
  const buffer = await validateFile(file);
  const s3 = new S3Client({});
  const key = `${createId()}_${file.name}`;
  const command = new PutObjectCommand({
    Key: key,
    Bucket: process.env.BUCKET_NAME,
    Body: buffer,
    ContentType: file.type
  });

  await s3.send(command);
  return key;
}