import { NextRequest } from "next/server";
import { extractTextFromFile } from "@/lib/files/extract-text";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 20;

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`${clientIp(request)}:extract`, 10)) {
      return Response.json({ error: "Juda ko‘p so‘rov. Birozdan so‘ng urinib ko‘ring." }, { status: 429 });
    }

    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Fayl tanlang." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: "Fayl 8 MB dan katta bo‘lmasin." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromFile(buffer, file.name, file.type);
    if (!text) {
      return Response.json({ error: "Fayldan matn topilmadi." }, { status: 422 });
    }
    return Response.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fayl o‘qilmadi.";
    return Response.json({ error: message }, { status: 500 });
  }
}
