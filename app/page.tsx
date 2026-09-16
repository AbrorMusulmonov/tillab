import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { HeroPlayground } from "@/components/home/hero-playground";
import { getStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

const FEATURES = [
  {
    href: "/checker",
    index: "01",
    title: "Matn tahlili",
    text: "Imlo, uslub va begona so‘zlar uchun tabiiyroq o‘zbekcha variantlar.",
  },
  {
    href: "/transliterator",
    index: "02",
    title: "Yozuv o‘girish",
    text: "Kirill, amaldagi lotin va yangi lotin (ö, ğ, ş, ç) o‘rtasida.",
  },
  {
    href: "/alternatives",
    index: "03",
    title: "O‘zbekcha muqobil",
    text: "Ortiqcha ishlatiladigan so‘zlar uchun adabiy muqobillar.",
  },
  {
    href: "/contribute",
    index: "04",
    title: "Ma’lumotlar banki",
    text: "O‘zbekcha matn namunalarini ochiq til infratuzilmasiga qo‘shish.",
  },
];

const STEPS = [
  { index: "01", title: "Matnni yozing", text: "Gap, hujjat yoki kirill matn — hammasi joyida." },
  { index: "02", title: "TilLab ishlaydi", text: "Qoidalar va AI tabiiyroq variantlarni ko‘rsatadi." },
  { index: "03", title: "Bir klikda qo‘llaysiz", text: "Tavsiyani bosing yoki yangi alifboda yuklab oling." },
];

export default async function HomePage() {
  const stats = await getStore().getStats();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 inline-flex items-center rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-[12px] font-medium tracking-wide text-primary shadow-sm">
              Yangi alifbo · 2026
            </p>
            <h1 className="text-[2.6rem] leading-[1.08] font-semibold tracking-[-0.04em] text-balance sm:text-[3.4rem]">
              O‘zbek tili uchun raqamli laboratoriya
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-7 text-muted-foreground sm:text-[17px]">
              Matnni tekshiring, yozuvni o‘giring, muqobil toping. Sun’iy intellekt vosita — markazda o‘zbek tili turadi.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/checker" className={buttonVariants({ size: "lg" })}>
                Matnni tekshirish
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/transliterator" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Yozuvni o‘girish
              </Link>
            </div>
          </div>
          <HeroPlayground />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/80 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.index} className="bg-white/80 px-6 py-7">
              <p className="font-mono text-[11px] tracking-widest text-primary">{step.index}</p>
              <h2 className="mt-3 font-semibold tracking-tight">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-border/80 bg-white/70 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_16px_40px_-28px_rgba(15,118,110,0.45)]"
            >
              <p className="font-mono text-[11px] tracking-widest text-muted-foreground">{item.index}</p>
              <h2 className="mt-4 flex items-center justify-between gap-2 font-semibold tracking-tight">
                {item.title}
                <span className="text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true">
                  →
                </span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-6">
        <div className="grid gap-8 rounded-2xl border border-border/80 bg-white/60 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "tekshirilgan matn", value: stats.textChecks },
            { label: "til namunasi", value: stats.textSamples },
            { label: "o‘girilgan matn", value: stats.transliterations },
            { label: "foydalanuvchi hissasi", value: stats.approvedContributions },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-semibold tracking-[-0.04em]">{formatNumber(item.value)}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
