import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { suggestAlternativeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Avval tizimga kiring." }, { status: 401 });
  const parsed = suggestAlternativeSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Noto‘g‘ri so‘rov." }, { status: 400 });
  }
  const item = await getStore().createAlternativeSuggestion({
    userId: user.id,
    word: parsed.data.word,
    alternative: parsed.data.alternative,
    explanation: parsed.data.explanation,
    example: parsed.data.example,
  });
  return Response.json({ item });
}
