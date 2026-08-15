# TilLab TECHNICAL SPEC

TilLab — o‘zbek tili uchun raqamli laboratoriya. MVP maqsadi: mahsulot real ishlashi, aniq til muammosini yechishi va kelajakdagi Uzbek NLP infratuzilmasiga aylanishi mumkinligini ko‘rsatish.

## P0 modules

1. Lotin-kirill transliterator (`/transliterator`)
2. Matn tahlili (`/checker`)
3. Muqobil so‘zlar (`/alternatives`)
4. Ma’lumotlar banki (`/contribute`, `/dataset`)
5. Shaxsiy kabinet va admin (`/profile`, `/admin`)

## Product principles

- O‘zbek tili markazda, AI vosita.
- Jazolovchi emas: “Quyidagi variant tabiiyroq bo‘lishi mumkin.”
- Statistika soxta emas. Data yo‘q bo‘lsa `0`.
- Contribution public datasetga avtomatik chiqmaydi.

## Transliteration

Context-aware, not naive character replace. Apostrophes `' ‘ ’ ʻ ʼ \`` normalize internally to `'`. Output uses `o‘` / `g‘`.

## Checker

Layer 1: local rule engine (`data/checker-rules.json`) with suffix-aware matching.
Layer 2: optional `LanguageAIProvider` (`gemini` | `openai` | `groq`) via `AI_PROVIDER` + `AI_API_KEY`.
If AI fails, rule engine continues and the UI shows a graceful message.

## Privacy

Text contributions run a basic PII detector (email, phone, card, passport-like tokens).

## Auth

Email/password session cookies. First registered user becomes admin unless `ADMIN_EMAIL` is set. Contribution, profile, and community suggestions require login.
