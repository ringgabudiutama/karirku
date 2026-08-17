import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LowonganCard from "@/components/LowonganCard";
import { prisma } from "@/lib/prisma";
import { KATEGORI_LOWONGAN, PROVINSI_LIST, TIPE_PEKERJAAN_LABEL } from "@/lib/categories";
import { SearchX } from "lucide-react";
import type { Prisma } from "@prisma/client";

type SearchParams = {
  q?: string;
  kategori?: string;
  provinsi?: string;
  tipe?: string;
};

export default async function LokerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const where: Prisma.LowonganWhereInput = {
    status: "PUBLISH",
    ...(sp.q
      ? {
          OR: [
            { judul: { contains: sp.q, mode: "insensitive" } },
            { namaPerusahaan: { contains: sp.q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(sp.kategori ? { kategori: sp.kategori } : {}),
    ...(sp.provinsi ? { provinsi: sp.provinsi } : {}),
    ...(sp.tipe ? { tipePekerjaan: sp.tipe as Prisma.LowonganWhereInput["tipePekerjaan"] } : {}),
  };

  const lowongan = await prisma.lowongan.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <div className="min-h-screen bg-ink-100">
      <Navbar />

      <section className="bg-navy-950 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Lowongan Kerja</h1>
          <p className="mt-1 text-sm text-ink-300">{lowongan.length} lowongan ditemukan</p>

          <form method="GET" className="mt-6 grid grid-cols-1 gap-2 rounded-xl2 bg-white p-3 sm:grid-cols-[1fr_auto_auto_auto_auto]">
            <input
              name="q"
              defaultValue={sp.q}
              placeholder="Cari posisi atau perusahaan..."
              className="input-field sm:!border-none"
            />
            <select name="kategori" defaultValue={sp.kategori} className="input-field sm:w-48">
              <option value="">Semua Kategori</option>
              {KATEGORI_LOWONGAN.map((k) => (
                <option key={k.nama} value={k.nama}>{k.nama}</option>
              ))}
            </select>
            <select name="provinsi" defaultValue={sp.provinsi} className="input-field sm:w-40">
              <option value="">Semua Provinsi</option>
              {PROVINSI_LIST.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select name="tipe" defaultValue={sp.tipe} className="input-field sm:w-36">
              <option value="">Semua Tipe</option>
              {Object.entries(TIPE_PEKERJAAN_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary">Terapkan</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {lowongan.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-14 text-center">
            <SearchX size={28} className="text-ink-300" />
            <p className="text-sm text-ink-500">Tidak ada lowongan yang cocok dengan pencarianmu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lowongan.map((l) => (
              <LowonganCard key={l.id} {...l} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
