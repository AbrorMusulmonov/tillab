const CYRILLIC = /[\u0400-\u04FF]/g;
const LATIN = /[A-Za-z]/g;

export function isMostlyCyrillic(text: string): boolean {
  const cyrillic = text.match(CYRILLIC)?.length ?? 0;
  const latin = text.match(LATIN)?.length ?? 0;
  return cyrillic > 0 && cyrillic >= latin;
}
