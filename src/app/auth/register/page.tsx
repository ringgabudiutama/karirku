"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Briefcase, UserSearch } from "lucide-react";
import AuthShell from "@/components/AuthShell";

type Role = "MARKETER" | "PENCARI_KERJA";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role") as Role) === "MARKETER" ? "MARKETER" : "PENCARI_KERJA";

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, whatsapp, companyName }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error ?? "Gagal mendaftar");
      return;
    }
    toast.success("Akun berhasil dibuat!");
    router.push(data.redirect);
    router.refresh();
  }

  return (
    <AuthShell title="Buat akun baru" subtitle="Gratis, dan hanya butuh waktu satu menit.">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-ink-100 p-1">
        <button
          type="button"
          onClick={() => setRole("PENCARI_KERJA")}
          className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition ${
            role === "PENCARI_KERJA" ? "bg-white text-brand-600 shadow-card" : "text-ink-500"
          }`}
        >
          <UserSearch size={14} /> Pencari Kerja
        </button>
        <button
          type="button"
          onClick={() => setRole("MARKETER")}
          className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition ${
            role === "MARKETER" ? "bg-white text-brand-600 shadow-card" : "text-ink-500"
          }`}
        >
          <Briefcase size={14} /> Perusahaan
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Nama Lengkap</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Nama kamu" />
        </div>

        {role === "MARKETER" && (
          <div>
            <label className="label-field">Nama Perusahaan</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="input-field"
              placeholder="PT/CV Nama Perusahaan"
            />
          </div>
        )}

        <div>
          <label className="label-field">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="nama@email.com" />
        </div>
        <div>
          <label className="label-field">Nomor WhatsApp</label>
          <input required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="input-field" placeholder="08xx" />
        </div>
        <div>
          <label className="label-field">Password</label>
          <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Minimal 6 karakter" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Memproses..." : "Buat Akun"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="font-semibold text-brand-600 hover:underline">
          Masuk
        </Link>
      </p>
    </AuthShell>
  );
}
