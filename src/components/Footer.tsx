import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-ink-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1">
              <span className="font-display text-lg font-extrabold text-white">Karir</span>
              <span className="font-display text-lg font-extrabold text-sky-400">Ku</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-300/80">
              Menghubungkan pencari kerja terbaik dengan perusahaan terpercaya di seluruh Indonesia.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Pencari Kerja</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/loker" className="hover:text-white">Cari Lowongan</Link></li>
              <li><Link href="/auth/register" className="hover:text-white">Buat Akun</Link></li>
              <li><Link href="/loker-saya" className="hover:text-white">Loker Tersimpan</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Perusahaan</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/register" className="hover:text-white">Pasang Lowongan</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link href="/dashboard/leaderboard" className="hover:text-white">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Kontak</p>
            <ul className="space-y-2 text-sm">
              <li>halo@karirku.com</li>
              <li>Jombang, Jawa Timur</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-ink-300/60">
          © {new Date().getFullYear()} KarirKu. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
