const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE = /(?:\+?998[\s-]?)?(?:\(?\d{2}\)?[\s-]?)?\d{3}[\s-]?\d{2}[\s-]?\d{2}/;
const CARD = /\b(?:\d[ -]*?){13,19}\b/;
const PASSPORT = /\b[A-Z]{2}\d{7}\b/;

export function detectPii(text: string): string[] {
  const found: string[] = [];
  if (EMAIL.test(text)) found.push("email");
  if (PHONE.test(text.replace(/\s/g, " "))) {
    const digits = text.replace(/\D/g, "");
    if (digits.length >= 9) found.push("phone");
  }
  if (CARD.test(text)) found.push("card");
  if (PASSPORT.test(text)) found.push("passport");
  return found;
}

export function hasPersonalData(text: string): boolean {
  return detectPii(text).length > 0;
}
