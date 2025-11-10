import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { generateWebSiteStructuredData } from "@/lib/seo";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://chinese101.app";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Chinese101 – Learn Chinese for Travel & Business",
    template: "%s | Chinese101",
  },
  description: "Quick and practical Chinese lessons for travelers and expats in China. Learn Mandarin phrases fast with our interactive typing course. Master Pinyin input and Chinese characters for real-world travel and business communication.",
  keywords: [
    "Learn Chinese",
    "Chinese travel",
    "Chinese business",
    "Chinese typing",
    "Mandarin lessons",
    "Chinese course online",
    "Pinyin input",
    "Travel Chinese",
    "Business Chinese",
    "Chinese for expats",
    "Learn Mandarin",
    "Chinese language course",
    "Interactive Chinese lessons",
    "Chinese phrases",
  ],
  authors: [{ name: "Chinese101 Team" }],
  creator: "Chinese101",
  publisher: "Chinese101",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chinese101.app",
    title: "Chinese101 – Learn Chinese for Travel & Business",
    description: "Quick and practical Chinese lessons for travelers and expats in China. Learn Mandarin phrases fast with our interactive typing course.",
    siteName: "Chinese101",
    images: [
      {
        url: "https://chinese101.app/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Chinese101 - Learn Chinese for Travel & Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chinese101 – Learn Chinese for Travel & Business",
    description: "Quick and practical Chinese lessons for travelers and expats. Master Pinyin and Chinese characters through interactive typing practice.",
    images: ["https://chinese101.app/og-cover.png"],
    creator: "@chinese101",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://chinese101.app",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.ico", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/favicon.ico", sizes: "180x180" }],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = generateWebSiteStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
