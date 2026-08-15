import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { contributionPatchSchema } from "@/lib/validations";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Ruxsat yo‘q." }, { status: 403 });
  }
  const { id } = await context.params;
  const parsed = contributionPatchSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: "Noto‘g‘ri so‘rov." }, { status: 400 });
  }
  const store = getStore();
  if (parsed.data.kind === "suggestion") {
    if (!parsed.data.status) return Response.json({ error: "Status kerak." }, { status: 400 });
    const item = await store.updateAlternativeSuggestion(id, parsed.data.status);
    return Response.json({ item });
  }
  const item = await store.updateContribution(parsed.data.kind, id, {
    status: parsed.data.status,
    category: parsed.data.category,
    region: parsed.data.region,
  });
  return Response.json({ item });
}
