import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/features/admin/components/ui/sonner";
import { SiteSettingsProvider } from "@/shared/site-settings/SiteSettingsProvider";
import { getPublicApiValue } from "@/shared/lib/api/server";
import type { SiteSettings } from "@/shared/site-settings/types";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicApiValue("/site-settings").catch((error: unknown) => {
    console.error("Unable to load site settings", error);
    return null;
  }) as SiteSettings | null;

  return (
    <html
      lang="vi"
      className={font.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <SiteSettingsProvider settings={settings}>
          {children}
        </SiteSettingsProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
