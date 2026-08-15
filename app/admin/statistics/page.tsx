import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default async function AdminStatisticsPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/");
  const stats = await getStore().getStats();
  return (
    <PageShell title="Statistika">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Tekshiruvlar", stats.textChecks],
          ["Transliteratsiyalar", stats.transliterations],
          ["Ishtirokchilar", stats.contributors],
          ["Matn hissalari", stats.textSamples],
          ["Foydalanuvchilar", stats.totalUsers],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold tracking-tight">{formatNumber(Number(value))}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
