import { parseAnalysis, type AIAnalysisResult } from "./schema";
import { AI_SYSTEM_PROMPT, type LanguageAIProvider } from "./types";

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1] ?? trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("AI javobi JSON formatida emas.");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

export class GeminiProvider implements LanguageAIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.AI_MODEL || "gemini-2.0-flash",
  ) {}

  async analyzeUzbekText(text: string): Promise<AIAnalysisResult> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: AI_SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Analyze this Uzbek text and return JSON with keys issues and corrected_text:\n\n${text}`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Gemini xatosi: ${response.status}`);
    }
    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const output = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    return parseAnalysis(extractJson(output));
  }
}

export class OpenAIProvider implements LanguageAIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.AI_MODEL || "gpt-4o-mini",
  ) {}

  async analyzeUzbekText(text: string): Promise<AIAnalysisResult> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze this Uzbek text and return JSON with keys issues and corrected_text:\n\n${text}`,
          },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI xatosi: ${response.status}`);
    }
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return parseAnalysis(extractJson(data.choices?.[0]?.message?.content ?? ""));
  }
}

export class GroqProvider implements LanguageAIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.AI_MODEL || "llama-3.3-70b-versatile",
  ) {}

  async analyzeUzbekText(text: string): Promise<AIAnalysisResult> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        model: this.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze this Uzbek text and return JSON with keys issues and corrected_text:\n\n${text}`,
          },
        ],
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Groq xatosi: ${response.status} ${detail.slice(0, 200)}`);
    }
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return parseAnalysis(extractJson(data.choices?.[0]?.message?.content ?? ""));
  }
}

export function createAIProvider(): LanguageAIProvider | null {
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!apiKey) return null;
  const provider = (process.env.AI_PROVIDER || "").toLowerCase();
  if (apiKey.startsWith("gsk_") || provider === "groq") return new GroqProvider(apiKey);
  if (provider === "openai" || apiKey.startsWith("sk-")) return new OpenAIProvider(apiKey);
  if (provider === "gemini") return new GeminiProvider(apiKey);
  return new GroqProvider(apiKey);
}
