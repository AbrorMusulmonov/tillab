import { describe, expect, it } from "vitest";
import { parseAnalysis } from "../lib/ai/schema";

describe("parseAnalysis", () => {
  it("accepts string issues from Groq", () => {
    const result = parseAnalysis({
      issues: ["ketvommiza instead of ketamiz", "bolilar instead of bolalar"],
      corrected_text: "Salom, ertaga dachaga ketamiz, sog‘-salomat bo‘linglar.",
    });
    expect(result.issues).toHaveLength(2);
    expect(result.issues[0]?.original).toBe("ketvommiza");
    expect(result.issues[0]?.suggestion).toBe("ketamiz");
    expect(result.corrected_text).toContain("ketamiz");
  });

  it("accepts object issues", () => {
    const result = parseAnalysis({
      issues: [
        {
          type: "foreign_word",
          original: "proyekt",
          suggestion: "loyiha",
          explanation: "Tabiiyroq.",
        },
      ],
      corrected_text: "Bu loyiha yaxshi.",
    });
    expect(result.issues[0]?.type).toBe("foreign_word");
    expect(result.issues[0]?.suggestion).toBe("loyiha");
  });
});
