import { getStore } from "@/lib/store";

export async function GET() {
  const stats = await getStore().getStats();
  return Response.json(stats);
}
