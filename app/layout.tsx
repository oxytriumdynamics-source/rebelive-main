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
import { WebVitalsReporter } from "@/components/ui/WebVitalsReporter";
import GlobalHalftoneBackground from "@/components/effects/GlobalHalftoneBackground";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "REBELIVE - Wake. Fuel. Rebel.",
  description: "Pure Bio-Energy. Zero Bullshit. Engineered Without Compromise.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
      </head>
      <body className="min-h-full flex flex-col antialiased bg-black text-white" suppressHydrationWarning>
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
              <WebVitalsReporter />
            </SmoothScroll>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

