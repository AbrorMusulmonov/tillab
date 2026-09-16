import Link from "next/link";
import { BrandLockup } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-white/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-[1.4fr_1fr] sm:px-6">
        <div>
          <Link href="/" className="inline-flex">
            <BrandLockup />
          </Link>
          <p className="mt-2 max-w-sm text-[13px] leading-6 text-muted-foreground">
            O‘zbek tili uchun raqamli laboratoriya. Matn, yozuv va ma’lumotlar banki bir joyda.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
          <Link href="/checker" className="transition-colors hover:text-foreground">
            Tekshiruvchi
          </Link>
          <Link href="/transliterator" className="transition-colors hover:text-foreground">
            Yozuv o‘girish
          </Link>
          <Link href="/alternatives" className="transition-colors hover:text-foreground">
            Muqobillar
          </Link>
          <Link href="/dataset" className="transition-colors hover:text-foreground">
            Ma’lumotlar banki
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            Biz haqimizda
          </Link>
        </div>
      </div>
    </footer>
  );
}
