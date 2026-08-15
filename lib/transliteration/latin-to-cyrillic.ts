import { normalizeApostrophes } from "./apostrophe";

const SINGLE: Record<string, string> = {
  a: "а",
  b: "б",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "ҳ",
  i: "и",
  j: "ж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "қ",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  x: "х",
  y: "й",
  z: "з",
};

function applyCase(source: string, target: string): string {
  if (!target) return target;
  const allUpper = source === source.toUpperCase() && /[A-Za-z]/.test(source);
  if (allUpper) return target.toUpperCase();
  if (source[0] === source[0]?.toUpperCase()) {
    return target[0].toUpperCase() + target.slice(1);
  }
  return target;
}

function isWordStart(text: string, index: number): boolean {
  if (index === 0) return true;
  return !/[A-Za-z'\u2018\u2019\u02BB\u02BC]/.test(text[index - 1] ?? "");
}

export function latinToCyrillic(input: string): string {
  const text = normalizeApostrophes(input);
  let result = "";
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];
    const third = text[i + 2];
    const two = text.slice(i, i + 2);
    const lowerTwo = two.toLowerCase();
    const lowerCh = ch.toLowerCase();

    if ((lowerCh === "o" || lowerCh === "g") && next === "'") {
      const mapped = lowerCh === "o" ? "ў" : "ғ";
      result += applyCase(ch + next, mapped);
      i += 2;
      continue;
    }

    if (lowerTwo === "yo" && third !== "'") {
      result += applyCase(two, "ё");
      i += 2;
      continue;
    }

    if (lowerTwo === "ya") {
      result += applyCase(two, "я");
      i += 2;
      continue;
    }

    if (lowerTwo === "yu") {
      result += applyCase(two, "ю");
      i += 2;
      continue;
    }

    if (lowerTwo === "ye") {
      result += applyCase(two, "е");
      i += 2;
      continue;
    }

    if (lowerTwo === "sh") {
      result += applyCase(two, "ш");
      i += 2;
      continue;
    }

    if (lowerTwo === "ch") {
      result += applyCase(two, "ч");
      i += 2;
      continue;
    }

    if (lowerTwo === "ng") {
      const mapped = applyCase(two, "нг");
      result += mapped;
      i += 2;
      continue;
    }

    if (lowerTwo === "ts") {
      result += applyCase(two, "ц");
      i += 2;
      continue;
    }

    if (ch === "'") {
      result += "ъ";
      i += 1;
      continue;
    }

    if (lowerCh === "e" && isWordStart(text, i)) {
      result += applyCase(ch, "э");
      i += 1;
      continue;
    }

    const mapped = SINGLE[lowerCh];
    if (mapped) {
      result += applyCase(ch, mapped);
      i += 1;
      continue;
    }

    result += ch;
    i += 1;
  }

  return result;
}
