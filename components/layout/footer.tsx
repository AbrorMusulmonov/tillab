import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>TilLab — o‘zbek tili uchun raqamli laboratoriya.</p>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-foreground">
            Biz haqimizda
          </Link>
          <Link href="/dataset" className="hover:text-foreground">
            Ma’lumotlar banki
          </Link>
          <Link href="/contribute" className="hover:text-foreground">
            Hissa qo‘shish
          </Link>
        </div>
      </div>
    </footer>
  );
}
