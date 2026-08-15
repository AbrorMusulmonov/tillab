import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/");
  const users = await getStore().listUsers();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Foydalanuvchilar</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-3">Ism</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-3">{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
