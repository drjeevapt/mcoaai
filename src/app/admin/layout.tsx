import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, BookOpen, MapPin, Globe, ShieldCheck, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      {/* Top Admin Bar */}
      <header className="bg-mcoa-midnight text-white h-16 border-b border-mcoa-amethyst/30 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="bg-white/95 rounded px-2 py-1">
              <Image
                src="/mcoa-logo.png"
                alt="MCOA Logo"
                width={120}
                height={32}
                className="object-contain h-6 w-auto"
              />
            </div>
            <span className="font-montserrat font-bold text-xs uppercase tracking-wider text-mcoa-gold">
              Management Portal
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-mcoa-gold" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/crm"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5 text-mcoa-lavender" />
              <span>Admissions CRM</span>
            </Link>
            <Link
              href="/admin/admissions"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-mcoa-gold" />
              <span>Student IDs & Enroll</span>
            </Link>
            <Link
              href="/admin/batches"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-white/70" />
              <span>Cohort Batches</span>
            </Link>
            <Link
              href="/courses"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-white/70" />
              <span>Courses</span>
            </Link>
            <Link
              href="/trainer"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-mcoa-gold hover:text-white transition flex items-center space-x-1.5"
            >
              <span>Trainer Portal</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="hidden sm:block text-right">
            <div className="font-bold text-white text-xs">Dr. Jeevanantham Mariappan</div>
            <div className="text-[10px] text-mcoa-gold">Super Admin / CEO</div>
          </div>
          <Link
            href="/"
            className="flex items-center space-x-1 text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Site</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
