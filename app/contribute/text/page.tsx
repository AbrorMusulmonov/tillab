import { redirect } from "next/navigation";
import { TextContributionForm } from "@/components/contribution/text-form";
import { PageShell } from "@/components/layout/page-shell";
import { getSession } from "@/lib/auth/session";

export default async function ContributeTextPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/contribute/text");
  return (
    <PageShell
      title="Matn qo‘shish"
      description="Shaxsiy ma’lumotlarsiz, o‘zingiz yozgan yoki ulashishga haqli bo‘lgan matnni yuboring."
      className="max-w-3xl"
    >
      <TextContributionForm />
    </PageShell>
  );
}
