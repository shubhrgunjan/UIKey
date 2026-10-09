import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UIKey - Universal UI/UX Extraction",
  description: "Bridge the gap between human interfaces and machine understanding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
        <header className="flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto border-b border-transparent">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-indigo-400">
            UIKey
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium text-gray-300">
            <Link href="/#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
              Sign In / Profile
            </button>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-white/10 px-8 py-12 text-center text-gray-500 w-full mt-auto">
          <p>&copy; {new Date().getFullYear()} UIKey. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
