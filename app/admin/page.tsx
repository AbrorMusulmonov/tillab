import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default async function AdminPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/");
  const stats = await getStore().getStats();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Admin panel</h1>
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link href="/admin/contributions" className="text-primary">
          Hissalar
        </Link>
        <Link href="/admin/users">Foydalanuvchilar</Link>
        <Link href="/admin/statistics">Statistika</Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total users", value: stats.totalUsers },
          { label: "Pending contributions", value: stats.pendingContributions },
          { label: "Approved contributions", value: stats.approvedContributions },
          { label: "Words collected", value: stats.totalWords },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold">{formatNumber(item.value)}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
