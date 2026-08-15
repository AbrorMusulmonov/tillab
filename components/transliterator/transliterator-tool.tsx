"use client";

import { useMemo, useState } from "react";
import { Copy, Eraser, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { TransliterateDirection } from "@/types";

export function TransliteratorTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [direction, setDirection] = useState<TransliterateDirection>("latin-to-cyrillic");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const labels = useMemo(
    () =>
      direction === "latin-to-cyrillic"
        ? { from: "Lotin", to: "Kirill" }
        : { from: "Kirill", to: "Lotin" },
    [direction],
  );

  async function convert() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/transliterate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: source, direction }),
      });
      const data = (await response.json()) as { result?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "O‘girish amalga oshmadi.");
      setResult(data.result ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={direction === "latin-to-cyrillic" ? "default" : "outline"}
          onClick={() => setDirection("latin-to-cyrillic")}
          aria-pressed={direction === "latin-to-cyrillic"}
        >
          Lotin → Kirill
        </Button>
        <Button
          variant={direction === "cyrillic-to-latin" ? "default" : "outline"}
          onClick={() => setDirection("cyrillic-to-latin")}
          aria-pressed={direction === "cyrillic-to-latin"}
        >
          Kirill → Lotin
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Kirish matni ({labels.from})</span>
          <Textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder="Matnni shu yerga yozing..."
            className="min-h-72"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Natija ({labels.to})</span>
          <Textarea value={result} readOnly className="min-h-72 bg-muted/50" />
        </label>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button onClick={convert} disabled={loading}>
          <Languages className="h-4 w-4" />
          {loading ? "O‘girilmoqda..." : "O‘girish"}
        </Button>
        <Button variant="outline" onClick={copyResult} disabled={!result} aria-label="Natijani nusxalash">
          <Copy className="h-4 w-4" />
          {copied ? "Nusxalandi" : "Nusxalash"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSource("");
            setResult("");
          }}
          aria-label="Maydonlarni tozalash"
        >
          <Eraser className="h-4 w-4" />
          Tozalash
        </Button>
      </div>
    </div>
  );
}
