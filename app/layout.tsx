import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { Toaster } from "@/lib/components/ui/sonner";
import "./globals.css";

const font = Roboto_Condensed({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "BMT Decor | Thiết kế và thi công trọn gói",
    template: "%s | BMT Decor",
  },
  description:
    "BMT Decor cung cấp dịch vụ thiết kế nội thất, thi công xây dựng và cải tạo trọn gói tại TP.HCM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={font.variable}>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
