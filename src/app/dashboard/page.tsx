import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import StatCard from "@/components/StatCard";
import { ListChecks, Eye, Bookmark, TrendingUp, ArrowRight } from "lucide-react";
import { STATUS_LABEL } from "@/lib/categories";
import { formatRelatif, isExpired } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [total, aktif, agg, savedTotal, recent] = await Promise.all([
    prisma.lowongan.count({ where: { marketerId: session.userId } }),
    prisma.lowongan.count({
      where: { marketerId: session.userId, status: "PUBLISH", deadline: { gte: new Date() } },
    }),
    prisma.lowongan.aggregate({
      where: { marketerId: session.userId },
      _sum: { views: true },
    }),
    prisma.savedJob.count({ where: { lowongan: { marketerId: session.userId } } }),
    prisma.lowongan.findMany({
      where: { marketerId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Ringkasan performa lowongan yang kamu kelola</p>
        </div>
        <Link href="/dashboard/input-lowongan" className="btn-primary hidden sm:inline-flex">
          + Input Lowongan
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ListChecks} label="Total Lowongan" value={total} tone="navy" />
        <StatCard icon={TrendingUp} label="Lowongan Aktif" value={aktif} tone="brand" />
        <StatCard icon={Eye} label="Total Dilihat" value={agg._sum.views ?? 0} tone="gold" />
        <StatCard icon={Bookmark} label="Total Disimpan" value={savedTotal} tone="brand" />
      </div>

      <div className="card mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-navy-900">Lowongan Terbaru Kamu</h2>
          <Link href="/dashboard/lowongan-saya" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
            Lihat semua <ArrowRight size={12} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-500">
            Belum ada lowongan. <Link href="/dashboard/input-lowongan" className="font-semibold text-brand-600">Input lowongan pertamamu</Link>.
          </p>
        ) : (
          <div className="divide-y divide-ink-100">
            {recent.map((l) => (
              <Link
                key={l.id}
                href={`/dashboard/lowongan-saya/${l.id}`}
                className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-900">{l.judul}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{formatRelatif(l.createdAt)} · {l.views} dilihat</p>
                </div>
                <span className={`badge shrink-0 ${isExpired(l.deadline) ? "bg-ink-100 text-ink-500" : "bg-brand-50 text-brand-700"}`}>
                  {isExpired(l.deadline) ? "Berakhir" : STATUS_LABEL[l.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
