import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-ink-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">
        <header className="flex h-16 items-center justify-between border-b border-ink-100 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-1 lg:hidden">
            <span className="font-display text-lg font-extrabold text-navy-900">Karir</span>
            <span className="font-display text-lg font-extrabold text-brand-600">Ku</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-ink-900">{session?.name}</p>
              <p className="text-xs text-ink-500">{session?.email}</p>
            </div>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
