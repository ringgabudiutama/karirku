"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, LayoutDashboard, PlusCircle, ListChecks, FolderOpen } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/input-lowongan", label: "Input", icon: PlusCircle },
  { href: "/dashboard/lowongan-saya", label: "Lowongan", icon: ListChecks },
  { href: "/dashboard/leaderboard", label: "Ranking", icon: Trophy },
  { href: "/dashboard/dokumen", label: "Dokumen", icon: FolderOpen },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-ink-100 bg-white lg:hidden">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
              isActive ? "text-brand-600" : "text-ink-500"
            }`}
          >
            <Icon size={18} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
