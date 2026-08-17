import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-xl font-extrabold text-navy-900">Karir</span>
          <span className="font-display text-xl font-extrabold text-brand-600">Ku</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/" className="text-sm font-medium text-ink-700 hover:text-brand-600">
            Beranda
          </Link>
          <Link href="/loker" className="text-sm font-medium text-ink-700 hover:text-brand-600">
            Lowongan Kerja
          </Link>
          {session?.role === "PENCARI_KERJA" && (
            <Link href="/loker-saya" className="text-sm font-medium text-ink-700 hover:text-brand-600">
              Loker Tersimpan
            </Link>
          )}
          {session?.role === "MARKETER" && (
            <Link href="/dashboard" className="text-sm font-medium text-ink-700 hover:text-brand-600">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!session && (
            <>
              <Link href="/auth/login" className="hidden text-sm font-semibold text-ink-700 hover:text-brand-600 sm:block">
                Masuk
              </Link>
              <Link href="/auth/register" className="btn-primary !px-4 !py-2 text-sm">
                Daftar Gratis
              </Link>
            </>
          )}
          {session && (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-ink-500 sm:block">
                Hai, <span className="font-semibold text-ink-900">{session.name.split(" ")[0]}</span>
              </span>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
