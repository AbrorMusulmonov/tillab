import { CheckerEditor } from "@/components/checker/checker-editor";

export default function CheckerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">O‘zbekcha matn tahlili</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Matningizdagi begona so‘zlar va imlo noaniqliklari uchun tabiiyroq variantlar taklif qilinadi.
      </p>
      <div className="mt-8">
        <CheckerEditor />
      </div>
    </div>
  );
}
