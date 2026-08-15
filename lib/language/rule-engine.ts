import type { IssueType } from "@/types";
import { normalizeApostrophes } from "@/lib/transliteration/apostrophe";

export type CheckerRule = {
  suggestions: string[];
  type: IssueType;
  explanation: string;
};

const SUFFIXES = [
  "larimizga",
  "larimizni",
  "larimizda",
  "larimizdan",
  "laringa",
  "laringni",
  "laringda",
  "lariga",
  "larini",
  "larida",
  "laridan",
  "larining",
  "larga",
  "larni",
  "lardan",
  "larda",
  "larning",
  "lari",
  "lar",
  "imizga",
  "imizni",
  "imizda",
  "ning",
  "gacha",
  "dan",
  "ga",
  "ni",
  "da",
  "mi",
].sort((a, b) => b.length - a.length);

export type RuleMatch = {
  original: string;
  start: number;
  end: number;
  stem: string;
  suffix: string;
  rule: CheckerRule;
  suggestion: string;
};

function preserveCase(source: string, target: string): string {
  if (!source || !target) return target;
  if (source === source.toUpperCase()) return target.toUpperCase();
  if (source[0] === source[0].toUpperCase()) {
    return target[0].toUpperCase() + target.slice(1);
  }
  return target;
}

function tokenizeWithOffsets(text: string): { token: string; start: number; end: number }[] {
  const tokens: { token: string; start: number; end: number }[] = [];
  const pattern = /[A-Za-zÀ-ÿА-Яа-яЁёЎўҒғҚқҲҳOʻGʻoʻgʻ''\u2018\u2019\u02BB\u02BC]+/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    tokens.push({
      token: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return tokens;
}

function splitStem(word: string, dictionary: Record<string, CheckerRule>): { stem: string; suffix: string } | null {
  const lower = normalizeApostrophes(word).toLowerCase();
  if (dictionary[lower]) return { stem: lower, suffix: "" };

  for (const suffix of SUFFIXES) {
    if (lower.length > suffix.length + 2 && lower.endsWith(suffix)) {
      const stem = lower.slice(0, -suffix.length);
      if (dictionary[stem]) return { stem, suffix };
    }
  }
  return null;
}

export function applyRuleEngine(text: string, dictionary: Record<string, CheckerRule>): RuleMatch[] {
  const matches: RuleMatch[] = [];
  for (const { token, start, end } of tokenizeWithOffsets(text)) {
    const found = splitStem(token, dictionary);
    if (!found) continue;
    const rule = dictionary[found.stem];
    const baseSuggestion = rule.suggestions[0] ?? found.stem;
    const suggestion = preserveCase(token, `${baseSuggestion}${found.suffix}`);
    matches.push({
      original: token,
      start,
      end,
      stem: found.stem,
      suffix: found.suffix,
      rule,
      suggestion,
    });
  }
  return matches;
}

export function applyCorrections(text: string, matches: RuleMatch[]): string {
  let result = text;
  const ordered = [...matches].sort((a, b) => b.start - a.start);
  for (const match of ordered) {
    result = result.slice(0, match.start) + match.suggestion + result.slice(match.end);
  }
  return result;
}

export function findPunctuationIssues(text: string): RuleMatch[] {
  const issues: RuleMatch[] = [];
  const doubleSpace = / {2,}/g;
  let match: RegExpExecArray | null;
  while ((match = doubleSpace.exec(text)) !== null) {
    issues.push({
      original: match[0],
      start: match.index,
      end: match.index + match[0].length,
      stem: match[0],
      suffix: "",
      suggestion: " ",
      rule: {
        suggestions: [" "],
        type: "punctuation",
        explanation: "Ketma-ket bo‘sh joylarni bitta bo‘sh joy bilan almashtirish tavsiya etiladi.",
      },
    });
  }
  return issues;
}
