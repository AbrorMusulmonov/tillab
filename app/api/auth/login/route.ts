import { createSession, verifyPassword } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { authSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const parsed = authSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Noto‘g‘ri so‘rov." }, { status: 400 });
  }
  const user = await getStore().findUserByEmail(parsed.data.email);
  if (!user?.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return Response.json({ error: "Email yoki parol noto‘g‘ri." }, { status: 401 });
  }
  await createSession(user);
  return Response.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
