import { getSession } from "@/lib/auth/session";
import { AUDIO_MAX_BYTES, AUDIO_MAX_SECONDS } from "@/lib/constants";
import { getStore } from "@/lib/store";

export async function GET() {
  const prompt = await getStore().getRandomPrompt();
  return Response.json({ prompt });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Avval tizimga kiring." }, { status: 401 });

  const form = await request.formData();
  const consent = form.get("consent") === "true";
  if (!consent) {
    return Response.json({ error: "Rozilik belgilanishi shart." }, { status: 400 });
  }

  const promptId = String(form.get("promptId") || "");
  const prompt = await getStore().getPromptById(promptId);
  if (!prompt) return Response.json({ error: "Gap topilmadi." }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Audio fayl yuborilmadi." }, { status: 400 });
  }
  if (file.size > AUDIO_MAX_BYTES) {
    return Response.json({ error: "Audio hajmi 20 MB dan oshmasligi kerak." }, { status: 400 });
  }
  const mimeType = (file.type || "audio/webm").split(";")[0].trim().toLowerCase();
  const allowed = [
    "audio/webm",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/x-m4a",
    "audio/m4a",
    "audio/ogg",
  ];
  if (!allowed.includes(mimeType)) {
    return Response.json({ error: "Ruxsat etilmagan audio formati." }, { status: 400 });
  }

  const duration = Math.min(Number(form.get("duration") || 1), AUDIO_MAX_SECONDS);
  const bytes = Buffer.from(await file.arrayBuffer());
  const store = getStore();
  const id = crypto.randomUUID();
  const audioUrl = await store.saveAudioFile(id, bytes, mimeType);
  const item = await store.createAudioContribution({
    userId: user.id,
    promptId: prompt.id,
    promptText: prompt.text,
    audioUrl,
    duration,
    region: String(form.get("region") || "") || undefined,
    ageRange: String(form.get("ageRange") || "") || undefined,
    gender: String(form.get("gender") || "") || undefined,
  });
  return Response.json({ item });
}
