import { redirect } from "next/navigation";
import { TextContributionForm } from "@/components/contribution/text-form";
import { getSession } from "@/lib/auth/session";

export default async function ContributeTextPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/contribute/text");
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Matn qo‘shish</h1>
      <p className="mt-2 text-muted-foreground">
        Shaxsiy ma’lumotlarsiz, o‘zingiz yozgan yoki ulashishga haqli bo‘lgan matnni yuboring.
      </p>
      <div className="mt-8">
        <TextContributionForm />
      </div>
    </div>
  );
}
