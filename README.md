# TilLab

**O‘zbek tilini raqamli kelajak uchun boyitamiz.**

TilLab — o‘zbek tilidagi matn va nutq ma’lumotlarini yaxshilash, tizimlashtirish va ko‘paytirishga xizmat qiluvchi raqamli til infratuzilmasi.

Bu mahsulot oddiygina “AI text corrector” emas. Sun’iy intellekt vosita; markazda o‘zbek tili turadi.

## Problem

Raqamli tizimlarning ko‘pchiligi o‘zbek tilida yetarlicha sifatli ishlamaydi: imlo yordami zaif, lotin-kirill o‘girish noaniq, begona so‘zlar uchun tabiiy muqobillar tarqoq, nutq va matn uchun ochiq sifatli ma’lumotlar esa kam.

## Solution

TilLab bitta platformada:

- o‘zbekcha matnni tekshiradi va tabiiyroq variantlar taklif qiladi;
- lotin va kirill yozuvlarini kontekstga qarab o‘giradi;
- begona so‘zlar uchun o‘zbekcha muqobillarni qidirish imkonini beradi;
- rozilik asosida matn namunalarini yig‘adi;
- faqat tasdiqlangan hissalar asosida haqiqiy statistikani ko‘rsatadi.

## Features

- **Tekshiruvchi** — qoida asosidagi tahlil, ixtiyoriy Gemini / OpenAI / Groq qatlami
- **Transliterator** — `o‘`, `g‘`, `sh`, `ch`, `ng`, `ya`, `yu`, `yo` uchun kontekstli qoidalar
- **Muqobillar** — 50+ so‘z, turkum filtri, jamoa takliflari
- **Hissa** — matn qo‘shish, PII filtri, rozilik
- **Ma’lumotlar banki** — tasdiqlangan namunalar statistikasi, xom dataset ochiq emas
- **Admin** — pending hissalarni tasdiqlash yoki rad etish

## Screenshots

Ishga tushirgach asosiy oqim:

1. Bosh sahifa
2. `Bu proyekt studentlarga yangi opportunity beradi.` → `Bu loyiha talabalarga yangi imkoniyat beradi.`
3. Lotin → Kirill
4. `registratsiya` → `ro‘yxatdan o‘tish`
5. Dataset statistikasi

## Architecture

```text
Browser (Next.js App Router)
  → Route Handlers (/api/*)
    → Rule engine / transliteration / PII
    → Optional LanguageAIProvider (Gemini | OpenAI | Groq)
    → Local JSON store (MVP) or Supabase PostgreSQL + Storage
```

Hissalar avtomatik ochiq datasetga chiqmaydi. Avval admin tekshiruvidan o‘tadi.

## Tech Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS
- Zod
- Vitest
- Supabase (ixtiyoriy: Auth, PostgreSQL, Storage)
- Gemini / Groq / OpenAI (ixtiyoriy)

## Installation

```bash
cd tillab
npm install
cp .env.example .env.local
npm test
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) ni oching.

Birinchi ro‘yxatdan o‘tgan foydalanuvchi admin bo‘ladi (yoki `ADMIN_EMAIL` mos kelsa).

## Environment Variables

| Key | Description |
| --- | --- |
| `SESSION_SECRET` | Cookie sessiyasi uchun maxfiy kalit |
| `ADMIN_EMAIL` | Shu email bilan ro‘yxatdan o‘tgan foydalanuvchi admin bo‘ladi |
| `AI_PROVIDER` | `gemini`, `openai` yoki `groq` |
| `AI_API_KEY` | Tanlangan provider kaliti |
| `AI_MODEL` | Ixtiyoriy model nomi |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase loyiha URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon kalit |

AI kaliti bo‘lmasa ham qoida asosidagi tekshiruv ishlaydi.

Supabase sozlanmasa, MVP mahalliy `data/.store.json` va `data/uploads/` orqali ishlaydi. Statistika hech qachon soxta emas: ma’lumot bo‘lmasa `0` ko‘rinadi.

## Roadmap

- **Phase 2:** Uzbek speech-to-text, dialekt aniqlash, TTS
- **Phase 3:** ochiq o‘zbek tili dataseti, dasturchilar API
- **Phase 4:** Uzbek benchmark va LLM evaluation
- **Phase 5:** universitet, media, davlat va AI kompaniyalari bilan hamkorlik

## Impact

Har bir tasdiqlangan matn va ovoz namunasi kelajakdagi o‘zbekcha nutq va til texnologiyalari uchun sifatli ma’lumot yaratadi.

## Author

TilLab MVP o‘zbek va boshqa kam resursli turkiy tillar uchun raqamli resurslar yetishmasligi muammosidan kelib chiqib yaratilgan.
