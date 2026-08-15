import { NextRequest } from "next/server";
import { analyzeUzbekText } from "@/lib/language/checker";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/store";
import { checkTextSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const limit = session ? 30 : 10;
  if (!rateLimit(`${clientIp(request)}:check`, limit)) {
    return Response.json({ error: "Juda ko‘p so‘rov. Birozdan so‘ng urinib ko‘ring." }, { status: 429 });
  }

  const parsed = checkTextSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Noto‘g‘ri so‘rov." }, { status: 400 });
  }

  const result = await analyzeUzbekText(parsed.data.text);
  await getStore().incrementCheckCount(session?.id);
  return Response.json(result);
}
