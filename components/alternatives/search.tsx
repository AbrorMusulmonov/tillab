"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WORD_CATEGORIES } from "@/lib/constants";
import type { AlternativeWord } from "@/types";

export function AlternativesSearch({
  initialItems,
  signedIn,
}: {
  initialItems: AlternativeWord[];
  signedIn: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ word: "", alternative: "", explanation: "", example: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryOk = category === "all" || item.category === category;
      if (!categoryOk) return false;
      if (!q) return true;
      return (
        item.foreignWord.toLowerCase().includes(q) ||
        item.alternatives.some((alt) => alt.toLowerCase().includes(q))
      );
    });
  }, [items, query, category]);

  async function searchRemote(value: string) {
    setQuery(value);
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    if (category !== "all") params.set("category", category);
    const response = await fetch(`/api/alternatives?${params.toString()}`);
    const data = (await response.json()) as { items: AlternativeWord[] };
    setItems(data.items);
  }

  async function submitSuggestion() {
    setError("");
    setMessage("");
    const response = await fetch("/api/alternatives/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Taklif yuborilmadi.");
      return;
    }
    setMessage("Taklifingiz yuborildi va tekshiruvga qo‘yildi.");
    setForm({ word: "", alternative: "", explanation: "", example: "" });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => void searchRemote(event.target.value)}
            placeholder="So‘z kiriting..."
            className="pl-10"
            aria-label="Muqobil so‘z qidirish"
          />
        </div>
        <Select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Turkum">
          <option value="all">Barcha turkumlar</option>
          {WORD_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        {signedIn ? (
          <Button onClick={() => setOpen((value) => !value)}>Muqobil taklif qilish</Button>
        ) : (
          <Button variant="outline" onClick={() => router.push("/login")}>
            Taklif uchun kiring
          </Button>
        )}
      </div>
      {message ? <p className="text-sm text-accent">{message}</p> : null}
      {open ? (
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Yangi muqobil taklif qilish</h2>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="word">Asl so‘z</Label>
              <Input id="word" value={form.word} onChange={(event) => setForm({ ...form, word: event.target.value })} />
            </div>
            <div>
              <Label htmlFor="alternative">Taklif qilingan muqobil</Label>
              <Input
                id="alternative"
                value={form.alternative}
                onChange={(event) => setForm({ ...form, alternative: event.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="explanation">Izoh</Label>
              <Input
                id="explanation"
                value={form.explanation}
                onChange={(event) => setForm({ ...form, explanation: event.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="example">Misol</Label>
              <Input
                id="example"
                value={form.example}
                onChange={(event) => setForm({ ...form, example: event.target.value })}
              />
            </div>
            {error ? <p className="text-sm text-destructive md:col-span-2">{error}</p> : null}
            <Button onClick={submitSuggestion}>Yuborish</Button>
          </CardContent>
        </Card>
      ) : null}
      <div className="grid gap-4">
        {filtered.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-3 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{item.foreignWord}</h2>
                <span className="text-sm text-muted-foreground">{item.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.alternatives.map((alt) => (
                  <span key={alt} className="rounded-full bg-teal-50 px-3 py-1 text-sm text-primary">
                    {alt}
                  </span>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Ma’nosi</p>
                  <p className="text-sm">{item.definition || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Misol</p>
                  <p className="text-sm">{item.examples?.[0] || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Qo‘llanish sohasi</p>
                  <p className="text-sm">{item.usage || item.category || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 ? <p className="text-muted-foreground">Mos so‘z topilmadi.</p> : null}
      </div>
    </div>
  );
}
