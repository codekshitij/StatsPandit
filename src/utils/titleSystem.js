// Title System for Stats Pandit
// Defines the 6-tier title progression system based on correct answers

export const TITLE_TIERS = [
  {
    id: 'rookie_spectator',
    title: 'Rookie Spectator',
    minScore: 0,
    maxScore: 9,
    description: 'An encouraging start for those new to the game.',
    badge: '🆕',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
    textColor: '#c4b5fd'
  },
  {
    id: 'armchair_analyst',
    title: 'Armchair Analyst',
    minScore: 10,
    maxScore: 17,
    description: 'You know your stuff and can hold your own in a sports debate.',
    badge: '📺',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
    textColor: '#93c5fd'
  },
  {
    id: 'seasoned_strategist',
    title: 'Seasoned Strategist',
    minScore: 18,
    maxScore: 25,
    description: 'You see the game on a deeper level, recognizing plays and patterns others miss.',
    badge: '🎯',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
    textColor: '#6ee7b7'
  },
  {
    id: 'elite_tactician',
    title: 'Elite Tactician',
    minScore: 26,
    maxScore: 33,
    description: 'Your knowledge is impressive, bordering on professional. You rarely make a bad call.',
    badge: '⚡',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#f59e0b',
    textColor: '#fbbf24'
  },
  {
    id: 'stats_savant',
    title: 'Stats Savant',
    minScore: 34,
    maxScore: 41,
    description: 'You have a near-encyclopedic memory for sports statistics and history. Truly gifted.',
    badge: '🧠',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
    textColor: '#fca5a5'
  },
  {
    id: 'ultimate_pandit',
    title: 'The Ultimate Pandit',
    minScore: 42,
    maxScore: 50,
    description: 'The pinnacle of achievement. Your sports knowledge is legendary. You have mastered the challenge.',
    badge: '👑',
    color: '#ffd700',
    bgColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#ffd700',
    textColor: '#fef08a'
  }
];

/**
 * Get title information based on the number of correct answers
 * @param {number} correctAnswers - Number of correct answers achieved
 * @returns {Object} Title tier object
 */
export const getTitleByScore = (correctAnswers) => {
  for (const tier of TITLE_TIERS) {
    if (correctAnswers >= tier.minScore && correctAnswers <= tier.maxScore) {
      return tier;
    }
  }
  
  // If somehow the score is above the maximum, return the highest title
  if (correctAnswers > 50) {
    return TITLE_TIERS[TITLE_TIERS.length - 1];
  }
  
  // Default to the first title if something goes wrong
  return TITLE_TIERS[0];
};

/**
 * Get the next title tier that the user can achieve
 * @param {number} correctAnswers - Current number of correct answers
 * @returns {Object|null} Next title tier object or null if already at max
 */
export const getNextTitle = (correctAnswers) => {
  const currentTitle = getTitleByScore(correctAnswers);
  const currentIndex = TITLE_TIERS.findIndex(tier => tier.id === currentTitle.id);
  
  if (currentIndex < TITLE_TIERS.length - 1) {
    return TITLE_TIERS[currentIndex + 1];
  }
  
  return null; // Already at the highest title
};

/**
 * Calculate progress towards the next title
 * @param {number} correctAnswers - Current number of correct answers
 * @returns {Object} Progress information
 */
export const getTitleProgress = (correctAnswers) => {
  const currentTitle = getTitleByScore(correctAnswers);
  const nextTitle = getNextTitle(correctAnswers);
  
  if (!nextTitle) {
    return {
      current: currentTitle,
      next: null,
      progress: 100,
      answersNeeded: 0,
      isMaxTitle: true
    };
  }
  
  const progressInCurrentTier = correctAnswers - currentTitle.minScore;
  const tierRange = currentTitle.maxScore - currentTitle.minScore + 1;
  const progressPercentage = Math.round((progressInCurrentTier / tierRange) * 100);
  const answersToNext = nextTitle.minScore - correctAnswers;
  
  return {
    current: currentTitle,
    next: nextTitle,
    progress: progressPercentage,
    answersNeeded: Math.max(0, answersToNext),
    isMaxTitle: false,
    currentTierProgress: progressInCurrentTier,
    currentTierTotal: tierRange
  };
};

/**
 * Check if a user has achieved a new title
 * @param {number} previousCorrect - Previous number of correct answers
 * @param {number} newCorrect - New number of correct answers
 * @returns {Object} Title change information
 */
export const checkTitleProgression = (previousCorrect, newCorrect) => {
  const previousTitle = getTitleByScore(previousCorrect);
  const newTitle = getTitleByScore(newCorrect);
  
  const hasProgressed = newTitle.id !== previousTitle.id;
  
  return {
    hasProgressed,
    previousTitle,
    newTitle,
    isFirstTitle: previousCorrect === 0 && newCorrect > 0
  };
};

/**
 * Get all titles with their unlock status for a user
 * @param {number} correctAnswers - User's current correct answers
 * @returns {Array} Array of titles with unlock status
 */
export const getTitleUnlockStatus = (correctAnswers) => {
  return TITLE_TIERS.map(tier => ({
    ...tier,
    isUnlocked: correctAnswers >= tier.minScore,
    isCurrent: correctAnswers >= tier.minScore && correctAnswers <= tier.maxScore
  }));
};

/**
 * Get a formatted title display string
 * @param {Object} titleTier - Title tier object
 * @param {boolean} includeBadge - Whether to include the badge emoji
 * @returns {string} Formatted title string
 */
export const formatTitleDisplay = (titleTier, includeBadge = true) => {
  if (!titleTier) return 'No Title';
  
  return includeBadge 
    ? `${titleTier.badge} ${titleTier.title}`
    : titleTier.title;
};

/**
 * Get motivational message based on current progress
 * @param {Object} progressInfo - Progress information from getTitleProgress
 * @returns {string} Motivational message
 */
export const getMotivationalMessage = (progressInfo) => {
  const { current, next, answersNeeded, isMaxTitle } = progressInfo;
  
  if (isMaxTitle) {
    return `🎉 Congratulations! You've achieved the highest title: ${current.title}!`;
  }
  
  if (answersNeeded === 0) {
    return `🚀 You're ready to unlock "${next.title}"! Keep playing to achieve it!`;
  }
  
  if (answersNeeded === 1) {
    return `🔥 Just 1 more correct answer to become "${next.title}"!`;
  }
  
  if (answersNeeded <= 3) {
    return `💪 Only ${answersNeeded} more correct answers to reach "${next.title}"!`;
  }
  
  if (answersNeeded <= 5) {
    return `⭐ ${answersNeeded} correct answers away from "${next.title}" - you're getting close!`;
  }
  
  return `🎯 Work towards ${answersNeeded} more correct answers to unlock "${next.title}"!`;
};

/**
 * Get CSS styles for a title tier
 * @param {Object} titleTier - Title tier object
 * @returns {Object} CSS style object
 */
export const getTitleStyles = (titleTier) => {
  if (!titleTier) return {};
  
  return {
    backgroundColor: titleTier.bgColor,
    border: `2px solid ${titleTier.borderColor}`,
    color: titleTier.textColor,
    boxShadow: `0 0 20px ${titleTier.color}40`,
    textShadow: `0 0 10px ${titleTier.color}80`
  };
};

/**
 * Calculate lifetime achievements for a user
 * @param {Array} quizHistory - User's complete quiz history
 * @returns {Object} Achievement statistics
 */
export const calculateLifetimeAchievements = (quizHistory) => {
  if (!quizHistory || quizHistory.length === 0) {
    return {
      totalCorrect: 0,
      currentTitle: TITLE_TIERS[0],
      highestTitle: TITLE_TIERS[0],
      titleProgression: getTitleProgress(0),
      totalQuizzes: 0
    };
  }
  
  const totalCorrect = quizHistory.reduce((sum, quiz) => sum + (quiz.correct || 0), 0);
  const currentTitle = getTitleByScore(totalCorrect);
  
  // Find the highest title ever achieved (in case they had more correct answers before)
  const maxCorrectInHistory = Math.max(...quizHistory.map(quiz => quiz.correct || 0));
  const allTimeHighCorrect = Math.max(totalCorrect, maxCorrectInHistory);
  const highestTitle = getTitleByScore(allTimeHighCorrect);
  
  return {
    totalCorrect,
    currentTitle,
    highestTitle,
    titleProgression: getTitleProgress(totalCorrect),
    totalQuizzes: quizHistory.length
  };
};

export default {
  TITLE_TIERS,
  getTitleByScore,
  getNextTitle,
  getTitleProgress,
  checkTitleProgression,
  getTitleUnlockStatus,
  formatTitleDisplay,
  getMotivationalMessage,
  getTitleStyles,
  calculateLifetimeAchievements
};
