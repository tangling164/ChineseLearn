import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { generateWebSiteStructuredData } from "@/lib/seo";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Chinese101 - Learn Chinese Typing & Master Pinyin Input",
    template: "%s | Chinese101",
  },
  description: "Master Chinese typing with our interactive course. Learn Pinyin input, practice with high-frequency words, and improve your Chinese typing skills through gamified lessons. Perfect for HSK exam preparation.",
  keywords: [
    "Chinese typing",
    "Chinese keyboard",
    "Pinyin input",
    "Learn Chinese",
    "HSK exam",
    "Chinese course",
    "Typing course",
    "Chinese characters",
    "Interactive Chinese lessons",
    "Language learning",
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
    url: defaultUrl,
    title: "Chinese101 - Learn Chinese Typing & Master Pinyin Input",
    description: "Master Chinese typing with our interactive course. Learn Pinyin input, practice with high-frequency words, and improve your Chinese typing skills through gamified lessons.",
    siteName: "Chinese101",
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Chinese101 - Learn Chinese Typing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chinese101 - Learn Chinese Typing & Master Pinyin Input",
    description: "Master Chinese typing with our interactive course. Learn Pinyin input, practice with high-frequency words, and improve your Chinese typing skills through gamified lessons.",
    images: [`${defaultUrl}/og-image.png`],
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
    canonical: defaultUrl,
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
