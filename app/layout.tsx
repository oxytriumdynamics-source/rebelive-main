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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rebelive.com'),
  title: {
    default: 'REBELIVE | Wake. Fuel. Rebel.',
    template: '%s | REBELIVE',
  },
  description:
    'Discover Rebelive, functional beverages (nutraceuticals) designed to support energy, focus, gut health, and stress management.',
  keywords: [
    'REBELIVE',
    'functional beverages',
    'nutraceuticals',
    'Nutrition as a Lifestyle',
    'energy',
    'focus',
    'gut health',
    'stress management',
    'clean caffeine',
    'zero sugar',
    'nootropics',
    'apex energy drink',
    'capella energy drink',
    'aviva energy drink',
  ],
  authors: [{ name: 'REBELIVE', url: 'https://www.rebelive.com' }],
  creator: 'REBELIVE',
  publisher: 'Oxytrium Dynamics Private Limited',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'REBELIVE | Wake. Fuel. Rebel.',
    description:
      'Discover Rebelive, functional beverages (nutraceuticals) designed to support energy, focus, gut health, and stress management.',
    url: 'https://www.rebelive.com',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'REBELIVE | Wake. Fuel. Rebel.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REBELIVE | Wake. Fuel. Rebel.',
    description:
      'Discover Rebelive, functional beverages (nutraceuticals) designed to support energy, focus, gut health, and stress management.',
    images: ['/brand/rebelive-og.png'],
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
                  "@id": "https://www.rebelive.com/#organization",
                  "name": "REBELIVE",
                  "legalName": "Oxytrium Dynamics Private Limited",
                  "url": "https://www.rebelive.com",
                  "logo": "https://www.rebelive.com/brand/rebelive-insignia.png",
                  "description": "Discover Rebelive, functional beverages (nutraceuticals) designed to support energy, focus, gut health, and stress management.",
                  "slogan": "Nutrition as a Lifestyle.",
                  "sameAs": [
                    "https://www.instagram.com/rebelive.official",
                    "https://www.linkedin.com/company/rebelive/",
                    "https://www.facebook.com/share/1cjZqbe/"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.rebelive.com/#website",
                  "url": "https://www.rebelive.com",
                  "name": "REBELIVE",
                  "description": "Discover Rebelive, functional beverages (nutraceuticals) designed to support energy, focus, gut health, and stress management.",
                  "publisher": { "@id": "https://www.rebelive.com/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.rebelive.com/shop?q={search_term_string}",
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

