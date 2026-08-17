import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "MARKETER") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const lowongan = await prisma.lowongan.findUnique({ where: { id } });
  if (!lowongan || lowongan.marketerId !== session.userId) {
    return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });
  }

  const { fileUrl } = await req.json().catch(() => ({ fileUrl: null }));
  if (!fileUrl) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });

  const evidence = await prisma.evidence.create({ data: { lowonganId: id, fileUrl } });
  return NextResponse.json({ ok: true, evidence });
}
