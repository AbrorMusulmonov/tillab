import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/");
  const users = await getStore().listUsers();
  return (
    <PageShell title="Foydalanuvchilar">
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Ism</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Sana</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.role}</td>
                <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
