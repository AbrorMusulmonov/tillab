import type {
  AlternativeSuggestion,
  AlternativeWord,
  AppUser,
  ContributionStatus,
  DatasetStats,
  TextContribution,
  TextIssue,
} from "@/types";

export type NewUser = {
  email: string;
  name: string;
  passwordHash: string;
  role?: AppUser["role"];
};

export type StoreAdapter = {
  createUser(input: NewUser): Promise<AppUser>;
  findUserByEmail(email: string): Promise<AppUser | null>;
  findUserById(id: string): Promise<AppUser | null>;
  listUsers(): Promise<AppUser[]>;
  createTextContribution(input: Omit<TextContribution, "id" | "createdAt" | "status" | "wordCount"> & { wordCount: number }): Promise<TextContribution>;
  listTextContributions(filter?: { userId?: string; status?: ContributionStatus }): Promise<TextContribution[]>;
  updateContribution(kind: "text", id: string, patch: { status?: ContributionStatus; category?: string; region?: string }): Promise<TextContribution | null>;
  deleteContribution(kind: "text", id: string, userId: string): Promise<boolean>;
  createAlternativeSuggestion(input: Omit<AlternativeSuggestion, "id" | "createdAt" | "status">): Promise<AlternativeSuggestion>;
  listAlternativeSuggestions(filter?: { userId?: string; status?: ContributionStatus }): Promise<AlternativeSuggestion[]>;
  updateAlternativeSuggestion(id: string, status: ContributionStatus): Promise<AlternativeSuggestion | null>;
  listApprovedAlternatives(): Promise<AlternativeWord[]>;
  incrementCheckCount(userId?: string): Promise<void>;
  incrementTransliterationCount(): Promise<void>;
  recordCorrections(issues: TextIssue[]): Promise<void>;
  getStats(): Promise<DatasetStats>;
};
