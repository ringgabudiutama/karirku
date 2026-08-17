"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UploadCloud, Loader2 } from "lucide-react";

export default function DokumenUploader() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!name.trim()) {
      toast.error("Isi nama dokumen terlebih dahulu");
      e.target.value = "";
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "dokumen");
    const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
    const uploadResult = await uploadRes.json();

    if (!uploadRes.ok) {
      setUploading(false);
      toast.error(uploadResult.error ?? "Gagal mengunggah dokumen");
      return;
    }

    const saveRes = await fetch("/api/dokumen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama: name, fileUrl: uploadResult.url }),
    });
    setUploading(false);
    e.target.value = "";

    if (!saveRes.ok) {
      toast.error("Gagal menyimpan dokumen");
      return;
    }
    setName("");
    toast.success("Dokumen berhasil ditambahkan");
    router.refresh();
  }

  return (
    <div className="card p-5">
      <h2 className="font-display text-base font-bold text-navy-900">Unggah Dokumen Baru</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama dokumen, contoh: SIUP, NPWP, Surat Domisili"
          className="input-field"
        />
        <label className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {uploading ? "Mengunggah..." : "Pilih File"}
          <input type="file" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}
