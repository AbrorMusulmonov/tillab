"use client";

import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CHECKER_SAMPLES, ISSUE_TYPE_LABELS } from "@/lib/constants";
import type { TextAnalysis, TextIssue } from "@/types";

function applyToText(current: string, issue: TextIssue): string {
  if (issue.start >= 0 && issue.end > issue.start && current.slice(issue.start, issue.end) === issue.original) {
    return current.slice(0, issue.start) + issue.suggestion + current.slice(issue.end);
  }
  const index = current.toLowerCase().indexOf(issue.original.toLowerCase());
  if (index === -1) return current;
  return current.slice(0, index) + issue.suggestion + current.slice(index + issue.original.length);
}

export function CheckerEditor() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<TextAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const grouped = useMemo(() => {
    const groups: Record<string, TextIssue[]> = { spelling: [], style: [], foreign_word: [], punctuation: [] };
    for (const issue of result?.issues ?? []) {
      groups[issue.type] = [...(groups[issue.type] ?? []), issue];
    }
    return groups;
  }, [result]);

  async function check() {
    setLoading(true);
    setError("");
    setNote("");
    try {
      const response = await fetch("/api/check-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const raw = await response.text();
      if (!raw) throw new Error("Server javob bermadi. Sahifani yangilab, qayta urinib ko‘ring.");
      const data = JSON.parse(raw) as TextAnalysis & { error?: string };
      if (!response.ok) throw new Error(data.error || "Tekshiruv amalga oshmadi.");
      if (data.convertedFromCyrillic) {
        setText(data.originalText);
        setNote("Kirill matn avval lotinga o‘girildi, so‘ng tekshirildi.");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }

  function applyIssue(issue: TextIssue) {
    setText((current) => applyToText(current, issue));
    setResult(null);
  }

  function applyAll() {
    if (!result) return;
    setText(result.correctedText);
    setResult(null);
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setNote("");
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith(".txt") || file.type.startsWith("text/")) {
        const content = await file.text();
        setText(content.slice(0, 20_000));
        setResult(null);
        setNote(`${file.name} ochildi.`);
        return;
      }
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/extract-text", { method: "POST", body: form });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Fayl o‘qilmadi.");
      setText(data.text ?? "");
      setResult(null);
      setNote(`${file.name} ochildi.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fayl o‘qilmadi.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {CHECKER_SAMPLES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => {
              setText(sample.text);
              setResult(null);
              setError("");
              setNote("");
            }}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {sample.label}
          </button>
        ))}
      </div>

      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="O‘zbekcha matningizni shu yerga yozing yoki fayl yuklang..."
        className="min-h-60 text-[15px]"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={check} disabled={loading || !text.trim()}>
          {loading ? "Tahlil qilinmoqda..." : "Tekshirish"}
        </Button>
        <Button variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" />
          Fayl yuklash
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => {
            void onFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <p className="text-xs text-muted-foreground">.txt, .pdf, .docx</p>
      </div>

      {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : null}

      {result ? (
        <div className="space-y-6">
          {result.aiMessage ? (
            <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {result.aiMessage}
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-3">
            <IssueColumn
              title="Imlo"
              items={[...(grouped.spelling ?? []), ...(grouped.punctuation ?? [])]}
              onApply={applyIssue}
            />
            <IssueColumn title="Uslub" items={grouped.style ?? []} onApply={applyIssue} />
            <IssueColumn title="Tavsiyalar" items={grouped.foreign_word ?? []} onApply={applyIssue} />
          </div>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-semibold">Tuzatilgan matn</h2>
                <Button variant="outline" size="sm" onClick={applyAll} disabled={!result.correctedText}>
                  Hammasini qo‘llash
                </Button>
              </div>
              <p className="rounded-xl bg-muted/70 p-4 text-[15px] leading-7">{result.correctedText}</p>
              <p className="text-sm text-muted-foreground">
                {result.statistics.words} so‘z · {result.statistics.characters} belgi · {result.statistics.issues}{" "}
                tavsiya
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function IssueColumn({
  title,
  items,
  onApply,
}: {
  title: string;
  items: TextIssue[];
  onApply: (issue: TextIssue) => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Bu bo‘limda tavsiya yo‘q.</p>
        ) : (
          items.map((issue) => (
            <button
              key={issue.id}
              type="button"
              onClick={() => onApply(issue)}
              className="w-full rounded-xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-medium">{issue.original}</p>
                <Badge>{ISSUE_TYPE_LABELS[issue.type]}</Badge>
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">→</span> <strong>{issue.suggestion}</strong>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{issue.explanation}</p>
              <p className="mt-2 text-xs text-primary">Qo‘llash</p>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
}
