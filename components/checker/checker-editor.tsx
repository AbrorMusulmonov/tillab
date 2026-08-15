"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ISSUE_TYPE_LABELS } from "@/lib/constants";
import type { TextAnalysis, TextIssue } from "@/types";

const SAMPLE = "Bu proyekt studentlarga yangi opportunity beradi.";

export function CheckerEditor() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<TextAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="O‘zbekcha matningizni shu yerga yozing yoki joylashtiring..."
        className="min-h-56"
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={check} disabled={loading || !text.trim()}>
          {loading ? "Matn tahlil qilinmoqda..." : "Matnni tekshirish"}
        </Button>
        <Button variant="outline" onClick={() => setText(SAMPLE)}>
          Namuna matn
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : null}
      {result ? (
        <div className="space-y-6">
          {result.aiMessage ? (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{result.aiMessage}</p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-3">
            <IssueColumn title="Imlo" items={[...(grouped.spelling ?? []), ...(grouped.punctuation ?? [])]} />
            <IssueColumn title="Uslub" items={grouped.style ?? []} />
            <IssueColumn title="Tavsiyalar" items={grouped.foreign_word ?? []} />
          </div>
          <Card>
            <CardContent className="space-y-3 pt-6">
              <h2 className="text-lg font-semibold">Tuzatilgan matn</h2>
              <p className="rounded-xl bg-muted p-4 leading-7">{result.correctedText}</p>
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

function IssueColumn({ title, items }: { title: string; items: TextIssue[] }) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <h2 className="font-semibold">{title}</h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Bu bo‘limda tavsiya yo‘q.</p>
        ) : (
          items.map((issue) => (
            <div key={issue.id} className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-medium">{issue.original}</p>
                <Badge>{ISSUE_TYPE_LABELS[issue.type]}</Badge>
              </div>
              <p className="text-sm">
                Quyidagi variant tabiiyroq bo‘lishi mumkin: <strong>{issue.suggestion}</strong>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{issue.explanation}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
