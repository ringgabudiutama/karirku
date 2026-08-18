import { CheckCircle2, TrendingUp, Star, Briefcase, MapPin } from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
      {/* glow */}
      <div className="absolute inset-0 rounded-full bg-sky-400/10 blur-3xl" />

      {/* main mock card: a fake job-listing UI */}
      <div className="absolute inset-x-6 top-6 bottom-16 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-24 rounded-full bg-white/20" />
          <div className="h-6 w-6 rounded-full bg-sky-400/30" />
        </div>

        <div className="mt-6 space-y-3">
          {[85, 65, 92].map((w, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-sky-400">
                <Briefcase size={15} className="text-white" />
              </span>
              <div className="flex-1 space-y-1.5">
                <div className="h-2 rounded-full bg-white/25" style={{ width: `${w}%` }} />
                <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11px] text-ink-300">
          <MapPin size={12} /> Lowongan aktif dari seluruh Indonesia
        </div>
      </div>

      {/* floating card: lamaran diterima */}
      <div className="absolute -left-4 top-8 flex items-center gap-2.5 rounded-xl border border-white/10 bg-navy-900/90 px-3.5 py-2.5 shadow-card-hover backdrop-blur">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
          <CheckCircle2 size={16} />
        </span>
        <div>
          <p className="text-xs font-semibold text-white">Lamaran Diterima</p>
          <p className="text-[10px] text-ink-300">PT Teknologi Indonesia</p>
        </div>
      </div>

      {/* floating card: trend */}
      <div className="absolute -right-4 top-1/3 flex items-center gap-2.5 rounded-xl border border-white/10 bg-navy-900/90 px-3.5 py-2.5 shadow-card-hover backdrop-blur">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-sky-400">
          <TrendingUp size={16} />
        </span>
        <div>
          <p className="text-xs font-semibold text-white">2.400+</p>
          <p className="text-[10px] text-ink-300">Lamaran bulan ini</p>
        </div>
      </div>

      {/* floating card: testimonial */}
      <div className="absolute -bottom-2 left-4 max-w-[220px] rounded-xl border border-white/10 bg-navy-900/90 px-4 py-3 shadow-card-hover backdrop-blur">
        <div className="flex gap-0.5 text-gold-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} fill="currentColor" />
          ))}
        </div>
        <p className="mt-1.5 text-xs leading-snug text-white">
          &ldquo;Dapat kerja dalam 2 minggu lewat KarirKu.&rdquo;
        </p>
      </div>
    </div>
  );
}
