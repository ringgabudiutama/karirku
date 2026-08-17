import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LowonganCard from "@/components/LowonganCard";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LokerSayaPage() {
  const session = await getSession();
  if (!session) return null; // middleware guards this route

  const saved = await prisma.savedJob.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { lowongan: true },
  });

  return (
    <div className="min-h-screen bg-ink-100">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-navy-900">Loker Tersimpan</h1>
        <p className="mt-1 text-sm text-ink-500">{saved.length} lowongan kamu simpan</p>

        {saved.length === 0 ? (
          <div className="card mt-6 flex flex-col items-center gap-3 p-14 text-center">
            <Bookmark size={28} className="text-ink-300" />
            <p className="text-sm text-ink-500">Belum ada lowongan tersimpan. Simpan lowongan yang menarik untukmu.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s) => (
              <LowonganCard key={s.id} {...s.lowongan} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
