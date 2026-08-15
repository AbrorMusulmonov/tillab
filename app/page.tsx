import Link from "next/link";
import { Languages, Library, FileText, SpellCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default async function HomePage() {
  const stats = await getStore().getStats();

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <p className="mb-4 text-sm font-medium tracking-wide text-primary uppercase">TilLab</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          O‘zbek tili uchun raqamli laboratoriya
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Matningizni tekshiring, yozuvni o‘giring, o‘zbekcha muqobillarni toping va o‘zbek tilining raqamli rivojiga
          hissa qo‘shing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
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

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            href: "/checker",
            icon: SpellCheck,
            title: "Matn tahlili",
            text: "O‘zbekcha matndagi imlo va uslubiy muammolarni aniqlash.",
          },
          {
            href: "/transliterator",
            icon: Languages,
            title: "Lotin ↔ Kirill",
            text: "O‘zbek lotin va kirill yozuvlarini tez va to‘g‘ri o‘girish.",
          },
          {
            href: "/alternatives",
            icon: Library,
            title: "O‘zbekcha muqobil",
            text: "Begona yoki ortiqcha ishlatiladigan so‘zlar uchun o‘zbekcha variantlar.",
          },
          {
            href: "/contribute",
            icon: FileText,
            title: "Til ma’lumotlar banki",
            text: "O‘zbekcha matn namunalarini to‘plash.",
          },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-3 pt-6">
                <item.icon className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "tekshirilgan matn", value: stats.textChecks },
            { label: "til namunasi", value: stats.textSamples },
            { label: "o‘girilgan matn", value: stats.transliterations },
            { label: "foydalanuvchi hissasi", value: stats.approvedContributions },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-semibold">{formatNumber(item.value)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
