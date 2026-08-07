import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/lib/components/ui/sonner";
import "./globals.css";

const font = localFont({
  src: [
    { path: "./fonts/OpenSans-Light.ttf", weight: "300" },
    { path: "./fonts/OpenSans-Regular.ttf", weight: "400" },
    { path: "./fonts/OpenSans-Bold.ttf", weight: "700" },
    { path: "./fonts/OpenSans-ExtraBold.ttf", weight: "800" },
  ],
  variable: "--font-sans",
  display: "swap",
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
