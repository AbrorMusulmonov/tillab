"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AGE_RANGES, AUDIO_MAX_BYTES, AUDIO_MAX_SECONDS, GENDERS, REGIONS } from "@/lib/constants";
import type { AudioPrompt } from "@/types";

export function AudioRecorder({ prompt }: { prompt: AudioPrompt | null }) {
  const router = useRouter();
  const [currentPrompt, setCurrentPrompt] = useState(prompt);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [file, setFile] = useState<Blob | null>(null);
  const [consent, setConsent] = useState(false);
  const [region, setRegion] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  async function nextPrompt() {
    const response = await fetch("/api/contributions/audio");
    const data = (await response.json()) as { prompt: AudioPrompt | null };
    setCurrentPrompt(data.prompt);
    setFile(null);
    setSeconds(0);
  }

  async function startRecording() {
    setError("");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      setFile(blob);
      stream.getTracks().forEach((track) => track.stop());
    };
    mediaRef.current = recorder;
    recorder.start();
    setRecording(true);
    setSeconds(0);
    timerRef.current = window.setInterval(() => {
      setSeconds((value) => {
        if (value + 1 >= AUDIO_MAX_SECONDS) {
          stopRecording();
          return AUDIO_MAX_SECONDS;
        }
        return value + 1;
      });
    }, 1000);
  }

  function stopRecording() {
    mediaRef.current?.stop();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }

  async function submit() {
    if (!file || !currentPrompt) return;
    if (file.size > AUDIO_MAX_BYTES) {
      setError("Audio hajmi 20 MB dan oshmasligi kerak.");
      return;
    }
    setLoading(true);
    setError("");
    const body = new FormData();
    body.set("promptId", currentPrompt.id);
    body.set("consent", String(consent));
    body.set("region", region);
    body.set("ageRange", ageRange);
    body.set("gender", gender);
    body.set("duration", String(seconds || 1));
    body.set("file", file, "recording.webm");
    try {
      const response = await fetch("/api/contributions/audio", { method: "POST", body });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Audio yuklanmadi.");
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-muted p-5">
        <p className="text-sm text-muted-foreground">O‘qish uchun gap</p>
        <p className="mt-2 text-lg leading-8">{currentPrompt?.text || "Gap topilmadi."}</p>
        <Button variant="ghost" className="mt-2 px-0" onClick={() => void nextPrompt()}>
          Boshqa gap
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {!recording ? (
          <Button onClick={() => void startRecording()} aria-label="Yozishni boshlash">
            <Mic className="h-4 w-4" />
            Yozishni boshlash
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopRecording} aria-label="Yozishni to‘xtatish">
            <Square className="h-4 w-4" />
            To‘xtatish ({seconds}s)
          </Button>
        )}
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-4 text-sm">
          <Upload className="h-4 w-4" />
          Audio yuklash
          <input
            type="file"
            accept=".webm,.wav,.mp3,.m4a,audio/*"
            className="sr-only"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected) setFile(selected);
            }}
          />
        </label>
      </div>
      {file ? <p className="text-sm text-accent">Audio tayyor: {(file.size / (1024 * 1024)).toFixed(2)} MB</p> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="region">Hudud</Label>
          <Select id="region" value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="">Tanlanmagan</option>
            {REGIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="age">Yosh oralig‘i</Label>
          <Select id="age" value={ageRange} onChange={(event) => setAgeRange(event.target.value)}>
            <option value="">Tanlanmagan</option>
            {AGE_RANGES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="gender">Jins</Label>
          <Select id="gender" value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="">Tanlanmagan</option>
            {GENDERS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input type="checkbox" className="mt-1" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>
          Ovoz yozuvim anonim shaklda o‘zbek tili va nutq texnologiyalarini rivojlantirish maqsadida ishlatilishiga
          roziman.
        </span>
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button onClick={() => void submit()} disabled={!consent || !file || loading}>
        {loading ? "Audio yuklanmoqda..." : "Yuborish"}
      </Button>
    </div>
  );
}
