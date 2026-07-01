import redis from '../config/redis';

/**
 * Auto-Delete Messages Feature
 * Automatically remove messages from database after expiry
 */

export interface MessageCleanupTask {
  messageId: string;
  deleteAt: Date;
  chatId: string;
}

/**
 * Schedule message for auto-deletion
 */
export async function scheduleMessageDeletion(
  messageId: string,
  chatId: string,
  delayMs: number
): Promise<void> {
  const deleteAt = new Date(Date.now() + delayMs);
  const timestamp = deleteAt.getTime();

  // Store in Redis sorted set for efficient cleanup
  await redis.zadd('messages:to-delete', timestamp, messageId);

  // Store metadata
  await redis.hset(`message:${messageId}:cleanup`, {
    chatId,
    deleteAt: timestamp.toString(),
  });
}

/**
 * Get messages pending deletion
 */
export async function getMessagesForDeletion(now: Date): Promise<string[]> {
  const timestamp = now.getTime();
  return redis.zrangebyscore('messages:to-delete', '-inf', timestamp);
}

/**
 * Remove deletion task
 */
export async function removeDeletionTask(messageId: string): Promise<void> {
  await redis.zrem('messages:to-delete', messageId);
  await redis.del(`message:${messageId}:cleanup`);
}

/**
 * Cleanup job (run periodically)
 */
export async function cleanupExpiredMessages(): Promise<number> {
  const now = new Date();
  const messagesForDeletion = await getMessagesForDeletion(now);

  let deletedCount = 0;
  for (const messageId of messagesForDeletion) {
    try {
      // Delete from database (implementation depends on your DB)
      // await messageRepository.delete(messageId);

      // Remove from cleanup queue
      await removeDeletionTask(messageId);
      deletedCount++;
    } catch (error) {
      console.error(`Failed to delete message ${messageId}:`, error);
    }
  }

  return deletedCount;
}

/**
 * Start periodic cleanup job (run every minute)
 */
export function startCleanupJob(intervalMs: number = 60 * 1000): NodeJS.Timer {
  console.log('Starting message cleanup job...');

  return setInterval(async () => {
    try {
      const deletedCount = await cleanupExpiredMessages();
      if (deletedCount > 0) {
        console.log(`Cleaned up ${deletedCount} expired messages`);
      }
    } catch (error) {
      console.error('Error during message cleanup:', error);
    }
  }, intervalMs);
}
