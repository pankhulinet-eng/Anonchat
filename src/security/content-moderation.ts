/**
 * Content Moderation Service
 * Filters spam, hate speech, and inappropriate content
 */

interface ModerationResult {
  isClean: boolean;
  flaggedWords: string[];
  category: 'clean' | 'spam' | 'hate_speech' | 'inappropriate' | 'toxic';
  severity: 'low' | 'medium' | 'high';
}

// Profanity and spam keywords database
const FLAGGED_WORDS = {
  spam: [
    'buy now',
    'click here',
    'limited offer',
    'viagra',
    'casino',
    'lottery',
    'win money',
  ],
  inappropriate: [
    'badword1',
    'badword2',
    // Add more as needed
  ],
  hate_speech: [
    'hateful_term1',
    'hateful_term2',
    // Add more as needed
  ],
};

const SPAM_PATTERNS = [
  /\$(\d+)/g, // Money symbols
  /click\s+here/gi,
  /buy\s+now/gi,
  /limited\s+time/gi,
  /free\s+money/gi,
  /http[s]?:\/\//g, // URLs
];

const SPAM_THRESHOLD = 3; // Number of spam patterns to flag as spam

/**
 * Moderate message content
 */
export function moderateContent(content: string): ModerationResult {
  const flaggedWords: string[] = [];
  const lowerContent = content.toLowerCase();
  let spamScore = 0;

  // Check for flagged words
  for (const [category, words] of Object.entries(FLAGGED_WORDS)) {
    for (const word of words) {
      if (lowerContent.includes(word.toLowerCase())) {
        flaggedWords.push(word);
        if (category === 'spam') spamScore++;
      }
    }
  }

  // Check spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(content)) {
      spamScore++;
    }
  }

  // Determine category and severity
  let category: ModerationResult['category'] = 'clean';
  let severity: ModerationResult['severity'] = 'low';

  if (spamScore >= SPAM_THRESHOLD) {
    category = 'spam';
    severity = spamScore >= 5 ? 'high' : 'medium';
  } else if (flaggedWords.length > 0) {
    category = 'inappropriate';
    severity = flaggedWords.length > 3 ? 'high' : 'medium';
  }

  return {
    isClean: category === 'clean',
    flaggedWords,
    category,
    severity,
  };
}

/**
 * Sanitize content by removing potentially harmful characters
 */
export function sanitizeContent(content: string): string {
  // Remove control characters
  let sanitized = content.replace(/[\x00-\x1F\x7F]/g, '');

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Limit length
  const MAX_LENGTH = 5000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Check if message contains excessive repetition (spam indicator)
 */
export function checkRepetition(content: string): boolean {
  const lines = content.split('\n');
  const words = content.split(/\s+/);

  // Check for repeated lines
  if (lines.length > 1) {
    const uniqueLines = new Set(lines);
    if (uniqueLines.size / lines.length < 0.3) {
      return true; // More than 70% repeated lines
    }
  }

  // Check for repeated words
  if (words.length > 5) {
    const uniqueWords = new Set(words);
    if (uniqueWords.size / words.length < 0.4) {
      return true; // More than 60% repeated words
    }
  }

  // Check for character repetition
  const charRepetition = /([a-zA-Z])\1{9,}/g;
  return charRepetition.test(content);
}

/**
 * Filter message content
 */
export function filterMessage(content: string): string {
  const moderation = moderateContent(content);

  if (moderation.flaggedWords.length === 0) {
    return content;
  }

  let filtered = content;
  for (const word of moderation.flaggedWords) {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  }

  return filtered;
}
