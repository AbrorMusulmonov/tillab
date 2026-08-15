import { PageShell } from "@/components/layout/page-shell";
import { TransliteratorTool } from "@/components/transliterator/transliterator-tool";

export default function TransliteratorPage() {
  return (
    <PageShell
      wide
      title="Lotin ↔ Kirill"
      description="O‘zbek lotin va kirill yozuvlarini kontekstga qarab, o‘, g‘, sh, ch kabi harflarni to‘g‘ri hisobga olib o‘giradi."
    >
      <TransliteratorTool />
    </PageShell>
  );
}
