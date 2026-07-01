/**
 * Message Expiry Feature
 * Messages auto-delete after specified time
 */

export enum MessageExpiryTime {
  ONE_MINUTE = 60 * 1000,
  FIVE_MINUTES = 5 * 60 * 1000,
  ONE_HOUR = 60 * 60 * 1000,
  ONE_DAY = 24 * 60 * 60 * 1000,
  ONE_WEEK = 7 * 24 * 60 * 60 * 1000,
}

export interface ExpiringMessage {
  id: string;
  content: string;
  expiresAt: Date;
  isExpired: boolean;
}

/**
 * Create message with expiry
 */
export function createExpiringMessage(
  messageId: string,
  content: string,
  expiryTime: MessageExpiryTime = MessageExpiryTime.ONE_HOUR
): ExpiringMessage {
  const now = new Date();
  return {
    id: messageId,
    content,
    expiresAt: new Date(now.getTime() + expiryTime),
    isExpired: false,
  };
}

/**
 * Check if message is expired
 */
export function isMessageExpired(message: ExpiringMessage): boolean {
  return new Date().getTime() > message.expiresAt.getTime();
}

/**
 * Get remaining time for message
 */
export function getRemainingTime(message: ExpiringMessage): number {
  const now = new Date().getTime();
  const expiryTime = message.expiresAt.getTime();
  return Math.max(0, expiryTime - now);
}

/**
 * Format remaining time
 */
export function formatRemainingTime(milliseconds: number): string {
  if (milliseconds <= 0) return 'Expired';

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}
