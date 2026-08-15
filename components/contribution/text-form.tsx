"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { REGIONS, TEXT_CATEGORIES, TEXT_TYPES } from "@/lib/constants";

export function TextContributionForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    text: "",
    category: TEXT_CATEGORIES[0] as string,
    textType: TEXT_TYPES[0] as string,
    region: REGIONS[0] as string,
    consent: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contributions/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Yuborilmadi.");
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div>
        <Label htmlFor="text">Matn</Label>
        <Textarea
          id="text"
          value={form.text}
          onChange={(event) => setForm({ ...form, text: event.target.value })}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="category">Mavzu</Label>
          <Select
            id="category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {TEXT_CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="textType">Matn turi</Label>
          <Select
            id="textType"
            value={form.textType}
            onChange={(event) => setForm({ ...form, textType: event.target.value })}
          >
            {TEXT_TYPES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="region">Hudud</Label>
          <Select id="region" value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })}>
            {REGIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1"
          checked={form.consent}
          onChange={(event) => setForm({ ...form, consent: event.target.checked })}
        />
        <span>
          Ushbu matnni o‘zim yozganman yoki uni ulashishga huquqim bor. Ushbu ma’lumot anonimlashtirilgan holda o‘zbek
          tilini rivojlantirish va ilmiy tadqiqotlar uchun ishlatilishiga roziman.
        </span>
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={!form.consent || loading}>
        {loading ? "Yuborilmoqda..." : "Yuborish"}
      </Button>
    </form>
  );
}
