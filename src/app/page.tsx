import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearchBar from "@/components/HeroSearchBar";
import LowonganCard from "@/components/LowonganCard";
import { prisma } from "@/lib/prisma";
import { KATEGORI_LOWONGAN } from "@/lib/categories";
import {
  Hotel, ShoppingBag, Landmark, GraduationCap, Factory, ClipboardList,
  Truck, Bus, Headset, Megaphone, Sprout, HeartPulse, Cpu, HardHat, ArrowRight,
  Briefcase as Briefcase_fallback,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  hotel: Hotel, "shopping-bag": ShoppingBag, landmark: Landmark, "graduation-cap": GraduationCap,
  factory: Factory, "clipboard-list": ClipboardList, truck: Truck, bus: Bus, headset: Headset,
  megaphone: Megaphone, sprout: Sprout, "heart-pulse": HeartPulse, cpu: Cpu, "hard-hat": HardHat,
};

export const dynamic = "force-dynamic";

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

  return (
    <div className="min-h-screen bg-ink-100">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950 px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="absolute inset-0 bg-career-line opacity-40" />
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="badge border border-sky-400/30 bg-sky-400/10 text-sky-300">
            89+ lowongan baru minggu ini
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Temukan Karier <span className="text-sky-400">Impianmu</span>
            <br className="hidden sm:block" /> di KarirKu
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-300">
            Platform pencarian kerja terpercaya yang menghubungkan talenta terbaik dengan
            perusahaan terverifikasi di seluruh Indonesia.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <HeroSearchBar />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-brand-600">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/15 px-4 py-6 text-center sm:px-6">
          <Stat value={`${totalLowongan.toLocaleString("id-ID")}+`} label="Lowongan Aktif" />
          <Stat value={`${totalPerusahaanRows.length.toLocaleString("id-ID")}+`} label="Perusahaan Terdaftar" />
          <Stat value={`${totalPencariKerja.toLocaleString("id-ID")}+`} label="Pencari Kerja" />
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
          {KATEGORI_LOWONGAN.map((kat) => {
            const Icon = ICONS[kat.icon] ?? Briefcase_fallback;
            return (
              <Link
                key={kat.nama}
                href={`/loker?kategori=${encodeURIComponent(kat.nama)}`}
                className="card flex items-center gap-3 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{kat.nama}</span>
                  <span className="block text-xs text-ink-500">
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
              <h2 className="text-2xl font-bold text-navy-900">Lowongan Terbaru</h2>
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
              {latest.map((l) => (
                <LowonganCard key={l.id} {...l} />
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
            {perusahaanAktif.map((nama) => (
              <div key={nama} className="card flex flex-col items-center gap-2 p-5 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-bold text-white">
                  {nama.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-ink-900">{nama}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy-950">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Siap Memulai Karier Baru?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink-300">
            Bergabung dengan ribuan pencari kerja dan perusahaan yang sudah menggunakan KarirKu.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/auth/register?role=PENCARI_KERJA" className="btn-gold">
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
      <p className="font-display text-2xl font-extrabold text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium text-brand-100 sm:text-sm">{label}</p>
    </div>
  );
}
