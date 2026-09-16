<p align="center">
  <img src="public/logo.png" alt="TilLab" width="88" />
</p>

<h1 align="center">TilLab</h1>

<p align="center">
  <b>O‘zbek tili uchun raqamli laboratoriya</b><br />
  Matnni tekshiring, yozuvni o‘giring, muqobil toping — markazda o‘zbek tili turadi.
</p>

<p align="center">
  <a href="https://tillabuz.vercel.app">tillabuz.vercel.app</a>
</p>

---

TilLab — o‘zbek tilidagi matn ma’lumotlarini yaxshilash, tizimlashtirish va ko‘paytirishga xizmat qiluvchi til infratuzilmasi. Bu oddiy “AI text corrector” emas: sun’iy intellekt vosita, mahsulotning markazida o‘zbek tili turadi.

## Muammo

Raqamli tizimlarning ko‘pchiligi o‘zbek tilida yetarlicha sifatli ishlamaydi: imlo yordami zaif, lotin–kirill o‘girish noaniq, begona so‘zlar uchun tabiiy muqobillar tarqoq, ochiq sifatli til ma’lumotlari esa kam. 2026-yilgi yangi lotin alifbosi (ö, ğ, ş, ç) esa millionlab hujjatni yangilashni talab qiladi.

## Imkoniyatlar

| Bo‘lim | Nima qiladi |
| --- | --- |
| **Tekshiruvchi** | Imlo, uslub va begona so‘zlar tahlili; tavsiyani bir klikda qo‘llash; `.txt`, `.pdf`, `.docx` yuklash; kirill matn avval lotinga o‘giriladi; `Ctrl + Enter` |
| **Yozuv o‘girish** | Kirill ⇄ amaldagi lotin ⇄ yangi lotin (ö, ğ, ş, ç); alifboni avtomatik aniqlash; noaniq joylarni alohida ko‘rsatish; Word (`.docx`) faylni formatlashni saqlagan holda o‘girish |
| **Muqobillar** | Ortiqcha ishlatiladigan begona so‘zlar uchun adabiy o‘zbekcha muqobillar, jamoa takliflari |
| **Ma’lumotlar banki** | Rozilik asosida matn namunalari; faqat tasdiqlangan hissalar statistikada ko‘rinadi |
| **Admin** | Hissalarni tasdiqlash yoki rad etish |

Yozuv o‘girish to‘liq brauzerda ishlaydi — matn serverga yuborilmaydi. Bosh sahifadagi jonli o‘girish oynasida buni darhol sinab ko‘rish mumkin.

## Arxitektura

```text
Browser (Next.js App Router)
  → jonli o‘girish: alifbo engine (client-side, MIT)
  → Route Handlers (/api/*)
    → qoida mexanizmi / PII filtri
    → ixtiyoriy LanguageAIProvider (Groq | Gemini | OpenAI)
    → mahalliy JSON store (MVP) yoki Supabase PostgreSQL
```

Hissalar avtomatik ochiq datasetga chiqmaydi — avval admin tekshiruvidan o‘tadi. Statistika hech qachon soxta emas: ma’lumot bo‘lmasa `0` ko‘rinadi.

## Texnologiyalar

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS 4
- [alifbo](https://github.com/azakapro/alifbo) — yozuv o‘girish mexanizmi (MIT)
- Zod, Vitest
- Groq / Gemini / OpenAI (ixtiyoriy)
- Supabase (ixtiyoriy)

## Ishga tushirish

```bash
npm install
cp .env.example .env.local
npm test
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) ni oching. Birinchi ro‘yxatdan o‘tgan foydalanuvchi admin bo‘ladi (yoki `ADMIN_EMAIL` mos kelsa).

## Muhit o‘zgaruvchilari

| Kalit | Tavsif |
| --- | --- |
| `SESSION_SECRET` | Cookie sessiyasi uchun maxfiy kalit |
| `ADMIN_EMAIL` | Shu email bilan ro‘yxatdan o‘tgan foydalanuvchi admin bo‘ladi |
| `AI_PROVIDER` | `groq`, `gemini` yoki `openai` |
| `AI_API_KEY` | Tanlangan provider kaliti |
| `AI_MODEL` | Ixtiyoriy model nomi |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase loyiha URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon kalit |

AI kaliti bo‘lmasa ham qoida asosidagi tekshiruv to‘liq ishlaydi.

## Yo‘l xaritasi

- **Phase 2:** Chrome kengaytmasi, Telegram bot, o‘zbek speech-to-text
- **Phase 3:** ochiq o‘zbek tili dataseti, dasturchilar uchun API
- **Phase 4:** o‘zbekcha benchmark va LLM evaluation
- **Phase 5:** universitet, media va AI kompaniyalari bilan hamkorlik

## Litsenziya va minnatdorchilik

Yozuv o‘girish mexanizmi ochiq kodli [alifbo](https://github.com/azakapro/alifbo) kutubxonasiga asoslangan (MIT). Qarang: `lib/transliteration/ALIFBO-NOTICE.txt`.
