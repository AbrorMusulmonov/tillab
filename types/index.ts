export type UserRole = "user" | "admin";

export type ContributionStatus = "pending" | "approved" | "rejected";

export type IssueType = "spelling" | "style" | "foreign_word" | "punctuation";

export type TextIssue = {
  id: string;
  type: IssueType;
  original: string;
  suggestion: string;
  explanation: string;
  start: number;
  end: number;
};

export type TextAnalysis = {
  originalText: string;
  correctedText: string;
  issues: TextIssue[];
  statistics: {
    words: number;
    characters: number;
    issues: number;
  };
  convertedFromCyrillic?: boolean;
  aiAvailable?: boolean;
  aiMessage?: string;
};

export type CorrectionPair = {
  original: string;
  suggestion: string;
  count: number;
};

export type AlternativeWord = {
  id: string;
  foreignWord: string;
  language?: string;
  alternatives: string[];
  definition?: string;
  examples?: string[];
  category?: string;
  usage?: string;
};

export type AlternativeSuggestion = {
  id: string;
  userId: string;
  word: string;
  alternative: string;
  explanation: string;
  example?: string;
  status: ContributionStatus;
  createdAt: string;
};

export type AppUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  passwordHash?: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type TextContribution = {
  id: string;
  userId: string;
  text: string;
  category: string;
  textType: string;
  region: string;
  status: ContributionStatus;
  wordCount: number;
  createdAt: string;
};

export type DatasetStats = {
  textSamples: number;
  totalWords: number;
  contributors: number;
  textChecks: number;
  transliterations: number;
  pendingContributions: number;
  approvedContributions: number;
  totalUsers: number;
  categories: Record<string, number>;
  topCorrections: CorrectionPair[];
};

export type TransliterateDirection = "latin-to-cyrillic" | "cyrillic-to-latin";
