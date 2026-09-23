import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OA Helper · Real OA questions from this placement season",
  description: "Real questions from this season's OAs, shared by students who just sat them. Practise what companies are asking right now, before your drive.",
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
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
