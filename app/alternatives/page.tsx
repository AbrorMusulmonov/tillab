import { AlternativesSearch } from "@/components/alternatives/search";
import { PageShell } from "@/components/layout/page-shell";
import { getSession } from "@/lib/auth/session";
import { getStore, seededAlternatives } from "@/lib/store";

export default async function AlternativesPage() {
  const user = await getSession();
  const extra = await getStore().listApprovedAlternatives();
  const items = [...seededAlternatives(), ...extra];
  return (
    <PageShell
      title="O‘zbekcha muqobil so‘zlar"
      description="Begona yoki ortiqcha ishlatiladigan so‘zlar uchun adabiy o‘zbekcha variantlarni qidiring."
    >
      <AlternativesSearch initialItems={items} signedIn={Boolean(user)} />
    </PageShell>
  );
}
