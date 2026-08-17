import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveButton from "@/components/SaveButton";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  TIPE_PEKERJAAN_LABEL, PENGALAMAN_LABEL, PENDIDIKAN_LABEL,
} from "@/lib/categories";
import { formatTanggal, formatRelatif, isExpired, waLink } from "@/lib/utils";
import {
  MapPin, Briefcase, GraduationCap, Clock, Wallet, Globe, Instagram, Mail, MessageCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LokerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lowongan = await prisma.lowongan.findUnique({ where: { id } });
  if (!lowongan) notFound();

  // best-effort view counter
  prisma.lowongan.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  const session = await getSession();
  let initialSaved = false;
  if (session?.role === "PENCARI_KERJA") {
    const saved = await prisma.savedJob.findUnique({
      where: { userId_lowonganId: { userId: session.userId, lowonganId: id } },
    });
    initialSaved = !!saved;
  }

  const expired = isExpired(lowongan.deadline);

  return (
    <div className="min-h-screen bg-ink-100">
      <Navbar />

      <section className="bg-navy-950 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs text-ink-300">
            <Link href="/loker" className="hover:text-white">Lowongan Kerja</Link> / {lowongan.kategori}
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{lowongan.judul}</h1>
              <p className="mt-1.5 text-sm font-medium text-sky-300">{lowongan.namaPerusahaan}</p>
            </div>
            <span className={`badge shrink-0 ${expired ? "bg-white/10 text-ink-300" : "bg-sky-400/15 text-sky-300"}`}>
              {expired ? "Lowongan ditutup" : "Sedang dibuka"}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {lowongan.fotoUrl && (
              <div className="card overflow-hidden">
                <Image
                  src={lowongan.fotoUrl}
                  alt={`Pamflet lowongan ${lowongan.judul}`}
                  width={800}
                  height={600}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-navy-900">Deskripsi Pekerjaan</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">
                {lowongan.deskripsi}
              </p>
            </div>

            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-navy-900">Persyaratan</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">
                {lowongan.persyaratan}
              </p>
            </div>

            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-navy-900">Tentang Perusahaan</h2>
              <div className="mt-3 space-y-2 text-sm text-ink-700">
                {lowongan.websitePerusahaan && (
                  <a href={lowongan.websitePerusahaan} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-600">
                    <Globe size={15} /> {lowongan.websitePerusahaan}
                  </a>
                )}
                {lowongan.instagramPerusahaan && (
                  <p className="flex items-center gap-2"><Instagram size={15} /> {lowongan.instagramPerusahaan}</p>
                )}
                {lowongan.emailPerusahaan && (
                  <p className="flex items-center gap-2"><Mail size={15} /> {lowongan.emailPerusahaan}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                <a href={waLink(lowongan.whatsappPIC, `Halo, saya tertarik dengan lowongan ${lowongan.judul} di ${lowongan.namaPerusahaan} yang saya lihat di KarirKu.`)} target="_blank" rel="noreferrer" className="btn-primary flex-1">
                  <MessageCircle size={16} /> Hubungi via WhatsApp
                </a>
                <SaveButton lowonganId={lowongan.id} initialSaved={initialSaved} />
              </div>

              <dl className="space-y-3 border-t border-ink-100 pt-4 text-sm">
                <Row icon={<Wallet size={15} />} label="Gaji" value={lowongan.gaji || "Tidak ditampilkan"} />
                <Row icon={<Briefcase size={15} />} label="Tipe Pekerjaan" value={TIPE_PEKERJAAN_LABEL[lowongan.tipePekerjaan]} />
                <Row icon={<Clock size={15} />} label="Pengalaman" value={PENGALAMAN_LABEL[lowongan.pengalaman]} />
                <Row icon={<GraduationCap size={15} />} label="Pendidikan Minimal" value={PENDIDIKAN_LABEL[lowongan.pendidikanMinimal]} />
                <Row icon={<MapPin size={15} />} label="Lokasi" value={`${lowongan.kabupatenKota ? lowongan.kabupatenKota + ", " : ""}${lowongan.provinsi}`} />
              </dl>

              <div className="border-t border-ink-100 pt-4 text-xs text-ink-500">
                <p>Deadline pendaftaran: <span className="font-semibold text-ink-900">{formatTanggal(lowongan.deadline)}</span></p>
                <p className="mt-1">Diposting {formatRelatif(lowongan.createdAt)}</p>
              </div>
            </div>

            <div className="card p-6 text-sm">
              <h3 className="font-display font-bold text-navy-900">Kontak PIC</h3>
              <p className="mt-2 text-ink-700">{lowongan.namaPIC}</p>
              <p className="text-ink-500">{lowongan.whatsappPIC}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-ink-500">{icon} {label}</span>
      <span className="text-right font-medium text-ink-900">{value}</span>
    </div>
  );
}
