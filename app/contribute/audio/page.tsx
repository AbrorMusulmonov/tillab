import { redirect } from "next/navigation";
import { AudioRecorder } from "@/components/contribution/audio-recorder";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";

export default async function ContributeAudioPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/contribute/audio");
  const prompt = await getStore().getRandomPrompt();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Audio qo‘shish</h1>
      <p className="mt-2 text-muted-foreground">
        Platforma bergan gapni o‘qing. Maksimal davomiylik 2 daqiqa, hajm 20 MB.
      </p>
      <div className="mt-8">
        <AudioRecorder prompt={prompt} />
      </div>
    </div>
  );
}
