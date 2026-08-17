export const KATEGORI_LOWONGAN = [
  { nama: "Perhotelan & Perhotelan", icon: "hotel" },
  { nama: "Retail & Perdagangan", icon: "shopping-bag" },
  { nama: "Keuangan & Akuntansi", icon: "landmark" },
  { nama: "Pendidikan & Pelatihan", icon: "graduation-cap" },
  { nama: "Manufaktur & Produksi", icon: "factory" },
  { nama: "Administrasi & Sekretaris", icon: "clipboard-list" },
  { nama: "Logistik", icon: "truck" },
  { nama: "Transportasi & Logistik", icon: "bus" },
  { nama: "Pelayanan Pelanggan & Hospitality", icon: "headset" },
  { nama: "Komunikasi & Marketing", icon: "megaphone" },
  { nama: "Pertanian & Perikanan", icon: "sprout" },
  { nama: "Kesehatan & Medis", icon: "heart-pulse" },
  { nama: "Teknologi & IT", icon: "cpu" },
  { nama: "Konstruksi & Teknik", icon: "hard-hat" },
] as const;

export const PROVINSI_LIST = [
  "Jawa Timur",
  "Jawa Tengah",
  "Jawa Barat",
  "DKI Jakarta",
  "DI Yogyakarta",
  "Banten",
  "Bali",
  "Sumatera Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Kalimantan Timur",
  "Kalimantan Selatan",
  "Sulawesi Selatan",
  "Sulawesi Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
];

export const TIPE_PEKERJAAN_LABEL: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  KONTRAK: "Kontrak",
  MAGANG: "Magang",
  FREELANCE: "Freelance",
};

export const PENGALAMAN_LABEL: Record<string, string> = {
  FRESH_GRADUATE: "Fresh Graduate",
  KURANG_1_TAHUN: "Kurang dari 1 tahun",
  SATU_TIGA_TAHUN: "1 - 3 tahun",
  TIGA_LIMA_TAHUN: "3 - 5 tahun",
  LEBIH_5_TAHUN: "Lebih dari 5 tahun",
};

export const PENDIDIKAN_LABEL: Record<string, string> = {
  SMA_SMK: "SMA / SMK",
  D3: "D3",
  D4_S1: "D4 / S1",
  S2: "S2",
  TIDAK_DITENTUKAN: "Tidak ditentukan",
};

export const STATUS_LABEL: Record<string, string> = {
  PUBLISH: "Publish",
  DITUTUP: "Ditutup",
};
