# KarirKu

Platform lowongan kerja — dua role: **Marketer** (perusahaan yang input lowongan) dan **Pencari Kerja** (browse & simpan lowongan). Dibangun dengan Next.js 15 (App Router), Prisma, PostgreSQL, dan Vercel Blob untuk upload foto pamflet/dokumen/evidence.

## Fitur

**Publik**
- Landing page + statistik (lowongan aktif, perusahaan terdaftar, pencari kerja)
- Browse & filter lowongan (kategori, provinsi, tipe pekerjaan, pencarian teks)
- Detail lowongan + kontak PIC via WhatsApp

**Pencari Kerja** (harus login)
- Simpan/hapus lowongan ke "Loker Tersimpan"

**Marketer** (harus login)
- Dashboard statistik (total lowongan, lowongan aktif, total dilihat, total disimpan)
- Leaderboard antar marketer (berdasarkan jumlah lowongan)
- Input Lowongan (form lengkap + upload foto pamflet)
- Lowongan Saya (tabel: cari, filter status, detail, edit, hapus, bagikan link)
- Detail lowongan: statistik dilihat/disimpan + upload Evidence
- Dokumen: simpan dokumen pendukung perusahaan (SIUP, NPWP, dll)

Catatan: sesuai kesepakatan awal, lowongan **langsung publish** saat diinput — tidak ada alur approval admin.

## Stack

- Next.js 15 App Router + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL (cocok dengan Vercel Postgres / Neon)
- Vercel Blob untuk penyimpanan file (foto pamflet, evidence, dokumen)
- Auth custom: JWT (jose) + bcrypt, disimpan di httpOnly cookie — tanpa NextAuth supaya bebas dari isu konflik versi

## Setup Lokal

```bash
npm install
cp .env.example .env
```

Isi `.env`:

```
DATABASE_URL="postgres://...?sslmode=require"
DIRECT_URL="postgres://...?sslmode=require"
AUTH_SECRET="$(openssl rand -base64 32)"
BLOB_READ_WRITE_TOKEN=""   # isi setelah setup Vercel Blob, lihat langkah di bawah
```

Lalu:

```bash
npx prisma generate
npx prisma db push      # atau: npx prisma migrate dev --name init
npm run seed             # opsional, isi data contoh
npm run dev
```

Akun contoh setelah seed (password: `password123`):
- Marketer: `hrd@yafiradigital.com`
- Marketer: `hrd@miesinarterang.com`
- Pencari Kerja: `pencari@karirku.com`

## Deploy ke Vercel

1. **Push ke GitHub**, lalu import project di [vercel.com/new](https://vercel.com/new).

2. **Tambah Postgres:** buka tab *Storage* di project Vercel → *Create Database* → pilih Postgres. Setelah terhubung, Vercel akan menampilkan connection string — salin **pooled connection** ke env var `DATABASE_URL` dan **direct connection** (non-pooling) ke `DIRECT_URL` di *Settings → Environment Variables*.

3. **Tambah Blob store:** masih di tab *Storage* → *Create Database* → pilih Blob. Setelah terhubung ke project, Vercel otomatis mengisi env var `BLOB_READ_WRITE_TOKEN` — tidak perlu diisi manual.

4. **Set `AUTH_SECRET`:** generate string acak (`openssl rand -base64 32`) dan simpan sebagai environment variable.

5. **Migrasi database:** setelah deploy pertama berhasil (atau lewat CLI lokal yang sudah terhubung ke DB production), jalankan:
   ```bash
   npx prisma migrate deploy
   ```
   Atau kalau belum ada migration history, `npx prisma db push` juga bisa untuk deploy awal.

6. **Redeploy** — Vercel akan otomatis menjalankan `prisma generate && next build` sesuai script `build` di `package.json`.

## Struktur Folder

```
prisma/schema.prisma       # schema database
src/lib/                   # prisma client, auth, kategori/provinsi, utils
src/middleware.ts          # proteksi route /dashboard & /loker-saya
src/app/                   # halaman publik, auth, dan dashboard marketer
src/components/            # komponen UI (form, card, sidebar, dll)
```

## Known limitation

Project ini di-generate di sandbox dengan akses jaringan terbatas, sehingga `prisma generate` dan `next build` **belum sempat diverifikasi otomatis** di sini (domain `binaries.prisma.sh` diblokir sandbox-nya, bukan masalah kode). Jalankan `npm install && npx prisma generate && npm run build` di mesin lokal atau biarkan Vercel yang menjalankannya saat deploy — kalau ada type error kecil yang lolos dari review manual, biasanya gampang di-fix.
