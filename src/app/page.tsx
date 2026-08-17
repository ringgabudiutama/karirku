import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearchBar from "@/components/HeroSearchBar";
import LowonganCard from "@/components/LowonganCard";
import { prisma } from "@/lib/prisma";
import { KATEGORI_LOWONGAN } from "@/lib/categories";
import {
  Hotel, ShoppingBag, Landmark, GraduationCap, Factory, ClipboardList,
  Truck, Bus, Headset, Megaphone, Sprout, HeartPulse, Cpu, HardHat, ArrowRight,
  Briefcase as Briefcase_fallback, ShieldCheck, Zap, Users, Gift, Building2,
  CheckCircle2, TrendingUp, Star,
} from "lucide-react";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  hotel: Hotel, "shopping-bag": ShoppingBag, landmark: Landmark, "graduation-cap": GraduationCap,
  factory: Factory, "clipboard-list": ClipboardList, truck: Truck, bus: Bus, headset: Headset,
  megaphone: Megaphone, sprout: Sprout, "heart-pulse": HeartPulse, cpu: Cpu, "hard-hat": HardHat,
};

const KEUNGGULAN = [
  {
    icon: ShieldCheck,
    title: "Perusahaan Terverifikasi",
    desc: "Setiap lowongan melewati proses verifikasi sebelum tayang, jadi kamu bisa melamar dengan tenang.",
  },
  {
    icon: Gift,
    title: "100% Gratis untuk Pencari Kerja",
    desc: "Buat akun, simpan lowongan, dan kirim lamaran tanpa biaya tersembunyi apa pun.",
  },
  {
    icon: Zap,
    title: "Proses Cepat & Transparan",
    desc: "Update status lamaran real-time, tanpa perlu menunggu tanpa kepastian.",
  },
  {
    icon: Users,
    title: "Komunitas yang Terus Tumbuh",
    desc: "Bergabung dengan ribuan pencari kerja aktif dari seluruh penjuru Indonesia.",
  },
];

export const revalidate = 60;

export default async function HomePage() {
  const [totalLowongan, totalPerusahaanRows, totalPencariKerja, latest, kategoriCounts] =
    await Promise.all([
      prisma.lowongan.count({ where: { status: "PUBLISH" } }),
      prisma.lowongan.findMany({ distinct: ["namaPerusahaan"], select: { namaPerusahaan: true } }),
      prisma.user.count({ where: { role: "PENCARI_KERJA" } }),
      prisma.lowongan.findMany({
        where: { status: "PUBLISH" },
        orderBy: { createdAt: "desc" },
        take: 9,
      }),
      prisma.lowongan.groupBy({
        by: ["kategori"],
        where: { status: "PUBLISH" },
        _count: { kategori: true },
      }),
    ]);

  const kategoriCountMap = Object.fromEntries(
    kategoriCounts.map((k) => [k.kategori, k._count.kategori])
  );

  const seenPerusahaan = new Set<string>();
  const perusahaanAktif: string[] = [];
  for (const l of latest) {
    const nama = l.namaPerusahaan as string;
    if (!seenPerusahaan.has(nama)) {
      seenPerusahaan.add(nama);
      perusahaanAktif.push(nama);
    }
    if (perusahaanAktif.length >= 8) break;
  }

  // Marquee only looks good with enough items to scroll smoothly.
  // With very few companies, show a static row instead of an animated
  // one so the name is never clipped mid-word.
  const MIN_MARQUEE_BASE = 8;
  const useMarqueeAnimation = perusahaanAktif.length >= 3;
  const marqueeBase = useMarqueeAnimation
    ? Array.from(
        { length: Math.max(MIN_MARQUEE_BASE, perusahaanAktif.length) },
        (_, i) => perusahaanAktif[i % perusahaanAktif.length]
      )
    : perusahaanAktif;
  const marqueeItems = useMarqueeAnimation ? [...marqueeBase, ...marqueeBase] : marqueeBase;
  const popularKategori = KATEGORI_LOWONGAN.slice(0, 5);

  return (
    <div className="min-h-screen bg-ink-100">
      <style>{`
        @keyframes kk-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes kk-blobA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, 6%) scale(1.08); }
          66% { transform: translate(-3%, -4%) scale(0.96); }
        }
        @keyframes kk-blobB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-5%, 4%) scale(1.1); }
          70% { transform: translate(4%, -5%) scale(0.94); }
        }
        @keyframes kk-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes kk-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes kk-sheen {
          from { transform: translateX(-120%) skewX(-12deg); }
          to { transform: translateX(220%) skewX(-12deg); }
        }
        @keyframes kk-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .kk-float-a { animation: kk-float 5s ease-in-out infinite; }
        .kk-float-b { animation: kk-float 6s ease-in-out infinite; animation-delay: 1s; }
        .kk-fade-up {
          opacity: 0;
          animation: kk-fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .kk-blob-a { animation: kk-blobA 22s ease-in-out infinite; }
        .kk-blob-b { animation: kk-blobB 26s ease-in-out infinite; }
        .kk-gradient-text {
          background-image: linear-gradient(90deg, #38BDF8, #F5B93F, #38BDF8);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: kk-shimmer 5s ease-in-out infinite;
        }
        .kk-marquee-track {
          animation: kk-marquee 32s linear infinite;
        }
        .kk-marquee-track:hover {
          animation-play-state: paused;
        }
        .kk-sheen-wrap { position: relative; overflow: hidden; }
        .kk-sheen-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%);
          animation: kk-sheen 7s ease-in-out infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .kk-fade-up, .kk-blob-a, .kk-blob-b, .kk-gradient-text, .kk-marquee-track, .kk-sheen-wrap::after, .kk-float-a, .kk-float-b {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950 px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="absolute inset-0 bg-career-line opacity-40" />
        <div className="absolute inset-0 bg-grid-fade" />
        <div
          className="kk-blob-a pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="kk-blob-b pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          {/* LEFT: copy + search */}
          <div className="text-center lg:text-left">
            <span
              className="kk-fade-up badge inline-flex items-center gap-2 border border-sky-400/30 bg-sky-400/10 text-sky-300"
              style={{ animationDelay: "0ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
              </span>
              <span className={`${mono.className} tracking-wide`}>
                89+ lowongan baru minggu ini
              </span>
            </span>

            <h1
              className="kk-fade-up mt-5 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl"
              style={{ animationDelay: "80ms" }}
            >
              Temukan Karier <span className="kk-gradient-text">Impianmu</span>
              <br className="hidden lg:block" /> di KarirKu
            </h1>
            <p
              className="kk-fade-up mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-300 lg:mx-0"
              style={{ animationDelay: "150ms" }}
            >
              Platform pencarian kerja terpercaya yang menghubungkan talenta terbaik dengan
              perusahaan terverifikasi di seluruh Indonesia.
            </p>
            <div
              className="kk-fade-up mx-auto mt-8 max-w-2xl lg:mx-0"
              style={{ animationDelay: "220ms" }}
            >
              <HeroSearchBar />
            </div>

            <div
              className="kk-fade-up mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-ink-300 lg:justify-start"
              style={{ animationDelay: "280ms" }}
            >
              <span className={`${mono.className} uppercase tracking-wider text-ink-300/70`}>
                Populer:
              </span>
              {popularKategori.map((kat) => (
                <Link
                  key={kat.nama}
                  href={`/loker?kategori=${encodeURIComponent(kat.nama)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-ink-100 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-300"
                >
                  {kat.nama.split(" & ")[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: cutout photo + floating stat cards (desktop only) */}
          <div
            className="kk-fade-up relative hidden lg:block"
            style={{ animationDelay: "160ms" }}
          >
            <div className="relative mx-auto aspect-[4/5] max-w-sm">
              {/* soft glow behind the subject */}
              <div className="absolute inset-x-6 inset-y-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-500/30 via-sky-400/20 to-transparent blur-2xl" />

              {/*
                Ganti src di bawah ini dengan fotomu sendiri.
                1) Hilangkan background foto (mis. remove.bg / Canva BG Remover)
                2) Simpan sebagai PNG transparan
                3) Taruh filenya di folder /public, mis: /public/hero-person.png
                4) src="/hero-person.png"
              */}
              <img
                src="/hero-person.png"
                alt="Pencari kerja yang berhasil mendapat pekerjaan lewat KarirKu"
                className="relative z-10 h-full w-full object-contain object-bottom drop-shadow-2xl"
              />

              {/* floating card: application accepted */}
              <div
                className="kk-float-a absolute -left-6 top-6 z-20 flex items-center gap-2.5 rounded-xl2 border border-white/10 bg-navy-900/85 px-3.5 py-2.5 shadow-card backdrop-blur"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-sky-300">
                  <CheckCircle2 size={16} />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-white">Lamaran Diterima</span>
                  <span className={`${mono.className} block text-[10px] text-ink-300`}>PT. Teknologi Indonesia</span>
                </span>
              </div>

              {/* floating card: activity stat */}
              <div
                className="kk-float-b absolute -right-4 top-1/3 z-20 flex items-center gap-2.5 rounded-xl2 border border-white/10 bg-navy-900/85 px-3.5 py-2.5 shadow-card backdrop-blur"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-400">
                  <TrendingUp size={16} />
                </span>
                <span>
                  <span className={`${mono.className} block text-sm font-bold text-white`}>2.400+</span>
                  <span className="block text-[10px] text-ink-300">Lamaran bulan ini</span>
                </span>
              </div>

              {/* floating card: testimonial */}
              <div
                className="kk-float-a absolute -left-4 bottom-4 z-20 max-w-[190px] rounded-xl2 border border-white/10 bg-navy-900/85 px-4 py-3 shadow-card backdrop-blur"
              >
                <div className="flex items-center gap-0.5 text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-1.5 text-xs leading-snug text-ink-100">
                  &ldquo;Dapat kerja dalam 2 minggu lewat KarirKu.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      {perusahaanAktif.length > 0 && (
        <section className="border-y border-white/5 bg-navy-900 py-6">
          <p
            className={`${mono.className} mb-4 text-center text-[11px] uppercase tracking-[0.2em] text-ink-300/60`}
          >
            Dipercaya oleh perusahaan-perusahaan berikut
          </p>
          {useMarqueeAnimation ? (
            <div
              className="overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              }}
            >
              <div className="kk-marquee-track flex w-max items-center gap-3">
                {marqueeItems.map((nama, i) => (
                  <span
                    key={`${nama}-${i}`}
                    className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-ink-100"
                  >
                    <Building2 size={14} className="shrink-0 text-sky-400" />
                    {nama}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3 px-4">
              {marqueeItems.map((nama, i) => (
                <span
                  key={`${nama}-${i}`}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-ink-100"
                >
                  <Building2 size={14} className="shrink-0 text-sky-400" />
                  {nama}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* STATS */}
      <section className="kk-sheen-wrap bg-brand-600">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/15 px-4 py-6 text-center sm:px-6">
          <Stat value={`${totalLowongan.toLocaleString("id-ID")}+`} label="Lowongan Aktif" />
          <Stat value={`${totalPerusahaanRows.length.toLocaleString("id-ID")}+`} label="Perusahaan Terdaftar" />
          <Stat value={`${totalPencariKerja.toLocaleString("id-ID")}+`} label="Pencari Kerja" />
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className={`${mono.className} text-xs uppercase tracking-[0.2em] text-brand-600`}>
            Kenapa KarirKu
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Dibangun untuk Karier yang Serius
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KEUNGGULAN.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="kk-fade-up card p-6"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-sm font-bold text-ink-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">Jelajahi Kategori Karier</h2>
            <p className="mt-1 text-sm text-ink-500">Temukan lowongan yang sesuai dengan minatmu</p>
          </div>
          <Link href="/loker" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:flex">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {KATEGORI_LOWONGAN.map((kat, i) => {
            const Icon = ICONS[kat.icon] ?? Briefcase_fallback;
            return (
              <Link
                key={kat.nama}
                href={`/loker?kategori=${encodeURIComponent(kat.nama)}`}
                className="kk-fade-up card group flex items-center gap-3 p-4"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{kat.nama}</span>
                  <span className={`${mono.className} block text-xs text-ink-500`}>
                    {kategoriCountMap[kat.nama] ?? 0} lowongan
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* LATEST LISTINGS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-navy-900">
                Lowongan Terbaru
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
              </h2>
              <p className="mt-1 text-sm text-ink-500">Update lowongan setiap hari dari perusahaan terverifikasi</p>
            </div>
            <Link href="/loker" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:flex">
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>

          {latest.length === 0 ? (
            <div className="card p-10 text-center text-sm text-ink-500">
              Belum ada lowongan yang dipublikasikan. Jadilah yang pertama, daftar sebagai perusahaan.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((l, i) => (
                <div
                  key={l.id}
                  className="kk-fade-up"
                  style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                >
                  <LowonganCard {...l} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ACTIVE COMPANIES */}
      {perusahaanAktif.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold text-navy-900">Perusahaan Aktif</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {perusahaanAktif.map((nama, i) => (
              <div
                key={nama}
                className="kk-fade-up card group flex flex-col items-center gap-2 p-5 text-center"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-bold text-white transition group-hover:bg-brand-600">
                  {nama.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-ink-900">{nama}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-navy-950">
        <div
          className="kk-blob-a pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Siap Memulai Karier Baru?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink-300">
            Bergabung dengan ribuan pencari kerja dan perusahaan yang sudah menggunakan KarirKu.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/register?role=PENCARI_KERJA"
              className="btn-gold transition hover:shadow-[0_0_0_4px_rgba(245,185,63,0.25)]"
            >
              Daftar sebagai Pencari Kerja
            </Link>
            <Link
              href="/auth/register?role=MARKETER"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Daftar sebagai Perusahaan
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2">
      <p className={`${mono.className} text-2xl font-bold tracking-tight text-white sm:text-3xl`}>
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-brand-100 sm:text-sm">{label}</p>
    </div>
  );
}