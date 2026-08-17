"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, LayoutDashboard, PlusCircle, ListChecks, FolderOpen } from "lucide-react";

const links = [
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/input-lowongan", label: "Input Lowongan", icon: PlusCircle },
  { href: "/dashboard/lowongan-saya", label: "Lowongan Saya", icon: ListChecks },
  { href: "/dashboard/dokumen", label: "Dokumen", icon: FolderOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-ink-100 bg-white lg:block">
      <div className="flex h-16 items-center gap-1 border-b border-ink-100 px-6">
        <span className="font-display text-lg font-extrabold text-navy-900">Karir</span>
        <span className="font-display text-lg font-extrabold text-brand-600">Ku</span>
        <span className="ml-1.5 rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">
          MARKETER
        </span>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-100"
              }`}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
