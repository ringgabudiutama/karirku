"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { PROVINSI_LIST } from "@/lib/categories";

export default function HeroSearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [provinsi, setProvinsi] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (provinsi) params.set("provinsi", provinsi);
    router.push(`/loker?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-xl2 bg-white p-2 shadow-card-hover sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 px-3 py-2">
        <Search size={18} className="shrink-0 text-ink-300" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari posisi, perusahaan, atau kata kunci..."
          className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
        />
      </div>
      <div className="hidden h-8 w-px bg-ink-100 sm:block" />
      <div className="flex flex-1 items-center gap-2 px-3 py-2">
        <MapPin size={18} className="shrink-0 text-ink-300" />
        <select
          value={provinsi}
          onChange={(e) => setProvinsi(e.target.value)}
          className="w-full bg-transparent text-sm text-ink-900 focus:outline-none"
        >
          <option value="">Semua Lokasi</option>
          {PROVINSI_LIST.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-gold shrink-0">
        Cari Kerja
      </button>
    </form>
  );
}
