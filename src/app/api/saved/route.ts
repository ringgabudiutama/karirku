import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "PENCARI_KERJA") {
    return NextResponse.json({ error: "Hanya akun pencari kerja yang dapat menyimpan lowongan" }, { status: 403 });
  }

  const { lowonganId } = await req.json().catch(() => ({ lowonganId: null }));
  if (!lowonganId) return NextResponse.json({ error: "Lowongan tidak valid" }, { status: 400 });

  const existing = await prisma.savedJob.findUnique({
    where: { userId_lowonganId: { userId: session.userId, lowonganId } },
  });

  if (existing) {
    await prisma.savedJob.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true, saved: false });
  }

  await prisma.savedJob.create({ data: { userId: session.userId, lowonganId } });
  return NextResponse.json({ ok: true, saved: true });
}
