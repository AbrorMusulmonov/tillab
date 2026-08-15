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
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          TilLab
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Asosiy menyu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground",
                pathname === link.href && "font-medium text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contribute"
            className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            Hissa qo‘shish
          </Link>
          {user ? (
            <Link href="/profile" className="text-sm font-medium">
              {user.name}
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium">
              Kirish
            </Link>
          )}
        </div>
        <button
          className="lg:hidden"
          aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobil menyu">
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
