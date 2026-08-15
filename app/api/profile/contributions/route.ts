import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";

export async function GET() {
  const user = await getSession();
  if (!user) return Response.json({ error: "Avval tizimga kiring." }, { status: 401 });
  const store = getStore();
  const [texts, audios, suggestions] = await Promise.all([
    store.listTextContributions({ userId: user.id }),
    store.listAudioContributions({ userId: user.id }),
    store.listAlternativeSuggestions({ userId: user.id }),
  ]);
  return Response.json({ texts, audios, suggestions });
}
