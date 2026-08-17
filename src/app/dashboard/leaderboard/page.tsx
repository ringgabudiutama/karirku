import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Trophy, Medal } from "lucide-react";

export default async function LeaderboardPage() {
  const session = await getSession();

  const grouped = await prisma.lowongan.groupBy({
    by: ["marketerId"],
    _count: { _all: true },
    _sum: { views: true },
   orderBy: { _count: { marketerId: "desc" } },
    take: 20,
  });

  const userIds = grouped.map((g) => g.marketerId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, companyName: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const rows = grouped
    .map((g) => ({
      marketerId: g.marketerId,
      totalLowongan: g._count._all,
      totalViews: g._sum.views ?? 0,
      user: userMap[g.marketerId],
    }))
    .sort((a, b) => b.totalLowongan - a.totalLowongan);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900">Leaderboard Marketer</h1>
        <p className="mt-1 text-sm text-ink-500">Peringkat berdasarkan jumlah lowongan yang dipasang</p>
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-500">Belum ada data untuk ditampilkan.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 bg-ink-100/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3">Peringkat</th>
                <th className="px-5 py-3">Marketer</th>
                <th className="px-5 py-3 text-right">Total Lowongan</th>
                <th className="px-5 py-3 text-right">Total Dilihat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((row, i) => {
                const isMe = row.marketerId === session?.userId;
                return (
                  <tr key={row.marketerId} className={isMe ? "bg-brand-50/50" : ""}>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 font-semibold text-ink-900">
                        {i === 0 && <Trophy size={15} className="text-gold-500" />}
                        {i === 1 && <Medal size={15} className="text-ink-300" />}
                        {i === 2 && <Medal size={15} className="text-amber-700" />}
                        #{i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-ink-900">
                        {row.user?.companyName || row.user?.name || "Marketer"}
                        {isMe && <span className="ml-2 text-xs font-semibold text-brand-600">(Kamu)</span>}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-navy-900">{row.totalLowongan}</td>
                    <td className="px-5 py-3.5 text-right text-ink-500">{row.totalViews}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
