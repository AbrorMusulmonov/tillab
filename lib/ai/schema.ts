import { z } from "zod";

export const issueTypeSchema = z.enum(["spelling", "style", "foreign_word", "punctuation"]);

export const aiIssueSchema = z.object({
  type: issueTypeSchema,
  original: z.string().min(1),
  suggestion: z.string().min(1),
  explanation: z.string().min(1),
});

export const aiAnalysisSchema = z.object({
  issues: z.array(aiIssueSchema),
  corrected_text: z.string(),
});

export type AIAnalysisResult = z.infer<typeof aiAnalysisSchema>;
