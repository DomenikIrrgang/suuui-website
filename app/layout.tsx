import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LayoutKeeper, layoutScript } from "@/components/LayoutSwitch";
import { PageLoader } from "@/components/PageLoader";
import { ScrollReveal } from "@/components/ScrollReveal";

const marcellus = localFont({
  src: "./fonts/MarcellusSC-Regular.woff",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-marcellus",
});

const figtree = localFont({
  src: [
    { path: "./fonts/Figtree-Variable.woff", weight: "300 900", style: "normal" },
    { path: "./fonts/Figtree-Variable-Italic.woff", weight: "300 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "SuuUI · Quiet until it matters",
    template: "%s · SuuUI",
  },
  description:
    "A full interface replacement for WoW Forever. Free, open source, and built to work in combat, dungeons and raids.",
  openGraph: {
    siteName: "SuuUI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#131116",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The layout script may mark <html> before React starts (see LayoutSwitch).
    <html lang="en" className={`${marcellus.variable} ${figtree.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: layoutScript }} />
        <PageLoader />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollReveal />
        <LayoutKeeper />
      </body>
    </html>
  );
}
