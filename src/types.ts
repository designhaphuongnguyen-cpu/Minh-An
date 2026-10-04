export type MascotType = 'bunny' | 'cat' | 'bear' | 'fox';

export type SkillId =
  | 'counting'
  | 'comparison'
  | 'addition10'
  | 'addition20'
  | 'subtraction10'
  | 'subtraction20'
  | 'numberSequence'
  | 'geometry'
  | 'measurement'
  | 'time'
  | 'wordProblems'
  | 'englishLetters'
  | 'englishVocabulary'
  | 'englishColorsNumbers'
  | 'vietnameseLetters'
  | 'vietnameseRhymes'
  | 'vietnameseReading';

export interface MascotInfo {
  id: MascotType;
  name: string;
  emoji: string;
  avatarBg: string;
  tagline: string;
  personality: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  grade: number;
  avatar: string;
  mascot: MascotType;
  equippedAccessory?: string;
  stars: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  dailyGoalStars: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  completedOnboarding: boolean;
  dailyStreakHistory: string[];
  totalQuestionsSolved: number;
  totalTimeMinutes: number;
}

export interface SkillProgressItem {
  skillId: SkillId;
  name: string;
  category: string;
  icon: string;
  masteryScore: number; // 0 - 100
  correctCount: number;
  wrongCount: number;
  lastPracticed: string;
}

export type SkillProgressMap = Record<SkillId, SkillProgressItem>;

export interface Attempt {
  id: string;
  timestamp: string;
  skillId: SkillId;
  questionText: string;
  studentAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  mistakeType?: 'countingError' | 'calculationError' | 'comparisonError' | 'readingError' | 'unknown';
  responseTimeMs: number;
}

export type VisualType =
  | 'item-count'
  | 'item-addition'
  | 'item-subtraction'
  | 'comparison-balance'
  | 'sequence-train'
  | 'shape-match'
  | 'clock-read'
  | 'story-card'
  | 'shop-coins'
  | 'letter-card'
  | 'word-picture-card'
  | 'tone-card'
  | 'reading-card';

export interface Question {
  id: string;
  skillId: SkillId;
  title?: string;
  questionText: string;
  visualType: VisualType;
  visualData: {
    emoji?: string;
    itemsA?: string[];
    itemsB?: string[];
    countA?: number;
    countB?: number;
    subtractedCount?: number;
    operator?: '+' | '-' | '>' | '<' | '=' | '?';
    sequence?: (number | string | null)[];
    targetShape?: string;
    clockHour?: number;
    shopPrice?: number;
    totalCoins?: number;
    itemName?: string;
    contextStory?: string;
    letter?: string;
    word?: string;
    translation?: string;
    picture?: string;
    syllables?: string[];
    toneMark?: string;
    sentence?: string;
  };
  options: (number | string)[];
  correctAnswer: number | string;
  hint1: string; // Gợi ý nhẹ
  hint2: string; // Gợi ý hình ảnh
  hint3: string; // Giải thích từng bước
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface RewardItem {
  id: string;
  name: string;
  category: 'hat' | 'bow' | 'accessory' | 'sticker' | 'pet' | 'badge';
  emoji: string;
  cost: number;
  unlocked: boolean;
  unlockedAt?: string;
  description: string;
}

export type NavigationPage =
  | 'onboarding'
  | 'home'
  | 'learn-today'
  | 'practice-topics'
  | 'topic-practice'
  | 'weakness-practice'
  | 'daily-challenge'
  | 'math-games'
  | 'game-rabbit'
  | 'game-balloons'
  | 'game-train'
  | 'game-shop'
  | 'treasure'
  | 'album'
  | 'parents';

export interface AIParentReport {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  realWorldActivities: string[];
  cheerMessage: string;
}
