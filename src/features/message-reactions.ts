/**
 * Message Reactions Feature
 * Add emoji reactions to messages
 */

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface MessageWithReactions {
  id: string;
  content: string;
  reactions: Map<string, number>; // emoji -> count
  userReactions: string[]; // current user's reactions
}

const ALLOWED_EMOJIS = [
  '👍', '❤️', '😂', '😮', '😢', '🔥', '😍', '🤔', '👌', '✨',
  '🎉', '🚀', '💯', '🙏', '😎', '🤩', '😘', '🤪', '😴', '😤',
];

/**
 * Validate if emoji is allowed
 */
export function isValidEmoji(emoji: string): boolean {
  return ALLOWED_EMOJIS.includes(emoji);
}

/**
 * Add reaction to message
 */
export async function addReaction(
  messageId: string,
  userId: string,
  emoji: string
): Promise<MessageReaction | null> {
  if (!isValidEmoji(emoji)) {
    return null;
  }

  return {
    id: `reaction_${messageId}_${userId}_${emoji}`,
    messageId,
    userId,
    emoji,
    createdAt: new Date(),
  };
}

/**
 * Remove reaction from message
 */
export async function removeReaction(
  messageId: string,
  userId: string,
  emoji: string
): Promise<boolean> {
  // Implementation depends on database
  return true;
}

/**
 * Get reactions summary for message
 */
export function getReactionsSummary(
  reactions: MessageReaction[]
): Map<string, number> {
  const summary = new Map<string, number>();

  for (const reaction of reactions) {
    const count = summary.get(reaction.emoji) || 0;
    summary.set(reaction.emoji, count + 1);
  }

  return summary;
}
