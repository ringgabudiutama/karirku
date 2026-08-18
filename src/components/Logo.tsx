export default function Logo({
  size = "md",
  onDark = false,
}: {
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
}) {
  const dims = { sm: 26, md: 30, lg: 36 }[size];
  const textSize = { sm: "text-base", md: "text-lg", lg: "text-2xl" }[size];

  return (
    <span className="inline-flex items-center gap-2">
      <svg width={dims} height={dims} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="9" fill="url(#karirku-logo-grad)" />
        <path
          d="M10 9v14M10 16l7-7M10 16l7 7"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="karirku-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-display ${textSize} font-extrabold ${onDark ? "text-white" : "text-navy-900"}`}>
        Karir<span className="text-brand-500">Ku</span>
      </span>
    </span>
  );
}
