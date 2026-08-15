import { getSession } from "@/lib/auth/session";
import { hasPersonalData } from "@/lib/language/pii";
import { getStore } from "@/lib/store";
import { countWords } from "@/lib/utils";
import { textContributionSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Avval tizimga kiring." }, { status: 401 });
  const parsed = textContributionSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Noto‘g‘ri so‘rov." }, { status: 400 });
  }
  if (hasPersonalData(parsed.data.text)) {
    return Response.json(
      { error: "Matnda shaxsiy ma’lumot aniqlangan. Iltimos, uni olib tashlang." },
      { status: 400 },
    );
  }
  const item = await getStore().createTextContribution({
    userId: user.id,
    text: parsed.data.text,
    category: parsed.data.category,
    textType: parsed.data.textType,
    region: parsed.data.region,
    wordCount: countWords(parsed.data.text),
  });
  return Response.json({ item });
}
