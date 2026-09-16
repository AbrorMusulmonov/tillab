"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/layout/logo";
import { NAV_LINKS } from "@/lib/constants";
import type { SessionUser } from "@/types";
import { cn } from "@/lib/utils";

export function Header({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex items-center">
          <BrandLockup priority />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Asosiy menyu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
                pathname === link.href && "bg-muted font-medium text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <Link href="/profile" className="text-[13px] font-medium">
              {user.name}
            </Link>
          ) : (
            <Link href="/login" className="text-[13px] text-muted-foreground hover:text-foreground">
              Kirish
            </Link>
          )}
          <Link
            href="/contribute"
            className="inline-flex h-8 items-center rounded-full bg-primary px-3.5 text-[13px] font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] hover:bg-[#0d6b64]"
          >
            Hissa qo‘shish
          </Link>
        </div>
        <button
          className="lg:hidden"
          aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border bg-white/90 px-5 py-5 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-2 text-sm" aria-label="Mobil menyu">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-1">
                {link.label}
              </Link>
            ))}
            <Link href="/contribute" onClick={() => setOpen(false)}>
              Hissa qo‘shish
            </Link>
            <Link href={user ? "/profile" : "/login"} onClick={() => setOpen(false)}>
              {user ? "Profil" : "Kirish"}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
