"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/profile";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError("");
    const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as { error?: string };
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Amal bajarilmadi.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form
      className="mx-auto max-w-md space-y-5 px-5 py-16 sm:px-6"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div>
        <h1 className="text-[1.75rem] font-semibold tracking-tight">
          {mode === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login" ? "Hisobingizga kiring." : "TilLab’da ishlash uchun hisob oching."}
        </p>
      </div>
      {mode === "register" ? (
        <div>
          <Label htmlFor="name">Ism</Label>
          <Input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </div>
      ) : null}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Parol</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
          minLength={8}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Kutilmoqda..." : mode === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}
      </Button>
      <p className="text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Hisobingiz yo‘qmi?{" "}
            <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
              Ro‘yxatdan o‘ting
            </Link>
          </>
        ) : (
          <>
            Allaqachon hisobingiz bormi?{" "}
            <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
              Kiring
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
