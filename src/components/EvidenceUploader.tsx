"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileUp, Loader2 } from "lucide-react";

export default function EvidenceUploader({ lowonganId }: { lowonganId: string }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("folder", "evidence");
    const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
    const uploadResult = await uploadRes.json();

    if (!uploadRes.ok) {
      setUploading(false);
      toast.error(uploadResult.error ?? "Gagal mengunggah bukti");
      return;
    }

    const saveRes = await fetch(`/api/lowongan/${lowonganId}/evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl: uploadResult.url }),
    });
    setUploading(false);
    e.target.value = "";

    if (!saveRes.ok) {
      toast.error("Gagal menyimpan bukti");
      return;
    }
    toast.success("Evidence berhasil ditambahkan");
    router.refresh();
  }

  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-ink-100 px-4 py-3 text-sm text-ink-500 hover:border-brand-300">
      {uploading ? <Loader2 size={16} className="animate-spin text-brand-500" /> : <FileUp size={16} />}
      {uploading ? "Mengunggah..." : "Tambah Evidence"}
      <input type="file" className="hidden" onChange={handleFile} disabled={uploading} />
    </label>
  );
}
