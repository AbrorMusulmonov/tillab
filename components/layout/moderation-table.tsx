"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { AlternativeSuggestion, TextContribution } from "@/types";

export function ModerationTable({
  texts,
  suggestions,
  names,
}: {
  texts: TextContribution[];
  suggestions: AlternativeSuggestion[];
  names: Record<string, string>;
}) {
  const router = useRouter();

  async function patch(kind: "text" | "suggestion", id: string, status: "approved" | "rejected") {
    await fetch(`/api/admin/contributions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, status }),
    });
    router.refresh();
  }

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="mb-3 text-xl font-semibold">Matnlar</h2>
        <div className="space-y-3">
          {texts.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-white p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{names[item.userId] || "Foydalanuvchi"}</p>
                <Badge>{STATUS_LABELS[item.status]}</Badge>
              </div>
              <p className="text-sm leading-6">{item.text}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {item.category} · {item.region} · {formatDate(item.createdAt)}
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => void patch("text", item.id, "approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => void patch("text", item.id, "rejected")}>
                  Reject
                </Button>
              </div>
            </article>
          ))}
          {texts.length === 0 ? <p className="text-sm text-muted-foreground">Matn yo‘q.</p> : null}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Muqobil takliflar</h2>
        <div className="space-y-3">
          {suggestions.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-white p-4">
              <p>
                <strong>{item.word}</strong> → {item.alternative}
              </p>
              <p className="text-sm text-muted-foreground">{item.explanation}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => void patch("suggestion", item.id, "approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => void patch("suggestion", item.id, "rejected")}>
                  Reject
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
