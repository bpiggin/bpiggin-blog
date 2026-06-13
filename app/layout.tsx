import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ben Piggin",
  description: "Personal website of Ben Piggin",
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
      className={`${hostGrotesk.variable} ${hostGrotesk.className} h-dvh select-none overflow-hidden antialiased`}
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
