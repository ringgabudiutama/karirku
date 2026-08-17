import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import LowonganForm from "@/components/LowonganForm";
import EvidenceUploader from "@/components/EvidenceUploader";
import DeleteLowonganButton from "@/components/DeleteLowonganButton";
import { formatTanggal, formatRelatif, waLink } from "@/lib/utils";
import {
  TIPE_PEKERJAAN_LABEL, PENGALAMAN_LABEL, PENDIDIKAN_LABEL,
} from "@/lib/categories";
import { Eye, Bookmark, MessageCircle, ArrowLeft, Paperclip } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LowonganDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;
  const session = await getSession();
  if (!session) return null;

  const lowongan = await prisma.lowongan.findUnique({
    where: { id },
    include: { evidence: { orderBy: { createdAt: "desc" } }, _count: { select: { savedBy: true } } },
  });

  if (!lowongan || lowongan.marketerId !== session.userId) notFound();

  if (edit === "1") {
    return (
      <div>
        <BackLink />
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-navy-900">Edit Lowongan</h1>
          <p className="mt-1 text-sm text-ink-500">{lowongan.judul}</p>
        </div>
        <div className="max-w-3xl">
          <LowonganForm
            mode="edit"
            lowonganId={lowongan.id}
            initialData={{
              namaPerusahaan: lowongan.namaPerusahaan,
              websitePerusahaan: lowongan.websitePerusahaan ?? "",
              instagramPerusahaan: lowongan.instagramPerusahaan ?? "",
              emailPerusahaan: lowongan.emailPerusahaan ?? "",
              namaPIC: lowongan.namaPIC,
              whatsappPIC: lowongan.whatsappPIC,
              judul: lowongan.judul,
              tipePekerjaan: lowongan.tipePekerjaan,
              pengalaman: lowongan.pengalaman,
              pendidikanMinimal: lowongan.pendidikanMinimal,
              deadline: new Date(lowongan.deadline).toISOString().slice(0, 10),
              gaji: lowongan.gaji ?? "",
              kategori: lowongan.kategori,
              subkategori: lowongan.subkategori ?? "",
              provinsi: lowongan.provinsi,
              kabupatenKota: lowongan.kabupatenKota ?? "",
              deskripsi: lowongan.deskripsi,
              persyaratan: lowongan.persyaratan,
              linkSumber: lowongan.linkSumber,
              fotoUrl: lowongan.fotoUrl ?? "",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">{lowongan.judul}</h1>
          <p className="mt-1 text-sm text-ink-500">{lowongan.namaPerusahaan} · Diposting {formatRelatif(lowongan.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/loker/${lowongan.id}`} target="_blank" className="btn-outline">Lihat Publik</Link>
          <Link href={`/dashboard/lowongan-saya/${lowongan.id}?edit=1`} className="btn-primary">Edit</Link>
          <DeleteLowonganButton id={lowongan.id} judul={lowongan.judul} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {lowongan.fotoUrl && (
            <div className="card overflow-hidden">
              <Image src={lowongan.fotoUrl} alt={lowongan.judul} width={800} height={600} className="h-auto w-full object-contain" />
            </div>
          )}
          <div className="card p-6">
            <h2 className="font-display text-base font-bold text-navy-900">Deskripsi Pekerjaan</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">{lowongan.deskripsi}</p>
          </div>
          <div className="card p-6">
            <h2 className="font-display text-base font-bold text-navy-900">Persyaratan</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">{lowongan.persyaratan}</p>
          </div>

          <div className="card p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-navy-900">Evidence</h2>
              <EvidenceUploader lowonganId={lowongan.id} />
            </div>
            {lowongan.evidence.length === 0 ? (
              <p className="text-sm text-ink-500">Belum ada evidence yang diunggah.</p>
            ) : (
              <ul className="space-y-2">
                {lowongan.evidence.map((ev) => (
                  <li key={ev.id}>
                    <a href={ev.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand-600 hover:underline">
                      <Paperclip size={14} /> Bukti — {formatTanggal(ev.createdAt)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card grid grid-cols-2 divide-x divide-ink-100 p-5 text-center">
            <div>
              <p className="flex items-center justify-center gap-1.5 font-display text-xl font-extrabold text-navy-900"><Eye size={16} /> {lowongan.views}</p>
              <p className="mt-1 text-xs text-ink-500">Dilihat</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1.5 font-display text-xl font-extrabold text-navy-900"><Bookmark size={16} /> {lowongan._count.savedBy}</p>
              <p className="mt-1 text-xs text-ink-500">Disimpan</p>
            </div>
          </div>

          <div className="card space-y-3 p-6 text-sm">
            <h3 className="font-display font-bold text-navy-900">Ringkasan</h3>
            <Row label="Tipe" value={TIPE_PEKERJAAN_LABEL[lowongan.tipePekerjaan]} />
            <Row label="Pengalaman" value={PENGALAMAN_LABEL[lowongan.pengalaman]} />
            <Row label="Pendidikan" value={PENDIDIKAN_LABEL[lowongan.pendidikanMinimal]} />
            <Row label="Kategori" value={lowongan.kategori} />
            <Row label="Lokasi" value={`${lowongan.kabupatenKota ? lowongan.kabupatenKota + ", " : ""}${lowongan.provinsi}`} />
            <Row label="Deadline" value={formatTanggal(lowongan.deadline)} />
          </div>

          <a href={waLink(lowongan.whatsappPIC)} target="_blank" rel="noreferrer" className="btn-primary w-full">
            <MessageCircle size={16} /> Chat PIC via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/dashboard/lowongan-saya" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-600">
      <ArrowLeft size={15} /> Kembali ke Lowongan Saya
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  );
}
