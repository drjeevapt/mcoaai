import type { Metadata } from "next";
import { Cinzel, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import AiCounselorWidget from "@/components/ai/AiCounselorWidget";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_ACADEMY_URL || "https://medicalcodingofficersacademy.com"),
  title: "Medical Coding Officers Academy (MCOA) | Certification Training, Education & Placement",
  description:
    "MCOA is South India's leading academy for Advanced Medical Coding, AAPC CPC®, AHIMA CCS®, CRC®, and CPMA® preparation. Founded by Dr. Jeevanantham Mariappan. Campuses in Chennai, Perambalur, Coimbatore, and Karaikudi.",
  keywords: [
    "Medical Coding Officers Academy",
    "MCOA",
    "CPC certification training",
    "CCS training Chennai",
    "Medical coding courses Tamil Nadu",
    "Dr Jeevanantham Mariappan",
    "Healthcare RCM placement",
    "AAPC CPC training",
    "ICD-10-CM",
    "ICD-10-PCS",
  ],
  authors: [{ name: "Dr. Jeevanantham Mariappan" }],
  openGraph: {
    title: "Medical Coding Officers Academy (MCOA)",
    description: "Empowering Healthcare Professionals. Building Successful Careers.",
    url: "https://medicalcodingofficersacademy.com",
    siteName: "MCOA",
    images: [
      {
        url: "/mcoa-logo.png",
        width: 1200,
        height: 630,
        alt: "Medical Coding Officers Academy Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-inter bg-white text-mcoa-slate antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <AiCounselorWidget />
      </body>
    </html>
  );
}
