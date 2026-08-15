import { TransliteratorTool } from "@/components/transliterator/transliterator-tool";

export default function TransliteratorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Lotin ↔ Kirill</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        O‘zbek lotin va kirill yozuvlarini kontekstga qarab, o‘, g‘, sh, ch kabi harflarni to‘g‘ri hisobga olib o‘giradi.
      </p>
      <div className="mt-8">
        <TransliteratorTool />
      </div>
    </div>
  );
}
