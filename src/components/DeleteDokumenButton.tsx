"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function DeleteDokumenButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Hapus dokumen ini?")) return;
    setLoading(true);
    const res = await fetch("/api/dokumen", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Gagal menghapus dokumen");
      return;
    }
    toast.success("Dokumen dihapus");
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-ink-300 hover:text-red-600">
      <Trash2 size={16} />
    </button>
  );
}
