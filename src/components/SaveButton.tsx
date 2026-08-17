"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function SaveButton({
  lowonganId,
  initialSaved,
}: {
  lowonganId: string;
  initialSaved: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lowonganId }),
    });
    setLoading(false);
    if (res.status === 403) {
      toast.error("Masuk sebagai pencari kerja untuk menyimpan lowongan");
      router.push("/auth/login");
      return;
    }
    if (!res.ok) {
      toast.error("Gagal menyimpan, coba lagi");
      return;
    }
    const data = await res.json();
    setSaved(data.saved);
    toast.success(data.saved ? "Lowongan disimpan" : "Lowongan dihapus dari simpanan");
    router.refresh();
  }

  return (
    <button onClick={toggle} disabled={loading} className="btn-outline">
      {saved ? <BookmarkCheck size={16} className="text-brand-600" /> : <Bookmark size={16} />}
      {saved ? "Tersimpan" : "Simpan"}
    </button>
  );
}
