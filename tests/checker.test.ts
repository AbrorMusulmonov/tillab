import { describe, expect, it } from "vitest";
import { analyzeUzbekText } from "../lib/language/checker";

describe("rule engine checker", () => {
  it("suggests Uzbek alternatives and corrected text", async () => {
    const result = await analyzeUzbekText("Bu proyekt studentlarga yangi opportunity beradi.");
    const originals = result.issues.map((issue) => issue.original.toLowerCase());
    expect(originals.some((item) => item.includes("proyekt"))).toBe(true);
    expect(originals.some((item) => item.includes("student"))).toBe(true);
    expect(originals.some((item) => item.includes("opportunity"))).toBe(true);
    expect(result.correctedText.toLowerCase()).toContain("loyiha");
    expect(result.correctedText.toLowerCase()).toContain("talaba");
    expect(result.correctedText.toLowerCase()).toContain("imkoniyat");
  });
});
