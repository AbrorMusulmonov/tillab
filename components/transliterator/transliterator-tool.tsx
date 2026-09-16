"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Copy, Download, Eraser, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  convertLoadedDocx,
  convertText,
  readDocx,
  type AlphabetChoice,
  type AlphabetSource,
  type AlphabetTarget,
  type ConversionOptions,
  type DocxDocument,
} from "@/lib/transliteration/convert";
import { HighlightedLatin } from "@/components/transliterator/highlighted-latin";
import { cn } from "@/lib/utils";

const SAMPLE = "Oʻzbekiston Respublikasi — mustaqil, demokratik davlat. Shahar markazida choyxona bor.";
const SAMPLES = [
  { label: "Oʻzbekiston", text: SAMPLE },
  { label: "Ўзбекистон", text: "Ўзбекистон Республикаси — мустақил, демократик давлат. Шаҳар марказида чойхона бор." },
  { label: "Isʼhoq", text: "Isʼhoq va asʼhob soʻzlari tutuq belgisi bilan yoziladi." },
];

const SOURCE_OPTIONS: { value: AlphabetChoice; label: string }[] = [
  { value: "auto", label: "Avtomatik aniqlash" },
  { value: "cyrillic", label: "Kirill" },
  { value: "old-latin", label: "Amaldagi lotin (oʻ, gʻ, sh, ch)" },
  { value: "new-latin", label: "Yangi lotin (ö, ğ, ş, ç)" },
];

const TARGET_OPTIONS: { value: AlphabetTarget; label: string }[] = [
  { value: "new-latin", label: "Yangi lotin (ö, ğ, ş, ç)" },
  { value: "old-latin", label: "Amaldagi lotin (oʻ, gʻ, sh, ch)" },
  { value: "cyrillic", label: "Kirill" },
];

const DETECTED: Record<AlphabetSource, string> = {
  cyrillic: "kirill",
  "old-latin": "amaldagi lotin",
  "new-latin": "yangi lotin",
};

function downloadBlob(bytes: Uint8Array | string, filename: string, type: string) {
  const blob = new Blob([bytes] as BlobPart[], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function parseProtectedTerms(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TransliteratorTool() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return <div className="h-[28rem] animate-pulse rounded-2xl bg-muted" />;
  }
  return <TransliteratorPanel />;
}

function TransliteratorPanel() {
  const [tab, setTab] = useState<"text" | "file">("text");
  const [source, setSource] = useState(() => {
    if (typeof window === "undefined") return SAMPLE;
    return new URLSearchParams(window.location.search).get("q")?.slice(0, 8000) || SAMPLE;
  });
  const [from, setFrom] = useState<AlphabetChoice>("auto");
  const [to, setTo] = useState<AlphabetTarget>("new-latin");
  const [protectSpans, setProtectSpans] = useState(true);
  const [protectedTerms, setProtectedTerms] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileError, setFileError] = useState("");
  const [docx, setDocx] = useState<DocxDocument | null>(null);
  const [docxName, setDocxName] = useState("");
  const [dragging, setDragging] = useState(false);
  const counted = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const options = useMemo<ConversionOptions>(
    () => ({
      protectSpans,
      protectedTerms: parseProtectedTerms(protectedTerms),
    }),
    [protectSpans, protectedTerms],
  );

  const result = useMemo(() => {
    if (tab === "file" && docx) {
      return convertLoadedDocx(docx, from, to, options);
    }
    return convertText(source, from, to, options);
  }, [docx, from, options, source, tab, to]);

  useEffect(() => {
    if (counted.current || !result.text.trim()) return;
    counted.current = true;
    void fetch("/api/transliterate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countOnly: true }),
    });
  }, [result.text]);

  function swap() {
    const actual = from === "auto" ? result.source : from;
    setFrom(to);
    setTo(actual);
  }

  async function copyResult() {
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadResult() {
    if (result.bytes) {
      const name = docxName.replace(/\.docx$/i, "") || "tillab";
      downloadBlob(result.bytes, `${name}-ogirilgan.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      return;
    }
    downloadBlob(result.text, "tillab-ogirilgan.txt", "text/plain;charset=utf-8");
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setFileError("");
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith(".docx")) {
        const buffer = await file.arrayBuffer();
        const loaded = readDocx(buffer);
        setDocx(loaded);
        setDocxName(file.name);
        setSource(loaded.text);
        setTab("file");
        return;
      }
      if (/\.(txt|md|csv|srt)$/i.test(name) || file.type.startsWith("text/")) {
        const text = await file.text();
        setDocx(null);
        setDocxName(file.name);
        setSource(text);
        setTab("text");
        return;
      }
      setFileError("Faqat .docx, .txt, .md, .csv yoki .srt fayllar qabul qilinadi.");
    } catch {
      setFileError("Faylni ochib bo‘lmadi. Word fayl buzilgan yoki parol bilan himoyalangan bo‘lishi mumkin.");
    }
  }

  return (
    <div className="space-y-8">
      <ul className="flex flex-wrap gap-2 text-[13px] text-muted-foreground">
        {(
          [
            ["o\u02BB", "\u00F6"],
            ["g\u02BB", "\u011F"],
            ["sh", "\u015F"],
            ["ch", "\u00E7"],
          ] as const
        ).map(([fromLetter, toLetter]) => (
          <li key={fromLetter} className="rounded-full border border-border/80 bg-white/80 px-3 py-1 shadow-sm backdrop-blur-sm">
            <span className="font-medium text-foreground">{fromLetter}</span>
            <span className="mx-1.5">→</span>
            {toLetter}
          </li>
        ))}
      </ul>

      <div className="rounded-[22px] border border-white/80 bg-white/80 p-4 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:p-6">
        <div className="mb-5 inline-flex gap-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setTab("text")}
            className={cn(
              "rounded-md px-4 py-2 text-sm",
              tab === "text" ? "bg-white font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            Matn
          </button>
          <button
            type="button"
            onClick={() => setTab("file")}
            className={cn(
              "rounded-md px-4 py-2 text-sm",
              tab === "file" ? "bg-white font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            Hujjat
          </button>
        </div>

        <div className="mb-4 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Qaysi alifbodan</span>
            <Select value={from} onChange={(event) => setFrom(event.target.value as AlphabetChoice)}>
              {SOURCE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </label>
          <Button variant="outline" size="icon" onClick={swap} aria-label="Almashtirish" className="mb-0.5">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Qaysi alifboga</span>
            <Select value={to} onChange={(event) => setTo(event.target.value as AlphabetTarget)}>
              {TARGET_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </label>
        </div>
        {from === "auto" && (source.trim() || docx) ? (
          <p className="mb-4 text-xs text-muted-foreground">Aniqlandi: {DETECTED[result.source]}</p>
        ) : null}

        {tab === "file" ? (
          <div
            className={cn(
              "mb-4 rounded-xl border border-dashed border-border px-4 py-10 text-center",
              dragging && "border-primary bg-muted/50",
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              void onFile(event.dataTransfer.files[0]);
            }}
          >
            <p className="text-sm font-medium">Word yoki matn faylini shu yerga tashlang</p>
            <p className="mt-2 text-xs text-muted-foreground">
              .docx formatlash saqlanadi. .txt, .md, .csv, .srt ham ochiladi.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Fayl tanlash
            </Button>
            {docxName ? <p className="mt-3 text-sm text-muted-foreground">{docxName}</p> : null}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Matn</span>
            <Textarea
              value={source}
              onChange={(event) => {
                setSource(event.target.value);
                setDocx(null);
              }}
              placeholder="Matnni yozing, joylashtiring yoki faylni tashlang…"
              className="min-h-64"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                void onFile(event.dataTransfer.files[0]);
              }}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Natija</span>
            <div className="min-h-64 rounded-xl border border-border/80 bg-muted/50 p-4 text-sm leading-7">
              {result.text ? <HighlightedLatin text={result.text} /> : <span className="text-muted-foreground"> </span>}
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {SAMPLES.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setSource(sample.text);
                setDocx(null);
                setTab("text");
              }}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {sample.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {result.inputChars} → {result.outputChars} belgi
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={copyResult} disabled={!result.text}>
            <Copy className="h-4 w-4" />
            {copied ? "Nusxa olindi" : "Nusxa olish"}
          </Button>
          <Button variant="outline" onClick={downloadResult} disabled={!result.text}>
            <Download className="h-4 w-4" />
            Yuklab olish
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSource("");
              setDocx(null);
              setDocxName("");
              setFileError("");
            }}
          >
            <Eraser className="h-4 w-4" />
            Tozalash
          </Button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".docx,.txt,.md,.csv,.srt,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => {
            void onFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        {fileError ? <p className="mt-3 text-sm text-destructive">{fileError}</p> : null}

        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-muted-foreground">Sozlamalar</summary>
          <div className="mt-3 space-y-3">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={protectSpans}
                onChange={(event) => setProtectSpans(event.target.checked)}
                className="mt-1"
              />
              Havolalar, email manzillar va `kod` qismlarini o‘zgartirmaslik
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">O‘zgartirilmaydigan so‘zlar (vergul bilan)</span>
              <input
                value={protectedTerms}
                onChange={(event) => setProtectedTerms(event.target.value)}
                placeholder="Chevrolet, Shakespeare"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              />
            </label>
          </div>
        </details>
      </div>

      <div>
        <h2 className="text-sm font-semibold">Tekshirib chiqing</h2>
        {result.groups.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Hammasi aniq: tekshiradigan joy yo‘q.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {result.groups.map((group) => (
              <div key={group.key} className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm">{group.message}</p>
                {group.alternatives.length > 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Boshqa variantlar: {group.alternatives.join(", ")}
                  </p>
                ) : null}
                <p className="mt-3 flex flex-wrap gap-2 text-sm">
                  {group.words.slice(0, 12).map((word) => (
                    <span key={`${word.before}${word.hit}${word.after}`} className="rounded-md bg-muted px-2 py-1">
                      {word.before}
                      <strong>{word.hit}</strong>
                      {word.after}
                      {word.count > 1 ? ` ×${word.count}` : ""}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs leading-6 text-muted-foreground">
        O‘girish brauzeringizda bo‘ladi — matn serverga yuborilmaydi. Senat yangi alifbo qonunini 2026-yil 10-sentabrda
        ma’qulladi; muhim hujjatlarni tekshirib chiqing. Mexanizm:{" "}
        <a href="https://github.com/azakapro/alifbo" className="underline underline-offset-2" target="_blank" rel="noreferrer">
          alifbo
        </a>{" "}
        (MIT).
      </p>
    </div>
  );
}
