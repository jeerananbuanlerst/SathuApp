import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sathu Admin",
  description: "Sathu Activity Recommendation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${notoThai.variable} bg-cream`}>
        {children}
      </body>
    </html>
  );
}