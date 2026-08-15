import Link from "next/link";
import { FileText, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">O‘zbek tilining raqamli kelajagiga hissa qo‘shing</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Har bir matn va ovoz namunasi kelajakdagi o‘zbekcha texnologiyalar uchun sifatli ma’lumot yaratadi.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/contribute/text">
          <Card className="h-full hover:shadow-md">
            <CardContent className="space-y-3 pt-6">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Matn qo‘shish</h2>
              <p className="text-sm text-muted-foreground">O‘zbekcha matn namunasini yozing yoki joylashtiring.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/contribute/audio">
          <Card className="h-full hover:shadow-md">
            <CardContent className="space-y-3 pt-6">
              <Mic className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Audio qo‘shish</h2>
              <p className="text-sm text-muted-foreground">Berilgan gapni o‘qing yoki audio fayl yuklang.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
