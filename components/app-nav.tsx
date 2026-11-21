"use client";

import { Flame, NotebookPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/challenges", label: "Retos", icon: Flame },
  { href: "/journal", label: "Diario", icon: NotebookPen },
];

// Navegación entre apps; marca la app en la que estás.
export function AppNav() {
  const pathname = usePathname();
  return (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const current = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={current ? "page" : undefined}
            className="nav-pill text-ink inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold whitespace-nowrap sm:gap-2 sm:px-4"
          >
            <Icon aria-hidden="true" className="text-sunset hidden size-4 sm:block" />
            {label}
          </Link>
        );
      })}
    </>
  );
}
