import {
  detectAlphabet,
  fromCyrillic,
  toCyrillic,
  toNewLatin,
  toOldLatin,
  type ConversionOptions,
  type Warning,
} from "alifbo";
import { convertDocx, readDocx, type DocxDocument, type SpanResult } from "./docx";

export type AlphabetSource = "cyrillic" | "old-latin" | "new-latin";
export type AlphabetChoice = AlphabetSource | "auto";
export type AlphabetTarget = AlphabetSource;

export type ReviewWord = {
  before: string;
  hit: string;
  after: string;
  count: number;
};

export type ReviewGroup = {
  key: string;
  message: string;
  alternatives: string[];
  words: ReviewWord[];
  distinctWords: number;
};

export type ConvertResult = {
  text: string;
  source: AlphabetSource;
  warningCount: number;
  groups: ReviewGroup[];
  inputChars: number;
  outputChars: number;
  bytes?: Uint8Array;
};

const WORDS_PER_GROUP = 60;

const REVIEW_RULES = new Set([
  "cyrillic.tse.positional",
  "cyrillic.shcha.ambiguous",
  "latin.tse.ambiguous",
  "latin.shcha.ambiguous",
  "latin.c.ambiguous",
  "latin.unmapped",
]);

export const REVIEW_MESSAGES: Record<string, string> = {
  "cyrillic.tse.positional": "«ц» so‘z boshida «s», boshqa joyda «ts» deb yozildi.",
  "cyrillic.shcha.ambiguous": "«щ» harfining yangi lotinda aniq mosi yo‘q; «şç» tanlandi.",
  "cyrillic.compound": "«ё», «ю», «я» ikki harf bilan (yo, yu, ya) yozildi.",
  "latin.tse.ambiguous": "«ts» kirill «ц» deb o‘qildi, lekin «тс» bo‘lishi ham mumkin.",
  "latin.shcha.ambiguous": "«şç» kirill «щ» deb o‘qildi, lekin «шч» bo‘lishi ham mumkin.",
  "latin.iotated": "«yo», «yu», «ya» bitta kirill harfi (ё, ю, я) deb o‘qildi.",
  "latin.c.ambiguous": "Yakka «c» kirill «ц» deb o‘qildi.",
};

export function resolveSource(text: string, choice: AlphabetChoice): AlphabetSource {
  if (choice !== "auto") return choice;
  const { alphabet } = detectAlphabet(text);
  if (alphabet === "cyrillic" || (alphabet === "mixed" && /[А-яЁёЎўҚқҒғҲҳ]/u.test(text))) {
    return "cyrillic";
  }
  return alphabet === "new-latin" ? "new-latin" : "old-latin";
}

export function convertSpan(
  text: string,
  from: AlphabetSource,
  to: AlphabetTarget,
  opts: ConversionOptions = {},
): SpanResult {
  if (from === "cyrillic") {
    if (to === "cyrillic") return { text, warnings: [], basis: text };
    const latin = fromCyrillic(text, opts);
    const result = to === "old-latin" ? toOldLatin(latin.text, opts).text : latin.text;
    return { text: result, warnings: latin.warnings, basis: text };
  }
  const newLatin = from === "old-latin" ? toNewLatin(text, opts).text : text;
  if (to === "new-latin") {
    return { text: toNewLatin(newLatin, opts).text, warnings: [], basis: text };
  }
  if (to === "old-latin") {
    return { text: toOldLatin(newLatin, opts).text, warnings: [], basis: text };
  }
  const cyrillic = toCyrillic(text, opts);
  return { text: cyrillic.text, warnings: cyrillic.warnings, basis: text };
}

function needsReview(warning: Warning): boolean {
  return REVIEW_RULES.has(warning.rule);
}

function ruleKey(rule: string): string {
  if (/^cyrillic\.(yo|yu|ya)\.compound$/.test(rule)) return "cyrillic.compound";
  if (/^latin\.(yo|yu|ya)\.ambiguous$/.test(rule)) return "latin.iotated";
  return rule;
}

const WORD_CHAR = /[\p{L}\p{M}\p{N}ʻʼ'‘’`-]/u;
const MAX_CONTEXT = 40;

function wordAround(basis: string, index: number, length: number): Omit<ReviewWord, "count"> {
  let start = index;
  let end = index + length;
  while (start > 0 && index - start < MAX_CONTEXT && WORD_CHAR.test(basis[start - 1]!)) start -= 1;
  while (end < basis.length && end - index < MAX_CONTEXT && WORD_CHAR.test(basis[end]!)) end += 1;
  return {
    before: basis.slice(start, index),
    hit: basis.slice(index, index + length),
    after: basis.slice(index + length, end),
  };
}

function summarize(batches: { warnings: Warning[]; basis: string }[]): ReviewGroup[] {
  const groups = new Map<string, { message: string; alternatives: string[]; words: Map<string, ReviewWord> }>();
  for (const { warnings, basis } of batches) {
    for (const warning of warnings) {
      if (!needsReview(warning)) continue;
      const key = ruleKey(warning.rule);
      let group = groups.get(key);
      if (!group) {
        group = {
          message: REVIEW_MESSAGES[key] ?? warning.message,
          alternatives: [],
          words: new Map(),
        };
        groups.set(key, group);
      }
      for (const alternative of warning.alternatives ?? []) {
        if (!group.alternatives.includes(alternative)) group.alternatives.push(alternative);
      }
      const parts = wordAround(basis, warning.index, warning.length);
      const id = `${parts.before}\0${parts.hit}\0${parts.after}`;
      const existing = group.words.get(id);
      if (existing) existing.count += 1;
      else group.words.set(id, { ...parts, count: 1 });
    }
  }
  return [...groups].map(([key, group]) => {
    const words = [...group.words.values()].sort((a, b) => b.count - a.count);
    return {
      key,
      message: group.message,
      alternatives: group.alternatives,
      words: words.slice(0, WORDS_PER_GROUP),
      distinctWords: words.length,
    };
  });
}

function countCharacters(text: string): number {
  let count = 0;
  for (let index = 0; index < text.length; index += 1) {
    const unit = text.charCodeAt(index);
    if (unit < 0xdc00 || unit > 0xdfff) count += 1;
  }
  return count;
}

export function convertText(
  text: string,
  from: AlphabetChoice,
  to: AlphabetTarget,
  opts: ConversionOptions = {},
): ConvertResult {
  const source = resolveSource(text, from);
  const result = convertSpan(text, source, to, opts);
  const reviewWarnings = result.warnings.filter(needsReview);
  return {
    text: result.text,
    source,
    warningCount: reviewWarnings.length,
    groups: summarize([result]),
    inputChars: countCharacters(text),
    outputChars: countCharacters(result.text),
  };
}

export function convertLoadedDocx(
  doc: DocxDocument,
  from: AlphabetChoice,
  to: AlphabetTarget,
  opts: ConversionOptions = {},
): ConvertResult {
  const source = resolveSource(doc.text, from);
  const converted = convertDocx(doc, (text) => convertSpan(text, source, to, opts));
  const batches = converted.spans.map(({ result }) => result);
  let warningCount = 0;
  for (const batch of batches) warningCount += batch.warnings.filter(needsReview).length;
  return {
    text: converted.text,
    source,
    warningCount,
    groups: summarize(batches),
    inputChars: countCharacters(doc.text),
    outputChars: countCharacters(converted.text),
    bytes: converted.bytes,
  };
}

export { readDocx };
export type { ConversionOptions, DocxDocument };
