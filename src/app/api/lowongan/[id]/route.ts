import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

async function assertOwner(id: string, userId: string) {
  const lowongan = await prisma.lowongan.findUnique({ where: { id } });
  if (!lowongan || lowongan.marketerId !== userId) return null;
  return lowongan;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "MARKETER") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }
  const owned = await assertOwner(id, session.userId);
  if (!owned) return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const allowed = [
    "judul", "tipePekerjaan", "pengalaman", "pendidikanMinimal", "deadline", "gaji",
    "kategori", "subkategori", "provinsi", "kabupatenKota", "deskripsi", "persyaratan",
    "linkSumber", "fotoUrl", "namaPerusahaan", "websitePerusahaan", "instagramPerusahaan",
    "emailPerusahaan", "namaPIC", "whatsappPIC", "status",
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }
  if (data.deadline) data.deadline = new Date(data.deadline as string);

  await prisma.lowongan.update({ where: { id }, data: data as Prisma.LowonganUpdateInput });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "MARKETER") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }
  const owned = await assertOwner(id, session.userId);
  if (!owned) return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });

  await prisma.lowongan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
