import { AlternativesSearch } from "@/components/alternatives/search";
import { getSession } from "@/lib/auth/session";
import { getStore, seededAlternatives } from "@/lib/store";

export default async function AlternativesPage() {
  const user = await getSession();
  const extra = await getStore().listApprovedAlternatives();
  const items = [...seededAlternatives(), ...extra];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">O‘zbekcha muqobil so‘zlar</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Begona yoki ortiqcha ishlatiladigan so‘zlar uchun adabiy o‘zbekcha variantlarni qidiring.
      </p>
      <div className="mt-8">
        <AlternativesSearch initialItems={items} signedIn={Boolean(user)} />
      </div>
    </div>
  );
}
