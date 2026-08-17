import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import DokumenUploader from "@/components/DokumenUploader";
import DeleteDokumenButton from "@/components/DeleteDokumenButton";
import { formatTanggal } from "@/lib/utils";
import { FileText, FolderOpen } from "lucide-react";

export default async function DokumenPage() {
  const session = await getSession();
  if (!session) return null;

  const dokumen = await prisma.dokumen.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900">Dokumen</h1>
        <p className="mt-1 text-sm text-ink-500">Simpan dokumen pendukung perusahaan seperti SIUP, NPWP, atau surat kerja sama</p>
      </div>

      <DokumenUploader />

      <div className="card mt-6 overflow-hidden">
        {dokumen.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-14 text-center">
            <FolderOpen size={28} className="text-ink-300" />
            <p className="text-sm text-ink-500">Belum ada dokumen yang diunggah.</p>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {dokumen.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <a href={d.fileUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 hover:text-brand-600">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <FileText size={16} />
                  </span>
                  <span className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{d.nama}</p>
                    <p className="text-xs text-ink-500">Diunggah {formatTanggal(d.createdAt)}</p>
                  </span>
                </a>
                <DeleteDokumenButton id={d.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
