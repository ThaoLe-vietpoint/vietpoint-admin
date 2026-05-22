import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "VietPoint Admin",
  description: "Admin Dashboard – VietPoint Financial",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${geist.variable} h-full`}>
      <body className="h-full antialiased font-sans bg-slate-50">
        {children}
      </body>
    </html>
  );
}
