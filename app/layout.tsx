import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { palette } from "@/content/tokens";
import { serviceJsonLd, site } from "@/content/site";
import { Cursor } from "@/components/Cursor";
import { FilmGrain } from "@/components/FilmGrain";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.meta.title,
    template: `%s · ${site.name}`,
  },
  description: site.meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.meta.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: palette.ink800,
  width: "device-width",
  initialScale: 1,
};

const bootScript = `try{var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;var seen=sessionStorage.getItem("kinocut-intro-seen");document.documentElement.classList.add("js");document.documentElement.classList.remove("no-js");if(reduce||seen){document.documentElement.dataset.intro="done";document.documentElement.dataset.skipIntro="1";}else{document.documentElement.dataset.intro="play";}}catch(e){document.documentElement.dataset.intro="done";document.documentElement.dataset.skipIntro="1";}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} no-js`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/videos/hero-poster.jpg" fetchPriority="high" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SmoothScroll />
        <FilmGrain />
        <Cursor />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar />
        {children}
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd()) }} />
      </body>
    </html>
  );
}
