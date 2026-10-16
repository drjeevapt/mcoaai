"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admissions@medicalcodingofficersacademy.com");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState("Admissions Counselor");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to CRM
    router.push("/admin/crm");
  };

  const handleQuickDemo = (demoRole: string, demoEmail: string) => {
    setEmail(demoEmail);
    setRole(demoRole);
    router.push("/admin/crm");
  };

  return (
    <div className="min-h-screen bg-mcoa-pearl/40 flex items-center justify-center p-4 py-12 font-inter">
      <div className="bg-white rounded-3xl shadow-royal max-w-md w-full p-8 border border-mcoa-gold/30 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Image
              src="/mcoa-logo.png"
              alt="MCOA Logo"
              width={220}
              height={60}
              className="object-contain h-12 w-auto"
            />
          </div>
          <h1 className="text-xl font-bold font-montserrat text-mcoa-midnight mt-3">
            Unified Academy Portal
          </h1>
          <p className="text-xs text-gray-500">
            Sign in for Admissions CRM, Academic Management & Student LMS
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-mcoa-slate outline-none focus:bg-white focus:ring-2 focus:ring-mcoa-amethyst transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-mcoa-slate outline-none focus:bg-white focus:ring-2 focus:ring-mcoa-amethyst transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-mcoa-amethyst" />
              <span>Remember session</span>
            </label>
            <a href="#" className="hover:text-mcoa-amethyst transition">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition shadow-md flex items-center justify-center space-x-2"
          >
            <span>Enter Staff CRM & Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Buttons for Evaluators */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">
            Instant Portal Switcher
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/student"
              className="p-2.5 rounded-lg border border-mcoa-gold/50 bg-amber-50/60 hover:bg-amber-100 text-left transition block"
            >
              <div className="font-bold text-mcoa-midnight text-[11px]">Sneha (Student)</div>
              <div className="text-[10px] text-gray-600">Enter Student LMS Space →</div>
            </Link>
            <Link
              href="/trainer"
              className="p-2.5 rounded-lg border border-mcoa-amethyst/30 bg-mcoa-pearl hover:bg-mcoa-pearl/80 text-left transition block"
            >
              <div className="font-bold text-mcoa-midnight text-[11px]">Dr. Rajesh (Trainer)</div>
              <div className="text-[10px] text-gray-600">Enter Faculty Portal →</div>
            </Link>
            <Link
              href="/admin"
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition block"
            >
              <div className="font-bold text-mcoa-midnight text-[11px]">Dr. Jeevanantham</div>
              <div className="text-[10px] text-gray-600">Executive Console →</div>
            </Link>
            <Link
              href="/admin/crm"
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition block"
            >
              <div className="font-bold text-mcoa-midnight text-[11px]">Admissions Desk</div>
              <div className="text-[10px] text-gray-600">CRM Pipeline →</div>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-mcoa-amethyst hover:underline font-semibold">
            ← Return to Public Academy Website
          </Link>
        </div>
      </div>
    </div>
  );
}
