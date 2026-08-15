const APOSTROPHE_CLASS = "['\u2018\u2019\u02BB\u02BC\u0060\u00B4]";

export const INTERNAL_APOSTROPHE = "'";
export const OUTPUT_APOSTROPHE = "\u2018";

export function normalizeApostrophes(text: string): string {
  return text.replace(new RegExp(APOSTROPHE_CLASS, "g"), INTERNAL_APOSTROPHE);
}

export function toOutputApostrophe(text: string): string {
  return text.replaceAll(INTERNAL_APOSTROPHE, OUTPUT_APOSTROPHE);
}

export function isApostropheChar(char: string | undefined): boolean {
  return Boolean(char && new RegExp(`^${APOSTROPHE_CLASS}$`).test(char));
}
