import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { getStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default async function DatasetPage() {
  const stats = await getStore().getStats();

  return (
    <PageShell
      wide
      title="O‘zbek tili ma’lumotlar banki"
      description="Faqat tasdiqlangan hissalar va haqiqiy tekshiruvlar asosidagi statistika. Xom ma’lumotlar ochiq yuklab olinmaydi."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Matn namunasi", value: stats.textSamples },
          { label: "Tekshiruvlar", value: stats.textChecks },
          { label: "Jami so‘z", value: stats.totalWords },
          { label: "Ishtirokchilar", value: stats.contributors },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-3xl font-semibold tracking-tight">{formatNumber(item.value)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="text-lg font-semibold">Eng ko‘p tuzatilgan juftliklar</h2>
        <p className="mt-1 text-sm text-muted-foreground">Haqiqiy tekshiruvlardan yig‘iladi. Hozircha sun’iy raqam yo‘q.</p>
        {stats.topCorrections.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">Hali tuzatma qayd etilmagan.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Asl</th>
                  <th className="px-4 py-3 font-medium">Tavsiya</th>
                  <th className="px-4 py-3 font-medium">Marta</th>
                </tr>
              </thead>
              <tbody>
                {stats.topCorrections.map((item) => (
                  <tr key={`${item.original}|${item.suggestion}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{item.original}</td>
                    <td className="px-4 py-3 font-medium">{item.suggestion}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatNumber(item.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-14">
        <h2 className="mb-4 text-lg font-semibold">Turkumlari</h2>
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
      </div>
    </PageShell>
  );
}
