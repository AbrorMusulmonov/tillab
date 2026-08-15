import { getStore, seededAlternatives } from "@/lib/store";
import { alternativesQuerySchema } from "@/lib/validations";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = alternativesQuerySchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
  });
  if (!parsed.success) {
    return Response.json({ error: "Noto‘g‘ri so‘rov." }, { status: 400 });
  }
  const extra = await getStore().listApprovedAlternatives();
  const query = parsed.data.q?.trim().toLowerCase() ?? "";
  const category = parsed.data.category;
  const items = [...seededAlternatives(), ...extra].filter((item) => {
    const categoryOk = !category || item.category === category;
    if (!categoryOk) return false;
    if (!query) return true;
    return (
      item.foreignWord.toLowerCase().includes(query) ||
      item.alternatives.some((alt) => alt.toLowerCase().includes(query))
    );
  });
  return Response.json({ items });
}
