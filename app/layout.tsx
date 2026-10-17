import type { Metadata, Viewport } from "next";
/* Poppins - body font (self-hosted via @fontsource, zero CDN latency) */
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";

import GlobalHalftoneBackground from "@/components/effects/GlobalHalftoneBackground";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rebelive.com'),
  title: {
    default: 'REBELIVE | Wake. Fuel. Rebel.',
    template: '%s | REBELIVE',
  },
  description:
    'Engineered Bio-Energy for relentless focus, physical endurance, and clean vitality. Zero sugar, clean caffeine, functional nootropics. Built without compromise.',
  keywords: [
    'REBELIVE',
    'clean energy drink',
    'bio-energy',
    'nootropic energy drink',
    'zero sugar energy drink',
    'natural caffeine',
    'apex energy drink',
    'capella energy drink',
    'aviva energy drink',
    'functional energy drink',
    'focus drink',
    'fitness energy drink',
  ],
  authors: [{ name: 'REBELIVE Labs', url: 'https://rebelive.com' }],
  creator: 'REBELIVE',
  publisher: 'Oxytrium Dynamics Private Limited',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'REBELIVE | Wake. Fuel. Rebel.',
    description:
      'Engineered Bio-Energy. Zero Sugar. Clean Functional Nootropics for peak human performance.',
    url: 'https://rebelive.com',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/APEX.webp',
        width: 1200,
        height: 630,
        alt: 'REBELIVE Bio-Energy Drink',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REBELIVE | Wake. Fuel. Rebel.',
    description: 'Engineered Bio-Energy. Zero Sugar. Clean Functional Nootropics.',
    images: ['/brand/APEX.webp'],
    creator: '@rebelive',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'beverage',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-black text-white" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/models/soda-can1.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/draco/gltf/draco_decoder.wasm" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/brand/podup.webp" as="image" type="image/webp" />
        <link rel="preload" href="/brand/poddown.webp" as="image" type="image/webp" />
        <link rel="preload" href="/products/apex.webp" as="image" type="image/webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://rebelive.com/#organization",
                  "name": "REBELIVE",
                  "legalName": "Oxytrium Dynamics Private Limited",
                  "url": "https://rebelive.com",
                  "logo": "https://rebelive.com/brand/REBELIVE%20Logo%20Black.webp",
                  "description": "Next-generation clean bio-energy beverage brand engineered without compromise.",
                  "sameAs": [
                    "https://www.instagram.com/rebelive.official",
                    "https://www.linkedin.com/company/rebelive/",
                    "https://www.facebook.com/share/1cjZ7Lqgbe/"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://rebelive.com/#website",
                  "url": "https://rebelive.com",
                  "name": "REBELIVE",
                  "publisher": { "@id": "https://rebelive.com/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://rebelive.com/shop?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            }).replace(/</g, '\\u003c'),
          }}
        />
        {/* Shiprocket Checkout (SRC / Fastrr) Stylesheet & Script (PRODUCTION) */}
        <link
          rel="stylesheet"
          href="https://checkout-ui.shiprocket.com/assets/styles/shopify.css"
        />
        <script
          src="https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js"
          async
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-black text-white" suppressHydrationWarning>
        {/* Shiprocket Checkout (SRC / Fastrr) Merchant Domain Identification */}
        <input
          type="hidden"
          id="sellerDomain"
          defaultValue={process.env.NEXT_PUBLIC_SELLER_DOMAIN || "rebelive.com"}
        />
        <StoreProvider>
          <AuthProvider>
            <SmoothScroll>
              <Suspense fallback={null}>
                <ScrollToTop />
              </Suspense>
              <Suspense fallback={null}>
                <GlobalHalftoneBackground />
              </Suspense>
              <AppShell>
                {children}
              </AppShell>
              <CartDrawer />
       
            </SmoothScroll>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

