import { Card, CardContent } from "@/components/ui/card";
import { getStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default async function DatasetPage() {
  const stats = await getStore().getStats();
  const categories = Object.entries(stats.categories);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">O‘zbek tili ma’lumotlar banki</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Bu yerda faqat tasdiqlangan hissalar asosidagi umumiy statistikalar ko‘rsatiladi. Xom ma’lumotlar ochiq
        yuklab olinmaydi.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Text Samples", value: stats.textSamples },
          { label: "Text Checks", value: stats.textChecks },
          { label: "Total Words", value: stats.totalWords },
          { label: "Contributors", value: stats.contributors },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-3xl font-semibold">{formatNumber(item.value)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Turkumlari</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Ta’lim", "Texnologiya", "Kundalik hayot", "Madaniyat", "Biznes", "Boshqa"].map((name) => (
            <Card key={name}>
              <CardContent className="flex items-center justify-between pt-6">
                <span>{name}</span>
                <span className="font-medium">{formatNumber(stats.categories[name] ?? 0)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        {categories.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Hozircha tasdiqlangan namunalar yo‘q.</p>
        ) : null}
      </div>
    </div>
  );
}
