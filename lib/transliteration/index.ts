import type { TransliterateDirection } from "@/types";
import { cyrillicToLatin } from "./cyrillic-to-latin";
import { latinToCyrillic } from "./latin-to-cyrillic";

export { normalizeApostrophes, OUTPUT_APOSTROPHE } from "./apostrophe";
export { latinToCyrillic } from "./latin-to-cyrillic";
export { cyrillicToLatin } from "./cyrillic-to-latin";

export function transliterate(text: string, direction: TransliterateDirection): string {
  if (direction === "latin-to-cyrillic") {
    return latinToCyrillic(text);
  }
  return cyrillicToLatin(text);
}
