import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>TilLab — o‘zbek tili uchun raqamli laboratoriya.</p>
        <div className="flex gap-4">
          <Link href="/about">Biz haqimizda</Link>
          <Link href="/dataset">Ma’lumotlar banki</Link>
          <Link href="/contribute">Hissa qo‘shish</Link>
        </div>
      </div>
    </footer>
  );
}
