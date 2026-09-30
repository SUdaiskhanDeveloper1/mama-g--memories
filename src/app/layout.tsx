import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk, Noto_Naskh_Arabic, Noto_Nastaliq_Urdu } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/data/site";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap", style: ["normal", "italic"], axes: ["opsz"] });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-naskh", display: "swap", preload: false });
const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-nastaliq", display: "swap", preload: false });

const DESC =
  "A living digital memorial and family archive for Col. (R) Dr. Muhammad Safdar Khan — Mamajee, Colonel Sahib — told through the memories of the people who knew him. English, اردو, پښتو.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "In Loving Memory of Col. (R) Dr. Muhammad Safdar Khan", template: "%s · In Loving Memory of Col. (R) Dr. Muhammad Safdar Khan" },
  description: DESC,
  openGraph: {
    type: "website",
    siteName: "In Loving Memory of Col. (R) Dr. Muhammad Safdar Khan",
    title: "In Loving Memory of Col. (R) Dr. Muhammad Safdar Khan",
    description: "“His religion was humanity, kindness his legacy.”",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#F7F3EA", width: "device-width", initialScale: 1 };

// Sets direction/language before first paint so RTL visitors never see a flash of LTR.
const boot = `document.documentElement.dataset.js='1';try{var l=localStorage.getItem('lang');if(l==='ur'||l==='ps'){var e=document.documentElement;e.lang=l;e.dir='rtl';e.dataset.ui=l}}catch(_){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${serif.variable} ${sans.variable} ${naskh.variable} ${nastaliq.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <LangProvider>
          <a className="skip" href="#main">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
