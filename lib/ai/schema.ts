import { z } from "zod";
import type { IssueType } from "@/types";

const issueTypeSchema = z.enum(["spelling", "style", "foreign_word", "punctuation"]);

const objectIssueSchema = z.object({
  type: z.string().optional(),
  original: z.string().min(1).optional(),
  suggestion: z.string().min(1).optional(),
  explanation: z.string().optional(),
});

export const aiAnalysisSchema = z.object({
  issues: z.array(z.union([objectIssueSchema, z.string()])).optional(),
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

function fromStringIssue(value: string): AIAnalysisResult["issues"][number] | null {
  const text = value.trim();
  if (!text) return null;
  const match = text.match(/^["“]?(.+?)["”]?\s+(?:instead of|→|->|:)\s+["“]?(.+?)["”]?$/i);
  return {
    type: "style",
    original: match?.[1]?.trim() || text,
    suggestion: match?.[2]?.trim() || text,
    explanation: "Quyidagi variant tabiiyroq bo‘lishi mumkin.",
  };
}

export function parseAnalysis(payload: unknown): AIAnalysisResult {
  const parsed = aiAnalysisSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("AI javobi JSON formatida emas.");
  }
  const issues = (parsed.data.issues ?? [])
    .map((issue) => {
      if (typeof issue === "string") return fromStringIssue(issue);
      if (!issue.original && !issue.suggestion) return null;
      return {
        type: toIssueType(issue.type),
        original: issue.original || issue.suggestion || "",
        suggestion: issue.suggestion || issue.original || "",
        explanation: issue.explanation || "Quyidagi variant tabiiyroq bo‘lishi mumkin.",
      };
    })
    .filter((issue): issue is AIAnalysisResult["issues"][number] => Boolean(issue?.original));

  return {
    issues,
    corrected_text: parsed.data.corrected_text || parsed.data.correctedText || "",
  };
}
