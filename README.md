<p align="center">
  <img src="public/logo.png" alt="TilLab" width="88" />
</p>

<h1 align="center">TilLab</h1>

<p align="center">
  <b>O‘zbek tili uchun raqamli laboratoriya</b><br />
  Matnni tekshiring · yozuvni o‘giring · muqobil toping<br />
  Markazda o‘zbek tili turadi — sun’iy intellekt vosita.
</p>

<p align="center">
  <a href="https://tillabuz.vercel.app"><b>tillabuz.vercel.app</b></a>
  ·
  <a href="https://github.com/AbrorMusulmonov/tillab">GitHub</a>
</p>

---

## Nima uchun TilLab?

Raqamli tizimlarning ko‘pchiligi o‘zbek tilida yetarlicha sifatli ishlamaydi: imlo yordami zaif, lotin–kirill o‘girish noaniq, begona so‘zlar uchun tabiiy muqobillar tarqoq, ochiq sifatli til ma’lumotlari esa kam.

**2026-yilgi yangi lotin alifbosi** (`ö`, `ğ`, `ş`, `ç`) esa millionlab matn va hujjatni yangilashni talab qiladi. TilLab shu o‘tishni soddalashtiradi va ayni paytda o‘zbek tili ma’lumotlar bankini boyitadi.

Bu oddiy “AI text corrector” emas. Platforma jazolovchi emas, yordam beruvchi.

## Imkoniyatlar

| Bo‘lim | Nima qiladi |
| --- | --- |
| **Tekshiruvchi** | Imlo, uslub va begona so‘zlar tahlili; tavsiyani bir klikda qo‘llash; `.txt` / `.pdf` / `.docx`; kirill → lotin; `Ctrl + Enter` |
| **Yozuv o‘girish** | Kirill ⇄ amaldagi lotin ⇄ yangi lotin (`ö`, `ğ`, `ş`, `ç`); avtomatik aniqlash; Word formatlashini saqlash; brauzerda (serverga yuborilmaydi) |
| **Muqobillar** | Begona so‘zlar uchun adabiy o‘zbekcha muqobillar va jamoa takliflari |
| **Ma’lumotlar banki** | Rozilik asosida matn namunalari; faqat tasdiqlangan hissalar statistikada |
| **Admin** | Hissalarni tasdiqlash yoki rad etish |

Bosh sahifada **jonli o‘girish** oynasi bor — yozasiz, darhol yangi lotinga o‘giriladi.

## Tezkor boshlash

```bash
npm install
cp .env.example .env.local
npm test
npm run dev
```

Brauzer: [http://localhost:3000](http://localhost:3000)

Birinchi ro‘yxatdan o‘tgan foydalanuvchi admin bo‘ladi (yoki `ADMIN_EMAIL` mos kelsa).

## Muhit o‘zgaruvchilari

| Kalit | Tavsif |
| --- | --- |
| `SESSION_SECRET` | Cookie sessiyasi uchun maxfiy kalit |
| `ADMIN_EMAIL` | Shu email bilan ro‘yxatdan o‘tgan foydalanuvchi admin bo‘ladi |
| `AI_PROVIDER` | `groq`, `gemini` yoki `openai` |
| `AI_API_KEY` | Tanlangan provider kaliti |
| `AI_MODEL` | Ixtiyoriy (default: `openai/gpt-oss-120b` Groq uchun) |

AI kaliti bo‘lmasa ham qoida asosidagi tekshiruv ishlaydi. Statistika soxta emas — ma’lumot bo‘lmasa `0`.

## Arxitektura

```text
Browser (Next.js App Router)
  → jonli o‘girish: alifbo engine (client-side, MIT)
  → /api/* → qoidalar + ixtiyoriy AI (Groq / Gemini / OpenAI)
  → mahalliy JSON store (MVP) yoki Supabase
```

## Texnologiyalar

Next.js 16 · TypeScript · Tailwind CSS 4 · [alifbo](https://github.com/azakapro/alifbo) (MIT) · Zod · Vitest · Groq

## Yo‘l xaritasi

- **Phase 2:** Chrome kengaytmasi, Telegram bot
- **Phase 3:** ochiq dataset va dasturchilar API
- **Phase 4:** o‘zbekcha benchmark / LLM evaluation
- **Phase 5:** universitet va media hamkorligi

## Litsenziya

Yozuv o‘girish mexanizmi [alifbo](https://github.com/azakapro/alifbo) asosida (MIT). Qarang: `lib/transliteration/ALIFBO-NOTICE.txt`.
