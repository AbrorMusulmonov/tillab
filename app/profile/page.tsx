import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { LogoutButton } from "@/components/layout/logout-button";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/profile");
  const store = getStore();
  const [texts, suggestions] = await Promise.all([
    store.listTextContributions({ userId: user.id }),
    store.listAlternativeSuggestions({ userId: user.id }),
  ]);
  const history = [
    ...texts.map((item) => ({ id: item.id, type: "Matn", date: item.createdAt, status: item.status })),
    ...suggestions.map((item) => ({ id: item.id, type: "Muqobil", date: item.createdAt, status: item.status })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <PageShell title={user.name} description={user.email} wide>
      <div className="-mt-6 mb-10 flex flex-wrap gap-2">
        {user.role === "admin" ? (
          <Link href="/admin" className="text-sm font-medium text-primary">
            Admin panel
          </Link>
        ) : null}
        <LogoutButton />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Hissalar", value: history.length },
          { label: "Matn namunasi", value: texts.length },
          { label: "Muqobil takliflar", value: suggestions.length },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-3 font-medium">Tur</th>
              <th className="font-medium">Sana</th>
              <th className="font-medium">Holat</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-3">{item.type}</td>
                <td>{formatDate(item.date)}</td>
                <td>
                  <Badge tone={item.status === "approved" ? "accent" : item.status === "rejected" ? "danger" : "warning"}>
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 ? <p className="mt-4 text-muted-foreground">Hali hissa qo‘shilmagan.</p> : null}
      </div>
    </PageShell>
  );
}
