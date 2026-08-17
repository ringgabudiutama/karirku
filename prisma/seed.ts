import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const marketer1 = await prisma.user.upsert({
    where: { email: "hrd@yafiradigital.com" },
    update: {},
    create: {
      name: "Sinta Marketer",
      email: "hrd@yafiradigital.com",
      passwordHash: password,
      role: "MARKETER",
      whatsapp: "6285743233038",
      companyName: "PT Yafira Digital Technology",
    },
  });

  const marketer2 = await prisma.user.upsert({
    where: { email: "hrd@miesinarterang.com" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "hrd@miesinarterang.com",
      passwordHash: password,
      role: "MARKETER",
      whatsapp: "62878477277",
      companyName: "Mie Sinar Terang",
    },
  });

  await prisma.user.upsert({
    where: { email: "pencari@karirku.com" },
    update: {},
    create: {
      name: "Ringga Budi Utama",
      email: "pencari@karirku.com",
      passwordHash: password,
      role: "PENCARI_KERJA",
      whatsapp: "6281234567890",
    },
  });

  const listings = [
    {
      marketerId: marketer1.id,
      namaPerusahaan: "PT Yafira Digital Technology",
      websitePerusahaan: "https://yafiradigital.com",
      instagramPerusahaan: "@yafiradigital",
      emailPerusahaan: "hrd@yafiradigital.com",
      namaPIC: "Sinta",
      whatsappPIC: "6285743233038",
      judul: "Advertiser",
      tipePekerjaan: "FULL_TIME" as const,
      pengalaman: "KURANG_1_TAHUN" as const,
      pendidikanMinimal: "D4_S1" as const,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      gaji: "3.500.000 - 4.500.000",
      kategori: "Komunikasi & Marketing",
      provinsi: "Jawa Timur",
      kabupatenKota: "Lamongan",
      deskripsi: "Bertanggung jawab merancang dan menjalankan kampanye iklan digital di berbagai platform untuk meningkatkan brand awareness dan konversi penjualan.",
      persyaratan: "Minimal D4/S1 semua jurusan, memahami Meta Ads & Google Ads, terbiasa membaca data performa iklan, mampu bekerja target-oriented.",
      linkSumber: "instagram.com/p/yafiradigital-loker1",
    },
    {
      marketerId: marketer1.id,
      namaPerusahaan: "PT Yafira Digital Technology",
      websitePerusahaan: "https://yafiradigital.com",
      instagramPerusahaan: "@yafiradigital",
      emailPerusahaan: "hrd@yafiradigital.com",
      namaPIC: "Sinta",
      whatsappPIC: "6285743233038",
      judul: "Marketing & Branding Manager",
      tipePekerjaan: "FULL_TIME" as const,
      pengalaman: "TIGA_LIMA_TAHUN" as const,
      pendidikanMinimal: "D4_S1" as const,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      gaji: "7.000.000 - 9.000.000",
      kategori: "Komunikasi & Marketing",
      provinsi: "Jawa Timur",
      kabupatenKota: "Lamongan",
      deskripsi: "Memimpin strategi branding perusahaan secara menyeluruh, mengelola tim marketing, dan bertanggung jawab atas pertumbuhan brand di pasar nasional.",
      persyaratan: "Pengalaman minimal 3 tahun di posisi serupa, memiliki portofolio kampanye branding yang terukur, kemampuan leadership yang kuat.",
      linkSumber: "instagram.com/p/yafiradigital-loker2",
    },
    {
      marketerId: marketer1.id,
      namaPerusahaan: "PT Yafira Digital Technology",
      websitePerusahaan: "https://yafiradigital.com",
      instagramPerusahaan: "@yafiradigital",
      namaPIC: "Sinta",
      whatsappPIC: "6285743233038",
      judul: "Designer",
      tipePekerjaan: "FULL_TIME" as const,
      pengalaman: "SATU_TIGA_TAHUN" as const,
      pendidikanMinimal: "D3" as const,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      gaji: null,
      kategori: "Komunikasi & Marketing",
      provinsi: "Jawa Timur",
      kabupatenKota: "Lamongan",
      deskripsi: "Membuat konten visual untuk kebutuhan sosial media, materi promosi, dan kebutuhan branding perusahaan lainnya.",
      persyaratan: "Menguasai Figma, Adobe Photoshop & Illustrator, memiliki portofolio desain, mampu bekerja dengan deadline ketat.",
      linkSumber: "instagram.com/p/yafiradigital-loker3",
    },
    {
      marketerId: marketer2.id,
      namaPerusahaan: "Mie Sinar Terang",
      namaPIC: "Budi",
      whatsappPIC: "62878477277",
      judul: "Supervisor",
      tipePekerjaan: "FULL_TIME" as const,
      pengalaman: "SATU_TIGA_TAHUN" as const,
      pendidikanMinimal: "SMA_SMK" as const,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      gaji: "2.800.000",
      kategori: "Perhotelan & Perhotelan",
      provinsi: "Jawa Timur",
      kabupatenKota: "Blitar",
      deskripsi: "Mengawasi operasional harian outlet, memastikan standar pelayanan dan kualitas produk terjaga, mengelola shift karyawan.",
      persyaratan: "Minimal SMA/SMK, pengalaman di bidang F&B menjadi nilai tambah, disiplin dan mampu memimpin tim.",
      linkSumber: "instagram.com/p/miesinarterang-loker1",
    },
    {
      marketerId: marketer2.id,
      namaPerusahaan: "Mie Sinar Terang",
      namaPIC: "Budi",
      whatsappPIC: "62878477277",
      judul: "Kasir",
      tipePekerjaan: "PART_TIME" as const,
      pengalaman: "FRESH_GRADUATE" as const,
      pendidikanMinimal: "SMA_SMK" as const,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      gaji: "1.800.000",
      kategori: "Retail & Perdagangan",
      provinsi: "Jawa Timur",
      kabupatenKota: "Blitar",
      deskripsi: "Melayani transaksi pembayaran pelanggan, menjaga kerapian kasir, dan membantu operasional outlet.",
      persyaratan: "Minimal SMA/SMK, jujur dan teliti, mampu bekerja shift.",
      linkSumber: "instagram.com/p/miesinarterang-loker2",
    },
  ];

  for (const l of listings) {
    await prisma.lowongan.create({ data: l });
  }

  console.log("Seed selesai:");
  console.log("- Marketer: hrd@yafiradigital.com / password123");
  console.log("- Marketer: hrd@miesinarterang.com / password123");
  console.log("- Pencari Kerja: pencari@karirku.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
