import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "There For You | Your AI-Powered Student Companion",
  description: "Academic support, career guidance, scholarships and well-being — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* We'll handle conditional layout rendering in child pages or a wrapper for the login page, but for the prototype dashboard we'll wrap it here temporarily. We will extract this to a separate layout group later if needed. */}
        {children}
      </body>
    </html>
  );
}
