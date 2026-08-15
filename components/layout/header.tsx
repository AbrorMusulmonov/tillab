"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { SessionUser } from "@/types";
import { cn } from "@/lib/utils";

export function Header({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[#f6f7f6]/80 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[11px] font-semibold tracking-tight text-white">
            TL
          </span>
          <span className="text-[15px] font-semibold tracking-tight">TilLab</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Asosiy menyu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "font-medium text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/contribute"
            className="inline-flex h-9 items-center rounded-lg bg-primary px-3.5 text-[13px] font-medium text-white hover:bg-[#0d6b64]"
          >
            Hissa qo‘shish
          </Link>
          {user ? (
            <Link href="/profile" className="text-[13px] font-medium">
              {user.name}
            </Link>
          ) : (
            <Link href="/login" className="text-[13px] text-muted-foreground hover:text-foreground">
              Kirish
            </Link>
          )}
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
        <div className="border-t border-border bg-[#f6f7f6] px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-3 text-sm" aria-label="Mobil menyu">
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
