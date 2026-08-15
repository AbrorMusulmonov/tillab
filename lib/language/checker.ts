import checkerRules from "@/data/checker-rules.json";
import type { TextAnalysis, TextIssue } from "@/types";
import { createAIProvider } from "@/lib/ai/provider";
import { cyrillicToLatin } from "@/lib/transliteration";
import { countWords } from "@/lib/utils";
import { isMostlyCyrillic } from "./script";
import {
  applyCorrections,
  applyRuleEngine,
  findPunctuationIssues,
  type CheckerRule,
  type RuleMatch,
} from "./rule-engine";

function newId(): string {
  return crypto.randomUUID();
}

const dictionary = checkerRules as Record<string, CheckerRule>;

function toIssues(matches: RuleMatch[]): TextIssue[] {
  return matches.map((match) => ({
    id: newId(),
    type: match.rule.type,
    original: match.original,
    suggestion: match.suggestion,
    explanation: match.rule.explanation,
    start: match.start,
    end: match.end,
  }));
}

function mergeIssues(base: TextIssue[], extra: TextIssue[]): TextIssue[] {
  const seen = new Set(base.map((issue) => `${issue.start}:${issue.end}:${issue.original.toLowerCase()}`));
  const merged = [...base];
  for (const issue of extra) {
    const key = `${issue.start}:${issue.end}:${issue.original.toLowerCase()}`;
    if (seen.has(key)) continue;
    const overlap = merged.some(
      (existing) => issue.start < existing.end && issue.end > existing.start,
    );
    if (overlap) continue;
    merged.push(issue);
    seen.add(key);
  }
  return merged.sort((a, b) => a.start - b.start);
}

function locateIssue(text: string, original: string, suggestion: string, explanation: string, type: TextIssue["type"]): TextIssue | null {
  const index = text.toLowerCase().indexOf(original.toLowerCase());
  if (index === -1) return null;
  return {
    id: newId(),
    type,
    original: text.slice(index, index + original.length),
    suggestion,
    explanation,
    start: index,
    end: index + original.length,
  };
}

export async function analyzeUzbekText(text: string): Promise<TextAnalysis> {
  const convertedFromCyrillic = isMostlyCyrillic(text);
  const source = convertedFromCyrillic ? cyrillicToLatin(text) : text;
  const ruleMatches = [...applyRuleEngine(source, dictionary), ...findPunctuationIssues(source)];
  const ruleIssues = toIssues(ruleMatches);
  let correctedText = applyCorrections(source, ruleMatches);
  let issues = ruleIssues;
  let aiAvailable = true;
  let aiMessage: string | undefined;

  const provider = createAIProvider();
  if (provider) {
    try {
      const ai = await Promise.race([
        provider.analyzeUzbekText(source),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("AI timeout")), 8000);
        }),
      ]);
      const aiIssues = ai.issues.map((item) => {
        const located = locateIssue(source, item.original, item.suggestion, item.explanation, item.type);
        return (
          located ?? {
            id: newId(),
            type: item.type,
            original: item.original,
            suggestion: item.suggestion,
            explanation: item.explanation,
            start: 0,
            end: 0,
          }
        );
      });
      issues = mergeIssues(ruleIssues, aiIssues);
      if (ai.corrected_text.trim()) {
        correctedText = ai.corrected_text.trim();
      }
    } catch (error) {
      aiAvailable = false;
      const message = error instanceof Error ? error.message : "";
      if (message.includes("401")) {
        aiMessage = "Groq kaliti rad etildi. Vercel’da AI_API_KEY qiymatini tekshiring va Redeploy qiling.";
      } else if (message.includes("403")) {
        aiMessage = "Groq bu modelni tashkilotda yopib qo‘ygan. Boshqa modelga o‘tkazildi, qayta urinib ko‘ring.";
      } else if (/timeout|AbortError/i.test(message)) {
        aiMessage = "Groq javob berishga ulgurmadi. Qayta urinib ko‘ring.";
      } else {
        aiMessage =
          "Sun’iy intellekt tahlili vaqtincha mavjud emas. Asosiy imlo tekshiruvi davom ettirildi.";
      }
    }
  } else {
    aiAvailable = false;
    aiMessage =
      "AI kaliti serverda topilmadi. Vercel → Settings → Environment Variables: AI_API_KEY ni Production uchun qo‘ying, keyin Redeploy qiling.";
  }

  return {
    originalText: source,
    correctedText,
    issues,
    statistics: {
      words: countWords(source),
      characters: source.length,
      issues: issues.length,
    },
    convertedFromCyrillic,
    aiAvailable,
    aiMessage,
  };
}
