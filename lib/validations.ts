import { z } from "zod";

export const checkTextSchema = z.object({
  text: z.string().trim().min(1, "Matn kiriting.").max(20_000),
});

export const transliterateSchema = z.object({
  text: z.string().min(0).max(50_000),
  direction: z.enum(["latin-to-cyrillic", "cyrillic-to-latin"]),
});

export const alternativesQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const suggestAlternativeSchema = z.object({
  word: z.string().trim().min(1).max(80),
  alternative: z.string().trim().min(1).max(120),
  explanation: z.string().trim().min(1).max(500),
  example: z.string().trim().max(300).optional(),
});

export const textContributionSchema = z.object({
  text: z.string().trim().min(20, "Matn kamida 20 belgidan iborat bo‘lsin.").max(20_000),
  category: z.string().min(1),
  textType: z.string().min(1),
  region: z.string().min(1),
  consent: z.literal(true),
});

export const authSchema = z.object({
  email: z.string().trim().email("Email manzili noto‘g‘ri."),
  password: z.string().min(8, "Parol kamida 8 belgidan iborat bo‘lsin."),
  name: z.string().trim().min(2).max(80).optional(),
});

export const contributionPatchSchema = z.object({
  kind: z.enum(["text", "audio", "suggestion"]),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  category: z.string().optional(),
  region: z.string().optional(),
});
