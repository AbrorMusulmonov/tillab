import { PageShell } from "@/components/layout/page-shell";
import { TransliteratorTool } from "@/components/transliterator/transliterator-tool";

export default function TransliteratorPage() {
  return (
    <PageShell
      wide
      title="Yozuvni o‘girish"
      description="Kirill, amaldagi lotin va 2026-yilgi yangi lotin alifbolari o‘rtasida. Noaniq joylar alohida ko‘rsatiladi. Word hujjatdagi formatlash saqlanadi."
    >
      <TransliteratorTool />
    </PageShell>
  );
}
