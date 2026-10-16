import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CalendarCheck,
  CreditCard,
  Award,
  LogOut,
  User,
  GraduationCap,
} from "lucide-react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      {/* Top Student Navigation Bar */}
      <header className="bg-mcoa-midnight text-white h-16 border-b border-mcoa-amethyst/30 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <Link href="/student" className="flex items-center space-x-2">
            <div className="bg-white/95 rounded px-2 py-1">
              <Image
                src="/mcoa-logo.png"
                alt="MCOA Logo"
                width={120}
                height={32}
                className="object-contain h-6 w-auto"
              />
            </div>
            <span className="hidden sm:inline font-montserrat font-bold text-xs uppercase tracking-wider text-mcoa-gold">
              Student LMS Space
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold">
            <Link
              href="/student"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-mcoa-gold" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/student/courses/advanced-medical-coding"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-mcoa-lavender" />
              <span>Classroom & Lessons</span>
            </Link>
            <Link
              href="/student/assignments"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-white/70" />
              <span>Chart Assignments</span>
            </Link>
            <Link
              href="/student/attendance"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-white/70" />
              <span>Attendance & Live</span>
            </Link>
            <Link
              href="/student/fees"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition flex items-center space-x-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-white/70" />
              <span>Fee Receipt</span>
            </Link>
            <Link
              href="/student/certificates"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-mcoa-gold hover:text-white transition flex items-center space-x-1.5"
            >
              <Award className="w-3.5 h-3.5 text-mcoa-gold" />
              <span>Certificate</span>
            </Link>
          </nav>
        </div>

        {/* Student Profile & ID */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-right">
            <div className="font-bold text-white text-xs">Sneha Ramachandran</div>
            <div className="text-[10px] text-mcoa-gold font-mono">ID: MCOA-2026-CHN-0082</div>
          </div>
          <Link
            href="/login"
            className="flex items-center space-x-1 text-xs text-white/70 hover:text-white bg-white/10 px-2.5 py-1.5 rounded-lg transition"
            title="Switch User / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </header>

      {/* Main Student Space Container */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
