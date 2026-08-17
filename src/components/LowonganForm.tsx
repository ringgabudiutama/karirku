"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ImagePlus, Loader2 } from "lucide-react";
import { KATEGORI_LOWONGAN, PROVINSI_LIST, TIPE_PEKERJAAN_LABEL, PENGALAMAN_LABEL, PENDIDIKAN_LABEL } from "@/lib/categories";

export type LowonganFormData = {
  namaPerusahaan: string;
  websitePerusahaan: string;
  instagramPerusahaan: string;
  emailPerusahaan: string;
  namaPIC: string;
  whatsappPIC: string;
  judul: string;
  tipePekerjaan: string;
  pengalaman: string;
  pendidikanMinimal: string;
  deadline: string;
  gaji: string;
  kategori: string;
  subkategori: string;
  provinsi: string;
  kabupatenKota: string;
  deskripsi: string;
  persyaratan: string;
  linkSumber: string;
  fotoUrl: string;
};

const empty: LowonganFormData = {
  namaPerusahaan: "", websitePerusahaan: "", instagramPerusahaan: "", emailPerusahaan: "",
  namaPIC: "", whatsappPIC: "", judul: "", tipePekerjaan: "FULL_TIME", pengalaman: "FRESH_GRADUATE",
  pendidikanMinimal: "TIDAK_DITENTUKAN", deadline: "", gaji: "", kategori: "", subkategori: "",
  provinsi: "", kabupatenKota: "", deskripsi: "", persyaratan: "", linkSumber: "", fotoUrl: "",
};

export default function LowonganForm({
  mode,
  lowonganId,
  initialData,
}: {
  mode: "create" | "edit";
  lowonganId?: string;
  initialData?: Partial<LowonganFormData>;
}) {
  const router = useRouter();
  const [data, setData] = useState<LowonganFormData>({ ...empty, ...initialData });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof LowonganFormData>(key: K, value: LowonganFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "pamflet");
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const result = await res.json();
    setUploading(false);
    if (!res.ok) {
      toast.error(result.error ?? "Gagal mengunggah foto");
      return;
    }
    set("fotoUrl", result.url);
    toast.success("Foto pamflet berhasil diunggah");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.kategori) {
      toast.error("Pilih kategori lowongan");
      return;
    }
    setSubmitting(true);

    const res = await fetch(mode === "create" ? "/api/lowongan" : `/api/lowongan/${lowonganId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(result.error ?? "Gagal menyimpan lowongan");
      return;
    }

    toast.success(mode === "create" ? "Lowongan berhasil dipublikasikan" : "Perubahan disimpan");
    router.push(mode === "create" ? `/dashboard/lowongan-saya/${result.id}` : `/dashboard/lowongan-saya/${lowonganId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h2 className="font-display text-base font-bold text-navy-900">Data Perusahaan</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Perusahaan" required>
            <input required value={data.namaPerusahaan} onChange={(e) => set("namaPerusahaan", e.target.value)} className="input-field" placeholder="PT/CV Nama Perusahaan" />
          </Field>
          <Field label="Website Perusahaan">
            <input value={data.websitePerusahaan} onChange={(e) => set("websitePerusahaan", e.target.value)} className="input-field" placeholder="https://" />
          </Field>
          <Field label="Instagram Perusahaan">
            <input value={data.instagramPerusahaan} onChange={(e) => set("instagramPerusahaan", e.target.value)} className="input-field" placeholder="@username" />
          </Field>
          <Field label="Email Perusahaan">
            <input type="email" value={data.emailPerusahaan} onChange={(e) => set("emailPerusahaan", e.target.value)} className="input-field" placeholder="hrd@perusahaan.com" />
          </Field>
          <Field label="Nama PIC / HRD" required>
            <input required value={data.namaPIC} onChange={(e) => set("namaPIC", e.target.value)} className="input-field" />
          </Field>
          <Field label="WhatsApp PIC" required>
            <input required value={data.whatsappPIC} onChange={(e) => set("whatsappPIC", e.target.value)} className="input-field" placeholder="08xx" />
          </Field>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-base font-bold text-navy-900">Data Lowongan</h2>
        <div className="mt-4 space-y-4">
          <Field label="Judul Lowongan" required>
            <input required value={data.judul} onChange={(e) => set("judul", e.target.value)} className="input-field" placeholder="Contoh: Admin Operasional, Frontend Developer..." />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tipe Pekerjaan" required>
              <select required value={data.tipePekerjaan} onChange={(e) => set("tipePekerjaan", e.target.value)} className="input-field">
                {Object.entries(TIPE_PEKERJAAN_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Pengalaman" required>
              <select required value={data.pengalaman} onChange={(e) => set("pengalaman", e.target.value)} className="input-field">
                {Object.entries(PENGALAMAN_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Pendidikan Minimal">
              <select value={data.pendidikanMinimal} onChange={(e) => set("pendidikanMinimal", e.target.value)} className="input-field">
                {Object.entries(PENDIDIKAN_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Deadline Pendaftaran" required>
              <input required type="date" value={data.deadline} onChange={(e) => set("deadline", e.target.value)} className="input-field" />
            </Field>
          </div>

          <Field label="Gaji">
            <input value={data.gaji} onChange={(e) => set("gaji", e.target.value)} className="input-field" placeholder="Contoh: 3.000.000 (kosongkan jika tidak ingin mencantumkan gaji)" />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Kategori" required>
              <select required value={data.kategori} onChange={(e) => set("kategori", e.target.value)} className="input-field">
                <option value="">-- Pilih Kategori --</option>
                {KATEGORI_LOWONGAN.map((k) => <option key={k.nama} value={k.nama}>{k.nama}</option>)}
              </select>
            </Field>
            <Field label="Subkategori">
              <input value={data.subkategori} onChange={(e) => set("subkategori", e.target.value)} className="input-field" placeholder="Opsional" />
            </Field>
            <Field label="Provinsi Domisili Loker" required>
              <select required value={data.provinsi} onChange={(e) => set("provinsi", e.target.value)} className="input-field">
                <option value="">-- Pilih Provinsi --</option>
                {PROVINSI_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Kabupaten/Kota">
              <input value={data.kabupatenKota} onChange={(e) => set("kabupatenKota", e.target.value)} className="input-field" />
            </Field>
          </div>

          <Field label="Deskripsi Pekerjaan" required>
            <textarea required rows={5} value={data.deskripsi} onChange={(e) => set("deskripsi", e.target.value)} className="input-field resize-none" />
          </Field>

          <Field label="Persyaratan Pekerjaan" required>
            <textarea required rows={5} value={data.persyaratan} onChange={(e) => set("persyaratan", e.target.value)} className="input-field resize-none" />
          </Field>

          <Field label="Link URL Sumber Lowongan" required>
            <input required value={data.linkSumber} onChange={(e) => set("linkSumber", e.target.value)} className="input-field" placeholder="instagram.com/p/... atau facebook.com/..." />
          </Field>

          <Field label="Foto Pamflet Lowongan">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-ink-100 px-4 py-8 text-center hover:border-brand-300">
              {uploading ? (
                <Loader2 size={22} className="animate-spin text-brand-500" />
              ) : (
                <ImagePlus size={22} className="text-ink-300" />
              )}
              <span className="text-xs text-ink-500">
                {data.fotoUrl ? "Foto terunggah — klik untuk ganti" : "Klik untuk unggah foto pamflet (maks 8MB)"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
            {data.fotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.fotoUrl} alt="Preview pamflet" className="mt-3 max-h-56 rounded-lg border border-ink-100 object-contain" />
            )}
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="btn-outline">Batal</button>
        <button type="submit" disabled={submitting || uploading} className="btn-primary">
          {submitting ? "Menyimpan..." : mode === "create" ? "Submit Lowongan" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-field">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
