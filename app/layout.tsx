import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OA Helper · Real OA questions from this placement season",
  description:
    "Real questions from this season's OAs, shared by students who just sat them. Practise what companies are asking right now, before your drive.",
  metadataBase: new URL("https://oahelper.in"),
  openGraph: {
    title: "Your next OA is closer than you think.",
    description: "Real questions from this season's OAs, shared by students who just sat them.",
    url: "https://oahelper.in",
    siteName: "OA Helper",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Inter (variable, 300–800) carries the whole page; Instrument Serif sets the italic accent words. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300..800&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
