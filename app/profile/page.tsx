import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { LogoutButton } from "@/components/layout/logout-button";

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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {user.role === "admin" ? (
            <a href="/admin" className="text-sm font-medium text-primary">
              Admin panel
            </a>
          ) : null}
          <LogoutButton />
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Contributions", value: history.length },
          { label: "Text samples", value: texts.length },
          { label: "Alternative suggestions", value: suggestions.length },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-3">Type</th>
              <th>Date</th>
              <th>Status</th>
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
    </div>
  );
}
