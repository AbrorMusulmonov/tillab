export const SITE_NAME = "TilLab";
export const SITE_TITLE = "TilLab - O‘zbek tili uchun raqamli laboratoriya";
export const SITE_DESCRIPTION =
  "O‘zbekcha matnlarni tekshiring, lotin va kirill yozuvlarini o‘giring va o‘zbek tilining raqamli rivojiga hissa qo‘shing.";

export const NAV_LINKS = [
  { href: "/checker", label: "Tekshiruvchi" },
  { href: "/transliterator", label: "Transliterator" },
  { href: "/alternatives", label: "Muqobillar" },
  { href: "/dataset", label: "Ma’lumotlar banki" },
  { href: "/about", label: "Biz haqimizda" },
] as const;

export const TEXT_CATEGORIES = [
  "Ta’lim",
  "Texnologiya",
  "Madaniyat",
  "Kundalik hayot",
  "Tarix",
  "Ilm",
  "Biznes",
  "Boshqa",
] as const;

export const TEXT_TYPES = [
  "Oddiy matn",
  "Dialog",
  "Hikoya",
  "Izoh",
  "Savol-javob",
] as const;

export const WORD_CATEGORIES = [
  "Texnologiya",
  "Ta’lim",
  "Biznes",
  "Davlat boshqaruvi",
  "Kundalik hayot",
  "Ilm-fan",
  "Internet",
] as const;

export const REGIONS = [
  "Toshkent",
  "Andijon",
  "Buxoro",
  "Farg‘ona",
  "Jizzax",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Qoraqalpog‘iston",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
  "Xorazm",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "Tekshirilmoqda",
  approved: "Tasdiqlangan",
  rejected: "Rad etilgan",
};

export const ISSUE_TYPE_LABELS: Record<string, string> = {
  spelling: "Imlo",
  style: "Uslub",
  foreign_word: "Begona so‘z",
  punctuation: "Tinish belgilari",
};
