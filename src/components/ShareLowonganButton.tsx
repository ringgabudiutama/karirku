"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareLowonganButton({ id }: { id: string }) {
  async function handleShare() {
    const url = `${window.location.origin}/loker/${id}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link lowongan disalin");
  }

  return (
    <button onClick={handleShare} className="rounded bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700 hover:bg-ink-100/70">
      <Share2 size={12} className="inline -mt-0.5 mr-1" /> Bagikan
    </button>
  );
}
