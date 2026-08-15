import { describe, expect, it } from "vitest";
import { cyrillicToLatin, latinToCyrillic, transliterate } from "../lib/transliteration";

const A = "\u2018";

describe("latinToCyrillic", () => {
  it("converts core edge cases", () => {
    expect(latinToCyrillic("O‘zbekiston")).toBe("Ўзбекистон");
    expect(latinToCyrillic("O'zbekiston")).toBe("Ўзбекистон");
    expect(latinToCyrillic("G‘afur")).toBe("Ғафур");
    expect(latinToCyrillic("o‘g‘il")).toBe("ўғил");
    expect(latinToCyrillic("ma’naviyat")).toBe("маънавият");
    expect(latinToCyrillic("shahar")).toBe("шаҳар");
    expect(latinToCyrillic("chiroyli")).toBe("чиройли");
    expect(latinToCyrillic("yangi")).toBe("янги");
    expect(latinToCyrillic("yulduz")).toBe("юлдуз");
    expect(latinToCyrillic("yo‘l")).toBe("йўл");
  });

  it("handles uppercase words", () => {
    expect(latinToCyrillic("O‘ZBEKISTON")).toBe("ЎЗБЕКИСТОН");
    expect(latinToCyrillic("TOSHKENT")).toBe("ТОШКЕНТ");
  });

  it("normalizes mixed apostrophes", () => {
    expect(latinToCyrillic("o`gʻil")).toBe("ўғил");
    expect(latinToCyrillic("Gʼafur")).toBe("Ғафур");
  });
});

describe("cyrillicToLatin", () => {
  it("converts core letters back to Latin", () => {
    expect(cyrillicToLatin("Ўзбекистон")).toBe(`O${A}zbekiston`);
    expect(cyrillicToLatin("Ғафур")).toBe(`G${A}afur`);
    expect(cyrillicToLatin("ўғил")).toBe(`o${A}g${A}il`);
    expect(cyrillicToLatin("шаҳар")).toBe("shahar");
    expect(cyrillicToLatin("чиройли")).toBe("chiroyli");
    expect(cyrillicToLatin("янги")).toBe("yangi");
    expect(cyrillicToLatin("юлдуз")).toBe("yulduz");
    expect(cyrillicToLatin("йўл")).toBe(`yo${A}l`);
  });

  it("handles uppercase", () => {
    expect(cyrillicToLatin("ЎЗБЕКИСТОН")).toBe(`O${A}ZBEKISTON`);
    expect(cyrillicToLatin("ТОШКЕНТ")).toBe("TOSHKENT");
  });
});

describe("transliterate", () => {
  it("round-trips common words", () => {
    const words = ["Toshkent", "shahar", "yangi", "yulduz"];
    for (const word of words) {
      const cyr = transliterate(word, "latin-to-cyrillic");
      expect(transliterate(cyr, "cyrillic-to-latin").toLowerCase()).toBe(word.toLowerCase());
    }
  });
});
