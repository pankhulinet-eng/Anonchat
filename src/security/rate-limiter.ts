import RedisStore from 'rate-limit-redis';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

/**
 * Rate Limiter Service
 * Protects against spam and DDoS attacks
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  skipSuccessfulRequests: false,
};

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(config: RateLimitConfig = DEFAULT_CONFIG) {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:', // Rate limit prefix
    }),
    windowMs: config.windowMs,
    max: config.maxRequests,
    message:
      config.message ||
      'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req: Request) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    },
  });
}

/**
 * Rate limiter for specific routes
 */
export const messageRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // Max 10 messages per minute
  message: 'Too many messages sent. Please wait before sending another.',
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Max 5 auth attempts
  message: 'Too many login attempts. Please try again later.',
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // Max 30 API calls per minute
});

/**
 * Custom rate limiter for user-specific endpoints
 */
export function createUserRateLimiter(
  maxRequests: number,
  windowMs: number = 60 * 1000
) {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'user-rl:',
    }),
    windowMs,
    max: maxRequests,
    keyGenerator: (req: Request) => {
      // Use user ID instead of IP for authenticated requests
      return req.user?.id || req.ip || 'anonymous';
    },
  });
}

/**
 * Check if request is rate limited
 */
export async function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const redisKey = `rate-limit:${key}`;
  const current = await redis.incr(redisKey);

  if (current === 1) {
    await redis.expire(redisKey, Math.ceil(windowMs / 1000));
  }

  return current > limit;
}

/**
 * Get remaining requests
 */
export async function getRemainingRequests(
  key: string,
  limit: number
): Promise<number> {
  const redisKey = `rate-limit:${key}`;
  const current = await redis.get(redisKey);
  const count = current ? parseInt(current) : 0;
  return Math.max(0, limit - count);
}
