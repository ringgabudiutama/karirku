import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

  const { nama, fileUrl } = await req.json().catch(() => ({}));
  if (!nama || !fileUrl) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const dokumen = await prisma.dokumen.create({
    data: { userId: session.userId, nama, fileUrl },
  });
  return NextResponse.json({ ok: true, dokumen });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

  const { id } = await req.json().catch(() => ({ id: null }));
  const dokumen = await prisma.dokumen.findUnique({ where: { id } });
  if (!dokumen || dokumen.userId !== session.userId) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
  }

  await prisma.dokumen.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
