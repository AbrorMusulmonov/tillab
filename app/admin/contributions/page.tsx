import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { ModerationTable } from "@/components/layout/moderation-table";

export default async function AdminContributionsPage() {
  const user = await getSession();
  if (!user || user.role !== "admin") redirect("/");
  const store = getStore();
  const [texts, suggestions, users] = await Promise.all([
    store.listTextContributions(),
    store.listAlternativeSuggestions(),
    store.listUsers(),
  ]);
  const names = Object.fromEntries(users.map((item) => [item.id, item.name]));

  return (
    <PageShell title="Hissalarni tekshirish" wide>
      <ModerationTable texts={texts} suggestions={suggestions} names={names} />
    </PageShell>
  );
}
