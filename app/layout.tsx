import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Poppins, Protest_Revolution, Barlow_Condensed, Bebas_Neue } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const protestRevolution = Protest_Revolution({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-protest-revolution",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});

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
    default: 'REBELIVE | Wake. Fuel. Rebel. - Functional Beverages & Clean Energy Drinks India',
    template: '%s | REBELIVE',
  },
  description:
    'REBELIVE is India’s premium modern functional beverage brand. Zero added sugar, clean caffeine, L-theanine, ashwagandha, prebiotics & probiotics for sustained focus, gut health, and stress relief. Wake. Fuel. Rebel.',
  keywords: [
    'REBELIVE',
    'Apex',
    'Capella',
    'Aviva',
    'Wake fuel rebel',
    'REBELIVE drinks',
    'REBELIVE beverages',
    'REBELIVE functional drinks',
    'REBELIVE functional beverages',
    'REBELIVE India',
    'buy REBELIVE online',
    'REBELIVE price',
    'REBELIVE ingredients',
    'REBELIVE nutrition facts',
    'REBELIVE Apex',
    'REBELIVE Aviva',
    'REBELIVE Capella',
    'Apex by REBELIVE',
    'Aviva by REBELIVE',
    'Capella by REBELIVE',
    'REBELIVE wellness brand',
    'REBELIVE beverage startup',
    'REBELIVE Indian beverage brand',
    'REBELIVE premium beverage brand',
    'REBELIVE modern beverage brand',
    'REBELIVE lifestyle brand',
    'REBELIVE better for you drinks',
    'REBELIVE clean label beverages',
    'REBELIVE zero added sugar beverage',
    'REBELIVE focus beverage brand',
    'REBELIVE gut health beverage brand',
    'REBELIVE natural caffeine',
    'REBELIVE brand identity',
    'REBELIVE Wake Fuel Rebel',
    'REBELIVE Rebel Syndicate',
    'functional drinks',
    'functional beverages India',
    'functional beverage brand',
    'zero added sugar drinks',
    'better for you beverages',
    'healthy carbonated drinks',
    'healthy alternatives to soda',
    'science backed functional drinks',
    'functional drinks for everyday use',
    'modern wellness beverages',
    'premium functional drinks India',
    'functional beverage market India',
    'innovative beverage brands India',
    'carbonated functional drinks',
    'ready to drink wellness beverages',
    'nutritional beverages for daily wellness',
    'canned beverage brands India',
    'functional beverage brands India',
    'better for you beverage brands',
    'low sugar beverage brands India',
    'beverage brands in India',
    'best packaged drinks',
    'healthy drinks',
    'healthy drinks in India',
    'healthy packaged drinks',
    'non alcoholic beverages',
    'non alcoholic drinks',
    'beverages in India',
    'popular drinks in India',
    'best cold drinks',
    'best canned drinks',
    'new beverage brands',
    'premium drinks',
    'drinks delivery online',
    'next generation beverages',
    'Nutrition as a Lifestyle',
  ],
  authors: [{ name: 'REBELIVE', url: 'https://www.rebelive.com' }],
  creator: 'REBELIVE',
  publisher: 'Oxytrium Dynamics Private Limited',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'REBELIVE | Wake. Fuel. Rebel. - Functional Beverages & Clean Energy Drinks India',
    description:
      'REBELIVE is India’s premium modern functional beverage brand. Zero added sugar, clean caffeine, L-theanine, ashwagandha, prebiotics & probiotics for sustained focus, gut health, and stress relief.',
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
    title: 'REBELIVE | Wake. Fuel. Rebel. - Functional Beverages & Clean Energy Drinks India',
    description:
      'REBELIVE is India’s premium modern functional beverage brand. Zero added sugar, clean caffeine, L-theanine, ashwagandha, prebiotics & probiotics for sustained focus, gut health, and stress relief.',
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
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${protestRevolution.variable} ${barlowCondensed.variable} ${bebasNeue.variable} h-full antialiased bg-black text-white`}
      suppressHydrationWarning
    >
      <head>
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
        {/* Shiprocket Checkout (SRC / Fastrr) Lazy Script - dynamic CSS is loaded on checkout invocation */}
        <Script
          src="https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js"
          strategy="lazyOnload"
        />
        {/* Meta Pixel Code */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2046038449443933');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2046038449443933&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
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

