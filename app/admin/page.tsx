import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default async function AdminPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/");
  const stats = await getStore().getStats();

  return (
    <PageShell title="Admin panel" wide>
      <div className="-mt-4 mb-8 flex flex-wrap gap-5 text-sm">
        <Link href="/admin/contributions" className="text-primary">
          Hissalar
        </Link>
        <Link href="/admin/users">Foydalanuvchilar</Link>
        <Link href="/admin/statistics">Statistika</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Foydalanuvchilar", value: stats.totalUsers },
          { label: "Kutilayotgan hissalar", value: stats.pendingContributions },
          { label: "Tasdiqlangan hissalar", value: stats.approvedContributions },
          { label: "Yig‘ilgan so‘zlar", value: stats.totalWords },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold tracking-tight">{formatNumber(item.value)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
