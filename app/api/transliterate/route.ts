import { transliterate } from "@/lib/transliteration";
import { getStore } from "@/lib/store";
import { transliterateSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = transliterateSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Noto‘g‘ri so‘rov." }, { status: 400 });
    }
    const result = transliterate(parsed.data.text, parsed.data.direction);
    try {
      await getStore().incrementTransliterationCount();
    } catch {
      // analytics must not break transliteration
    }
    return Response.json({ result, direction: parsed.data.direction });
  } catch {
    return Response.json({ error: "O‘girish amalga oshmadi." }, { status: 500 });
  }
}
