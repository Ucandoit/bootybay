import { createHash, Encoding } from 'crypto';

/**
 * encrypt a string
 * @param text the string to encrypt
 * @param algorithm algorithm to use (sha256 by default)
 * @param encoding the encoding of the text (utf-8 by default)
 * @returns the encoded string in hex format
 */
export default function encrypt(text: string, algorithm = 'sha256', encoding: Encoding = 'utf-8'): string {
  return createHash(algorithm).update(text, encoding).digest('hex');
}
