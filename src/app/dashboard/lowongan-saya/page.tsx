import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatTanggal, isExpired } from "@/lib/utils";
import DeleteLowonganButton from "@/components/DeleteLowonganButton";
import ShareLowonganButton from "@/components/ShareLowonganButton";
import type { Prisma } from "@prisma/client";

type SearchParams = { q?: string; tab?: "semua" | "publish" | "ditutup" };

export default async function LowonganSayaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session) return null;
  const sp = await searchParams;
  const tab = sp.tab ?? "semua";

  const where: Prisma.LowonganWhereInput = {
    marketerId: session.userId,
    ...(sp.q ? { judul: { contains: sp.q, mode: "insensitive" } } : {}),
    ...(tab === "publish" ? { status: "PUBLISH" } : {}),
    ...(tab === "ditutup" ? { status: "DITUTUP" } : {}),
  };

  const lowongan = await prisma.lowongan.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const tabs: { key: SearchParams["tab"]; label: string }[] = [
    { key: "semua", label: "Semua" },
    { key: "publish", label: "Publish" },
    { key: "ditutup", label: "Ditutup" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Lowongan Saya</h1>
          <p className="mt-1 text-sm text-ink-500">Total {lowongan.length} lowongan</p>
        </div>
        <Link href="/dashboard/input-lowongan" className="btn-primary">+ Input Lowongan</Link>
      </div>

      <form method="GET" className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input name="q" defaultValue={sp.q} placeholder="Cari judul lowongan..." className="input-field sm:max-w-xs" />
        <input type="hidden" name="tab" value={tab} />
        <button type="submit" className="btn-outline shrink-0">Cari</button>
      </form>

      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/dashboard/lowongan-saya?tab=${t.key}${sp.q ? `&q=${encodeURIComponent(sp.q)}` : ""}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              tab === t.key ? "bg-navy-900 text-white" : "bg-white text-ink-500 hover:bg-ink-100"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-ink-100 bg-ink-100/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-5 py-3">No</th>
              <th className="px-5 py-3">Lowongan</th>
              <th className="px-5 py-3">Deadline</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {lowongan.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink-500">
                  Belum ada lowongan yang cocok.
                </td>
              </tr>
            )}
            {lowongan.map((l, i) => {
              const expired = isExpired(l.deadline);
              return (
                <tr key={l.id}>
                  <td className="px-5 py-4 align-top text-ink-500">{i + 1}</td>
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold text-ink-900">{l.judul}</p>
                    <p className="text-xs text-ink-500">{l.namaPerusahaan}</p>
                    <p className="text-xs text-ink-500">{l.kabupatenKota ? `${l.kabupatenKota}, ` : ""}{l.provinsi}</p>
                  </td>
                  <td className="px-5 py-4 align-top text-ink-700">{formatTanggal(l.deadline)}</td>
                  <td className="px-5 py-4 align-top">
                    <span className={`badge ${expired ? "bg-ink-100 text-ink-500" : "bg-brand-50 text-brand-700"}`}>
                      {expired ? "Berakhir" : "Publish"}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      <Link href={`/dashboard/lowongan-saya/${l.id}`} className="rounded bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700 hover:bg-ink-100/70">
                        Detail
                      </Link>
                      <Link href={`/dashboard/lowongan-saya/${l.id}?edit=1`} className="rounded bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100">
                        Edit
                      </Link>
                      <ShareLowonganButton id={l.id} />
                      <DeleteLowonganButton id={l.id} judul={l.judul} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
