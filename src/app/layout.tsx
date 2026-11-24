import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LanguageModal from "@/components/common/LanguageModal";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "SelfRealization | Spiritual Outreach, Vedic Courses & Learning Platform",
  description: "Discover inner peace and divine purpose through authentic Kṛṣṇa consciousness, interactive Bhagavad-gītā quizzes, live classes, and self-paced LMS courses.",
  keywords: ["SelfRealization", "Bhagavad Gita", "Krishna Consciousness", "ISKCON", "Spiritual Quiz", "LMS", "Vedic Courses", "Live Like a Monk"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Playfair+Display:ital,wght@1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-gray-900 selection:bg-amber-200 selection:text-amber-900">
        <LanguageProvider>
          <LanguageModal />
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
