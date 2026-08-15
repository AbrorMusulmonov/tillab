import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Ruxsat yo‘q." }, { status: 403 });
  }
  const store = getStore();
  const [texts, audios, suggestions] = await Promise.all([
    store.listTextContributions(),
    store.listAudioContributions(),
    store.listAlternativeSuggestions(),
  ]);
  return Response.json({ texts, audios, suggestions });
}
