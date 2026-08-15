import type {
  AlternativeSuggestion,
  AlternativeWord,
  AppUser,
  AudioContribution,
  AudioPrompt,
  ContributionStatus,
  DatasetStats,
  TextContribution,
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
  createAudioContribution(input: Omit<AudioContribution, "id" | "createdAt" | "status">): Promise<AudioContribution>;
  listTextContributions(filter?: { userId?: string; status?: ContributionStatus }): Promise<TextContribution[]>;
  listAudioContributions(filter?: { userId?: string; status?: ContributionStatus }): Promise<AudioContribution[]>;
  updateContribution(kind: "text" | "audio", id: string, patch: { status?: ContributionStatus; category?: string; region?: string }): Promise<TextContribution | AudioContribution | null>;
  deleteContribution(kind: "text" | "audio", id: string, userId: string): Promise<boolean>;
  saveAudioFile(id: string, bytes: Buffer, mimeType: string): Promise<string>;
  readAudioFile(id: string): Promise<{ bytes: Buffer; mimeType: string } | null>;
  createAlternativeSuggestion(input: Omit<AlternativeSuggestion, "id" | "createdAt" | "status">): Promise<AlternativeSuggestion>;
  listAlternativeSuggestions(filter?: { userId?: string; status?: ContributionStatus }): Promise<AlternativeSuggestion[]>;
  updateAlternativeSuggestion(id: string, status: ContributionStatus): Promise<AlternativeSuggestion | null>;
  listApprovedAlternatives(): Promise<AlternativeWord[]>;
  incrementCheckCount(userId?: string): Promise<void>;
  incrementTransliterationCount(): Promise<void>;
  getStats(): Promise<DatasetStats>;
  getPromptById(id: string): Promise<AudioPrompt | null>;
  getRandomPrompt(): Promise<AudioPrompt | null>;
};
