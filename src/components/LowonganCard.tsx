import Link from "next/link";
import { MapPin, Briefcase, Clock } from "lucide-react";
import { TIPE_PEKERJAAN_LABEL } from "@/lib/categories";
import { formatRelatif, isExpired } from "@/lib/utils";

type Props = {
  id: string;
  judul: string;
  namaPerusahaan: string;
  kabupatenKota?: string | null;
  provinsi: string;
  tipePekerjaan: string;
  deadline: Date | string;
  createdAt: Date | string;
  gaji?: string | null;
};

export default function LowonganCard(props: Props) {
  const expired = isExpired(props.deadline);

  return (
    <Link
      href={`/loker/${props.id}`}
      className="card group flex flex-col gap-3 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-ink-900 group-hover:text-brand-600">
            {props.judul}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-ink-500">{props.namaPerusahaan}</p>
        </div>
        <span
          className={`badge shrink-0 ${
            expired ? "bg-ink-100 text-ink-500" : "bg-brand-50 text-brand-700"
          }`}
        >
          {expired ? "Ditutup" : "Buka"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {props.kabupatenKota ? `${props.kabupatenKota}, ` : ""}{props.provinsi}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={13} /> {TIPE_PEKERJAAN_LABEL[props.tipePekerjaan] ?? props.tipePekerjaan}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} /> {formatRelatif(props.createdAt)}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-ink-100 pt-3">
        <span className="text-sm font-semibold text-navy-900">
          {props.gaji || "Gaji tidak ditampilkan"}
        </span>
        <span className="text-xs font-semibold text-brand-600 group-hover:underline">
          Lihat detail →
        </span>
      </div>
    </Link>
  );
}
