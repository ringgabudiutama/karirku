export function formatTanggal(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function formatRelatif(date: Date | string) {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffHari = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffHari <= 0) return "Hari ini";
  if (diffHari === 1) return "1 hari lalu";
  if (diffHari < 30) return `${diffHari} hari lalu`;
  return formatTanggal(date);
}

export function formatGaji(gaji?: string | null) {
  if (!gaji) return "Gaji tidak ditampilkan";
  return gaji;
}

export function waLink(nomor: string, pesan?: string) {
  const cleaned = nomor.replace(/\D/g, "").replace(/^0/, "62");
  const text = pesan ? `?text=${encodeURIComponent(pesan)}` : "";
  return `https://wa.me/${cleaned}${text}`;
}

export function isExpired(deadline: Date | string) {
  return new Date(deadline).getTime() < Date.now();
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
