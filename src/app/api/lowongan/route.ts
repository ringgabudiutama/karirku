import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  namaPerusahaan: z.string().min(2),
  websitePerusahaan: z.string().optional().or(z.literal("")),
  instagramPerusahaan: z.string().optional().or(z.literal("")),
  emailPerusahaan: z.string().email().optional().or(z.literal("")),
  namaPIC: z.string().min(2),
  whatsappPIC: z.string().min(8),

  judul: z.string().min(3),
  tipePekerjaan: z.enum(["FULL_TIME", "PART_TIME", "KONTRAK", "MAGANG", "FREELANCE"]),
  pengalaman: z.enum([
    "FRESH_GRADUATE", "KURANG_1_TAHUN", "SATU_TIGA_TAHUN", "TIGA_LIMA_TAHUN", "LEBIH_5_TAHUN",
  ]),
  pendidikanMinimal: z.enum(["SMA_SMK", "D3", "D4_S1", "S2", "TIDAK_DITENTUKAN"]),
  deadline: z.string(),
  gaji: z.string().optional().or(z.literal("")),
  kategori: z.string().min(2),
  subkategori: z.string().optional().or(z.literal("")),
  provinsi: z.string().min(2),
  kabupatenKota: z.string().optional().or(z.literal("")),
  deskripsi: z.string().min(10),
  persyaratan: z.string().min(10),
  linkSumber: z.string().min(2),
  fotoUrl: z.string().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "MARKETER") {
    return NextResponse.json({ error: "Hanya akun perusahaan yang dapat menambah lowongan" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const lowongan = await prisma.lowongan.create({
    data: {
      marketerId: session.userId,
      namaPerusahaan: d.namaPerusahaan,
      websitePerusahaan: d.websitePerusahaan || null,
      instagramPerusahaan: d.instagramPerusahaan || null,
      emailPerusahaan: d.emailPerusahaan || null,
      namaPIC: d.namaPIC,
      whatsappPIC: d.whatsappPIC,
      judul: d.judul,
      tipePekerjaan: d.tipePekerjaan,
      pengalaman: d.pengalaman,
      pendidikanMinimal: d.pendidikanMinimal,
      deadline: new Date(d.deadline),
      gaji: d.gaji || null,
      kategori: d.kategori,
      subkategori: d.subkategori || null,
      provinsi: d.provinsi,
      kabupatenKota: d.kabupatenKota || null,
      deskripsi: d.deskripsi,
      persyaratan: d.persyaratan,
      linkSumber: d.linkSumber,
      fotoUrl: d.fotoUrl || null,
      status: "PUBLISH",
    },
  });

  return NextResponse.json({ ok: true, id: lowongan.id });
}
