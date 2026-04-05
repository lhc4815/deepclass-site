import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "딥클래스 - 입시정보 종합 허브",
  description:
    "입시뉴스, 입시정보, AI 상담, 학원정보를 한 곳에서. 딥클래스와 함께 입시를 준비하세요.",
  keywords: ["입시", "수시", "정시", "대학입시", "입시정보", "딥클래스"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full`}>
      <body className="h-full antialiased flex">
        <Sidebar />
        <div className="flex-1 min-h-screen flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
