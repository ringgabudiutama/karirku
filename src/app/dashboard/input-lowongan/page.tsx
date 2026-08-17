import LowonganForm from "@/components/LowonganForm";

export default function InputLowonganPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900">Input Lowongan</h1>
        <p className="mt-1 text-sm text-ink-500">Lengkapi data di bawah untuk mempublikasikan lowongan baru</p>
      </div>
      <div className="max-w-3xl">
        <LowonganForm mode="create" />
      </div>
    </div>
  );
}
