import Link from "next/link";

const ITEMS = [
  "2026 · Yangi lotin alifbosi",
  "oʻ → ö · gʻ → ğ · sh → ş · ch → ç",
  "Matn va Word fayllarni bir zumda o‘giring",
  "Brauzerda ishlaydi — matn serverga yuborilmaydi",
  "Hozir yangi alifboda yozishni boshlang",
];

export function AlphabetBanner() {
  const line = ITEMS.join("  ·  ");

  return (
    <Link
      href="/transliterator"
      className="group relative z-50 block overflow-hidden bg-primary text-primary-foreground"
      aria-label="Yangi lotin alifbosiga o‘tish — yozuv o‘girish sahifasiga o‘ting"
    >
      <div className="flex h-9 items-center sm:h-10">
        <div className="banner-marquee flex w-max items-center whitespace-nowrap text-[12px] font-medium tracking-wide sm:text-[13px]">
          <span className="px-4">{line}</span>
          <span className="px-4" aria-hidden="true">
            {line}
          </span>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-primary via-primary to-transparent pl-10 pr-3 text-[11px] font-semibold tracking-wide sm:pr-5 sm:text-[12px]">
        O‘girish →
      </span>
    </Link>
  );
}
