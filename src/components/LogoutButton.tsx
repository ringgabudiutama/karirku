"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      toast.success("Berhasil keluar");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Gagal keluar, coba lagi");
      setLoading(false);
    }
  }

  return (
    <button onClick={handleLogout} disabled={loading} className="btn-outline !px-4 !py-2 text-sm">
      {loading ? "..." : "Keluar"}
    </button>
  );
}
