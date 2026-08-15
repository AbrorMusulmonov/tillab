import { OUTPUT_APOSTROPHE } from "./apostrophe";

const SINGLE: Record<string, string> = {
  а: "a",
  б: "b",
  д: "d",
  е: "e",
  э: "e",
  ф: "f",
  г: "g",
  ҳ: "h",
  и: "i",
  ж: "j",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  қ: "q",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  в: "v",
  х: "x",
  з: "z",
  й: "y",
  ъ: OUTPUT_APOSTROPHE,
  ь: "",
  ы: "i",
  ц: "ts",
  щ: "sh",
};

function applyCase(source: string, target: string): string {
  if (!target) return target;
  if (source === source.toUpperCase()) return target.toUpperCase();
  if (source[0] === source[0]?.toUpperCase()) {
    return target[0].toUpperCase() + target.slice(1);
  }
  return target;
}

function peekIsUpper(text: string, index: number): boolean {
  const ch = text[index];
  if (!ch) return true;
  if (!/[А-ЯЁЎҒҚҲа-яёўғқҳ]/.test(ch)) return true;
  return ch === ch.toUpperCase();
}

export function cyrillicToLatin(input: string): string {
  let result = "";
  let i = 0;

  while (i < input.length) {
    const ch = input[i];
    const lower = ch.toLowerCase();
    const nextUpper = peekIsUpper(input, i + 1);

    const special: Record<string, string> = {
      ў: `o${OUTPUT_APOSTROPHE}`,
      ғ: `g${OUTPUT_APOSTROPHE}`,
      ш: "sh",
      ч: "ch",
      я: "ya",
      ю: "yu",
      ё: "yo",
    };

    if (special[lower]) {
      let mapped = special[lower];
      if (ch === ch.toUpperCase()) {
        mapped = nextUpper ? mapped.toUpperCase() : mapped[0].toUpperCase() + mapped.slice(1);
      }
      result += mapped;
      i += 1;
      continue;
    }

    const mapped = SINGLE[lower];
    if (mapped !== undefined) {
      result += applyCase(ch, mapped);
      i += 1;
      continue;
    }

    result += ch;
    i += 1;
  }

  return result;
}
