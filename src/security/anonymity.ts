import crypto from 'crypto';

/**
 * Anonymity Service
 * Ensures user privacy and anonymous ID generation
 */

export interface AnonymousUser {
  id: string;
  username: string;
  avatar: string;
  createdAt: Date;
  ipHash: string; // Hashed IP for tracking without revealing actual IP
}

/**
 * Generate cryptographically secure anonymous user ID
 */
export function generateAnonymousId(): string {
  return `anon_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * Generate anonymous username
 */
export function generateAnonymousUsername(): string {
  const adjectives = [
    'swift',
    'quiet',
    'bright',
    'calm',
    'bold',
    'keen',
    'wild',
    'gentle',
  ];
  const animals = [
    'fox',
    'owl',
    'eagle',
    'wolf',
    'raven',
    'phoenix',
    'tiger',
    'panda',
  ];
  const randomNum = Math.floor(Math.random() * 10000);

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${adjective}_${animal}_${randomNum}`;
}

/**
 * Generate avatar from user ID (deterministic but looks random)
 */
export function generateAnonymousAvatar(userId: string): string {
  // Using DiceBear API for avatar generation
  const style = ['avataaars', 'bottts', 'pixel-art', 'identicon'][
    Math.abs(hashString(userId)) % 4
  ];

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${userId}`;
}

/**
 * Hash IP address for privacy
 */
export function hashIpAddress(ip: string): string {
  // Remove last octet for IPv4 to further anonymize
  const anonymizedIp = ip.split('.').slice(0, 3).join('.');
  const hash = crypto.createHash('sha256');
  hash.update(anonymizedIp);
  return hash.digest('hex');
}

/**
 * Get IP from request with proxy support
 */
export function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || '0.0.0.0';
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Create session token for anonymous user
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate session token
 */
export function validateSessionToken(token: string): boolean {
  // Token should be 64 characters (32 bytes in hex)
  return /^[a-f0-9]{64}$/.test(token);
}

/**
 * Create session with auto-expiry
 */
export interface Session {
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}

export function createSession(userId: string, maxAge: number = 24 * 60 * 60 * 1000): Session {
  const now = new Date();
  return {
    token: generateSessionToken(),
    userId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + maxAge),
    lastActivity: now,
  };
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: Session): boolean {
  const now = new Date();
  return now.getTime() > session.expiresAt.getTime();
}

/**
 * Update session last activity
 */
export function updateSessionActivity(session: Session): Session {
  return {
    ...session,
    lastActivity: new Date(),
  };
}
