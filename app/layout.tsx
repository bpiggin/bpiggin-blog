import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const vercetti = localFont({
  src: "./fonts/Vercetti-Regular.woff2",
  variable: "--font-vercetti",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bpiggin.com"),
  title: "Ben Piggin",
  description: "Founding Engineer at Jack & Jill",
  openGraph: {
    title: "Ben Piggin",
    description: "Founding Engineer at Jack & Jill",
    url: "https://www.bpiggin.com",
    siteName: "Ben Piggin",
    images: [
      {
        url: "/day_final.png",
        width: 1672,
        height: 941,
        alt: "Ben Piggin",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ben Piggin",
    description: "Founding Engineer at Jack & Jill",
    images: ["/day_final.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const themeScript = `
(function () {
  try {
    document.documentElement.classList.remove("dark");
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vercetti.variable} ${vercetti.className} h-dvh select-none overflow-hidden antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/day_final.png" as="image" />
        <link rel="preload" href="/daytime_vid.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/sunset_final.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/sunrise_final.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/nighttime_vid.mp4" as="video" type="video/mp4" />
      </head>
      <body className="h-dvh overflow-hidden font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
