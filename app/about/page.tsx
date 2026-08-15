import { PageShell } from "@/components/layout/page-shell";

export default function AboutPage() {
  return (
    <PageShell title="Biz haqimizda">
      <div className="max-w-2xl space-y-5 text-[15px] leading-8 text-muted-foreground">
        <p>
          TilLab — o‘zbek tilidagi matn ma’lumotlarini yaxshilash, tizimlashtirish va ko‘paytirishga xizmat
          qiluvchi raqamli til infratuzilmasi.
        </p>
        <p>
          Raqamli tizimlarning ko‘pchiligi o‘zbek tilida yetarlicha sifatli ishlamaydi. TilLab shu bo‘shliqni yopish
          uchun yaratilgan: foydalanuvchiga yozishda yordam beradi va ayni paytda o‘zbek tili ma’lumotlar bankini
          boyitadi.
        </p>
        <p>
          Sun’iy intellekt bu yerda vosita. Mahsulotning markazida o‘zbek tili turadi. Platforma jazolovchi emas,
          yordam beruvchi: “Siz noto‘g‘ri yozdingiz” o‘rniga “Quyidagi variant tabiiyroq bo‘lishi mumkin” deydi.
        </p>
      </div>
    </PageShell>
  );
}
