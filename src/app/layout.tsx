import type { Metadata } from "next";
import { themeBootScript } from "@/components/ui/ThemeToggle";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.madam-sl.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MADAM — Sierra Leone",
    template: "%s - MADAM",
  },
  description:
    "MADAM is a national NGO established in 1991, working with the most vulnerable people in Sierra Leone through agriculture, skills development and partnerships.",
  openGraph: {
    siteName: "MADAM",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@madamsl1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject body attributes */}
      <body className="min-h-full antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
