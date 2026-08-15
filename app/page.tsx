import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    title: "Lotin ↔ Kirill",
    text: "O‘zbek yozuvlarini kontekstga qarab, o‘ va g‘ harflari bilan o‘girish.",
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

export default async function HomePage() {
  const stats = await getStore().getStats();

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
        <p className="mb-5 text-[13px] font-medium tracking-[0.16em] text-primary uppercase">Til infratuzilmasi</p>
        <h1 className="max-w-3xl text-[2.35rem] leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl">
          O‘zbek tili uchun raqamli laboratoriya
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-[17px]">
          Matnni tekshiring, yozuvni o‘giring, muqobil toping. Sun’iy intellekt vosita — markazda o‘zbek tili turadi.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/checker">
            <Button size="lg">Matnni tekshirish</Button>
          </Link>
          <Link href="/contribute">
            <Button size="lg" variant="outline">
              Hissa qo‘shish
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-px border-y border-border bg-border px-0 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-background px-5 py-8 transition-colors hover:bg-white sm:px-6"
          >
            <p className="text-[12px] tracking-widest text-muted-foreground">{item.index}</p>
            <h2 className="mt-4 font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {[
          { label: "tekshirilgan matn", value: stats.textChecks },
          { label: "til namunasi", value: stats.textSamples },
          { label: "o‘girilgan matn", value: stats.transliterations },
          { label: "foydalanuvchi hissasi", value: stats.approvedContributions },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-3xl font-semibold tracking-tight">{formatNumber(item.value)}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
