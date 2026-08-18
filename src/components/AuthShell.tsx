import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-10 lg:flex">
        <div className="absolute inset-0 bg-career-line opacity-40" />
        <div className="absolute inset-0 bg-grid-fade" />
        <Link href="/" className="relative">
          <Logo onDark />
        </Link>
        <div className="relative">
          <h2 className="font-display text-3xl font-extrabold leading-tight text-white">
            Karier terbaikmu <br /> dimulai dari sini.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-300">
            Ribuan lowongan dari perusahaan terverifikasi, diperbarui setiap hari.
          </p>
        </div>
        <p className="relative text-xs text-ink-300/60">© {new Date().getFullYear()} KarirKu</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Logo />
          </Link>
          <h1 className="font-display text-2xl font-bold text-navy-900">{title}</h1>
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
