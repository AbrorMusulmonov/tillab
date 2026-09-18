import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default function AboutPage() {
  return (
    <PageShell
      title="Biz haqimizda"
      description="TilLab — o‘zbek tili uchun raqamli laboratoriya. Matn, yozuv va ma’lumotlar banki bir joyda."
    >
      <div className="max-w-2xl space-y-5 text-[15px] leading-8 text-muted-foreground">
        <p>
          TilLab o‘zbek tilidagi matn ma’lumotlarini yaxshilash, tizimlashtirish va ko‘paytirishga xizmat qiluvchi
          raqamli til infratuzilmasi. Bu oddiy “AI text corrector” emas — sun’iy intellekt vosita, markazda o‘zbek tili
          turadi.
        </p>
        <p>
          Raqamli tizimlarning ko‘pchiligi o‘zbek tilida yetarlicha sifatli ishlamaydi: imlo yordami zaif, lotin–kirill
          o‘girish noaniq, begona so‘zlar uchun tabiiy muqobillar tarqoq. 2026-yilgi yangi lotin alifbosi (ö, ğ, ş, ç)
          esa millionlab hujjatni yangilashni talab qiladi. TilLab shu bo‘shliqni yopadi.
        </p>
        <p>
          Platforma jazolovchi emas, yordam beruvchi: “Siz noto‘g‘ri yozdingiz” o‘rniga “Quyidagi variant tabiiyroq
          bo‘lishi mumkin” deydi. Matnni tekshirasiz, yozuvni o‘girasiz, muqobil topasiz va rozilik asosida til
          namunalarini qo‘shasiz.
        </p>
        <p>
          Yozuv o‘girish to‘liq brauzerda ishlaydi — matn serverga yuborilmaydi. Mexanizm ochiq kodli{" "}
          <a href="https://github.com/azakapro/alifbo" className="text-foreground underline underline-offset-2">
            alifbo
          </a>{" "}
          kutubxonasiga asoslangan (MIT). Kirill, amaldagi lotin va yangi lotin o‘rtasida o‘giradi; Word fayldagi
          formatlash saqlanadi.
        </p>
        <p>
          Jonli sayt:{" "}
          <a href="https://tillabuz.vercel.app" className="text-foreground underline underline-offset-2">
            tillabuz.vercel.app
          </a>
          . Kod ochiq:{" "}
          <a
            href="https://github.com/AbrorMusulmonov/tillab"
            className="text-foreground underline underline-offset-2"
          >
            github.com/AbrorMusulmonov/tillab
          </a>
          .
        </p>
        <p>
          Yangi alifboda yozishni hozir sinab ko‘ring:{" "}
          <Link href="/transliterator" className="font-medium text-primary underline underline-offset-2">
            Yozuvni o‘girish →
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
