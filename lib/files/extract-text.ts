import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const MAX_CHARS = 20_000;

function clip(text: string): string {
  const cleaned = text.replace(/\u0000/g, "").replace(/\r\n/g, "\n").trim();
  if (cleaned.length <= MAX_CHARS) return cleaned;
  return cleaned.slice(0, MAX_CHARS);
}

export async function extractTextFromFile(buffer: Buffer, filename: string, mime: string): Promise<string> {
  const name = filename.toLowerCase();
  const isTxt = name.endsWith(".txt") || mime.startsWith("text/");
  const isPdf = name.endsWith(".pdf") || mime === "application/pdf";
  const isDocx =
    name.endsWith(".docx") ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (isTxt) {
    return clip(buffer.toString("utf8"));
  }

  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer });
    return clip(result.value);
  }

  if (isPdf) {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      return clip(result.text);
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Faqat .txt, .pdf yoki .docx fayllar qabul qilinadi.");
}
