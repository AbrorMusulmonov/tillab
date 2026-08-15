import { z } from "zod";
import type { IssueType } from "@/types";

const issueTypeSchema = z.enum(["spelling", "style", "foreign_word", "punctuation"]);

export const aiIssueSchema = z.object({
  type: z.string().optional(),
  original: z.string().min(1),
  suggestion: z.string().min(1),
  explanation: z.string().optional(),
});

export const aiAnalysisSchema = z.object({
  issues: z.array(aiIssueSchema).optional(),
  corrected_text: z.string().optional(),
  correctedText: z.string().optional(),
});

export type AIAnalysisResult = {
  issues: {
    type: IssueType;
    original: string;
    suggestion: string;
    explanation: string;
  }[];
  corrected_text: string;
};

function toIssueType(value: string | undefined): IssueType {
  const parsed = issueTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : "style";
}

export function parseAnalysis(payload: unknown): AIAnalysisResult {
  const parsed = aiAnalysisSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("AI javobi JSON formatida emas.");
  }
  return {
    issues: (parsed.data.issues ?? []).map((issue) => ({
      type: toIssueType(issue.type),
      original: issue.original,
      suggestion: issue.suggestion,
      explanation: issue.explanation || "Quyidagi variant tabiiyroq bo‘lishi mumkin.",
    })),
    corrected_text: parsed.data.corrected_text || parsed.data.correctedText || "",
  };
}
