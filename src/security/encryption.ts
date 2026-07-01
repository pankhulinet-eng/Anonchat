import crypto from 'crypto';

/**
 * Encryption Service - AES-256-GCM
 * Provides end-to-end encryption for messages
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16
const AUTH_TAG_LENGTH = 16;

export interface EncryptedData {
  iv: string;
  encryptedData: string;
  authTag: string;
}

/**
 * Encrypt message using AES-256-GCM
 */
export function encryptMessage(
  message: string,
  encryptionKey: string
): EncryptedData {
  if (!encryptionKey || encryptionKey.length !== 32) {
    throw new Error('Encryption key must be 32 characters long');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(encryptionKey),
    iv
  );

  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: authTag.toString('hex'),
  };
}

/**
 * Decrypt message using AES-256-GCM
 */
export function decryptMessage(
  encrypted: EncryptedData,
  encryptionKey: string
): string {
  if (!encryptionKey || encryptionKey.length !== 32) {
    throw new Error('Encryption key must be 32 characters long');
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(encryptionKey),
    Buffer.from(encrypted.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));

  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generate secure random key
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash password for storage
 */
export function hashPassword(password: string, salt: string = ''): string {
  const hash = crypto.createHash('sha256');
  hash.update(password + salt);
  return hash.digest('hex');
}

/**
 * Generate random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
