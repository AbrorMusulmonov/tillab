import { transliterate } from "@/lib/transliteration";
import { getStore } from "@/lib/store";
import { transliterateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const parsed = transliterateSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Noto‘g‘ri so‘rov." }, { status: 400 });
  }
  const result = transliterate(parsed.data.text, parsed.data.direction);
  await getStore().incrementTransliterationCount();
  return Response.json({ result, direction: parsed.data.direction });
}
