import { createSession, hashPassword } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { authSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const parsed = authSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Noto‘g‘ri so‘rov." }, { status: 400 });
  }
  if (!parsed.data.name) {
    return Response.json({ error: "Ism kiritilishi shart." }, { status: 400 });
  }
  try {
    const user = await getStore().createUser({
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash: await hashPassword(parsed.data.password),
    });
    await createSession(user);
    return Response.json({ user });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Ro‘yxatdan o‘tish amalga oshmadi." },
      { status: 400 },
    );
  }
}
