import { CheckerEditor } from "@/components/checker/checker-editor";
import { PageShell } from "@/components/layout/page-shell";

export default function CheckerPage() {
  return (
    <PageShell
      title="O‘zbekcha matn tahlili"
      description="Imlo, uslub va begona so‘zlar uchun tabiiyroq variantlar. Kirill matn avval lotinga o‘giriladi. Tavsiyani bosib, matnga qo‘llashingiz mumkin."
    >
      <CheckerEditor />
    </PageShell>
  );
}
