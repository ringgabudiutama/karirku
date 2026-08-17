import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionCookie } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["MARKETER", "PENCARI_KERJA"]),
  whatsapp: z.string().min(8, "Nomor WhatsApp tidak valid").optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }
  const { name, email, password, role, whatsapp, companyName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar, silakan masuk" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      whatsapp: whatsapp || null,
      companyName: role === "MARKETER" ? companyName || null : null,
    },
  });

  await createSessionCookie({ userId: user.id, name: user.name, email: user.email, role: user.role });

  return NextResponse.json({
    ok: true,
    redirect: role === "MARKETER" ? "/dashboard" : "/loker",
  });
}
