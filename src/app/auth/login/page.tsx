"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error ?? "Gagal masuk");
      return;
    }
    toast.success("Selamat datang kembali!");
    router.push(params.get("redirect") || data.redirect);
    router.refresh();
  }

  return (
    <AuthShell title="Masuk ke akunmu" subtitle="Lanjutkan pencarian atau kelola lowonganmu.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="nama@email.com" />
        </div>
        <div>
          <label className="label-field">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Password kamu" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Belum punya akun?{" "}
        <Link href="/auth/register" className="font-semibold text-brand-600 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </AuthShell>
  );
}
