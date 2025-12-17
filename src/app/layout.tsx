import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import App from "./_app";
import Toast from "@/components/Toast";
import { CookieConsent } from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiverseGPT - Multi-Persona AI Chat Platform",
  description: "Chat with multiple customizable AI personas simultaneously. Control their identities, behaviors, and perspectives for rich, diverse conversations.",
  keywords: "AI chat, multiple personas, chatbot customization, artificial intelligence, conversational AI, AI personality, chat assistant",
  authors: [{ name: "DiverseGPT" }],
  alternates: {
    canonical: "https://diversegpt.pro",
  },
  openGraph: {
    title: "DiverseGPT - Multi-Persona AI Chat Platform",
    description: "Chat with multiple customizable AI personas simultaneously. Control their identities, behaviors, and perspectives for rich, diverse conversations.",
    type: "website",
    siteName: "DiverseGPT",
    locale: "sv_SE",
  },
  twitter: {
    card: "summary_large_image",
    title: "DiverseGPT - Multi-Persona AI Chat Platform",
    description: "Chat with multiple customizable AI personas simultaneously. Control their identities, behaviors, and perspectives for rich, diverse conversations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "hsl(0, 0%, 13%)",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 text-base-content`}
      >
        <App>{children}</App>
        <Toast />
        <CookieConsent />
        <script
            defer
            data-domain="diversegpt.pro"
            src="https://analytics.wepco.se/js/script.js"
          ></script>
      </body>
    </html>
  );
}
