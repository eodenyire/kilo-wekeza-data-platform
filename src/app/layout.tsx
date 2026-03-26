import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wekeza Data Platform",
    template: "%s | Wekeza Data Platform",
  },
  description:
    "From Data Silos to Global Intelligence — An end-to-end enterprise data ecosystem with 10 integrated intelligence tools",
  keywords: [
    "data platform",
    "data lineage",
    "data quality",
    "fraud detection",
    "ML monitoring",
    "data integration",
    "enterprise data",
    "data intelligence",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wekeza Data Platform",
    title: "Wekeza Data Platform",
    description:
      "From Data Silos to Global Intelligence — An end-to-end enterprise data ecosystem",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wekeza Data Platform",
    description:
      "From Data Silos to Global Intelligence — An end-to-end enterprise data ecosystem",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
