"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { convertText } from "@/lib/transliteration/convert";
import { HighlightedLatin } from "@/components/transliterator/highlighted-latin";

const SAMPLE = "Oʻzbekiston. Shahar markazida choyxona bor.";

export function HeroPlayground() {
  const [ready, setReady] = useState(false);
  const [text, setText] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);
  useEffect(() => setReady(true), []);

  const result = useMemo(
    () => (ready ? convertText(text, "auto", "new-latin").text : "Özbekiston. Şahar markazida çoyxona bor."),
    [ready, text],
  );

  async function copyResult() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const fullHref = `/transliterator?q=${encodeURIComponent(text.slice(0, 1500))}`;

  return (
    <div className="mx-auto mt-14 max-w-3xl rounded-[22px] border border-white/80 bg-white/70 p-1.5 shadow-[0_30px_80px_-40px_rgba(15,118,110,0.45),0_8px_24px_-16px_rgba(15,23,42,0.18)]">
      <div className="overflow-hidden rounded-[16px] border border-border/70 bg-white">
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[11px] tracking-wide text-muted-foreground">jonli o‘girish</span>
          </div>
          <span className="text-[11px] text-muted-foreground">yozing — darhol o‘giriladi</span>
        </div>
        <div className="grid sm:grid-cols-2">
          <label className="border-b border-border/70 p-5 sm:border-r sm:border-b-0">
            <span className="mb-2 block text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Kirish
            </span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-h-24 w-full resize-none bg-transparent text-[15px] leading-7 outline-none"
              aria-label="O‘giriladigan matn"
            />
          </label>
          <div className="bg-[#f8fbfa] p-5">
            <p className="mb-2 text-[11px] font-medium tracking-wider text-primary uppercase">Yangi lotin</p>
            <p className="min-h-24 text-[15px] leading-7">
              <HighlightedLatin text={result || " "} />
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 px-4 py-2.5">
          <p className="text-[11px] text-muted-foreground">ö · ğ · ş · ç belgilangan</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void copyResult()}
              className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? "Nusxa olindi" : "Nusxa olish"}
            </button>
            <Link href={fullHref} className="text-[12px] font-medium text-primary hover:underline">
              To‘liq o‘girish →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
