import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default async function AdminStatisticsPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/");
  const stats = await getStore().getStats();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Statistika</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          ["Tekshiruvlar", stats.textChecks],
          ["Transliteratsiyalar", stats.transliterations],
          ["Ishtirokchilar", stats.contributors],
          ["Matn hissalari", stats.textSamples],
          ["Audio hissalari", stats.audioSamples],
          ["Foydalanuvchilar", stats.totalUsers],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold">{formatNumber(Number(value))}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
