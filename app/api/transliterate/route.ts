import { convertText } from "@/lib/transliteration/convert";
import { getStore } from "@/lib/store";
import { transliterateSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = transliterateSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Noto‘g‘ri so‘rov." }, { status: 400 });
    }

    if (parsed.data.countOnly) {
      try {
        await getStore().incrementTransliterationCount();
      } catch {
        // analytics must not break transliteration
      }
      return Response.json({ ok: true });
    }

    const from =
      parsed.data.from ?? (parsed.data.direction === "cyrillic-to-latin" ? "cyrillic" : "old-latin");
    const to =
      parsed.data.to ?? (parsed.data.direction === "cyrillic-to-latin" ? "old-latin" : "cyrillic");
    const converted = convertText(parsed.data.text ?? "", from, to);

    try {
      await getStore().incrementTransliterationCount();
    } catch {
      // analytics must not break transliteration
    }

    return Response.json({
      result: converted.text,
      source: converted.source,
      to,
      warningCount: converted.warningCount,
      groups: converted.groups,
    });
  } catch {
    return Response.json({ error: "O‘girish amalga oshmadi." }, { status: 500 });
  }
}
