import type { Metadata } from "next";
import AuthPageShell from "@/components/auth/AuthPageShell";

export const metadata: Metadata = {
  title: {
    absolute: "Sign up / Login | REBELIVE",
  },
  description: "Sign up or log in to your profile to manage your account and available order features.",
  alternates: {
    canonical: "/auth",
  },
  openGraph: {
    title: "Sign up / Login | REBELIVE",
    description: "Sign up or log in to your profile to manage your account and available order features.",
    url: "https://www.rebelive.com/auth",
    siteName: "REBELIVE",
    images: [
      {
        url: "/brand/rebelive-og.png",
        width: 1200,
        height: 630,
        alt: "Sign up / Login | REBELIVE",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign up / Login | REBELIVE",
    description: "Sign up or log in to your profile to manage your account and available order features.",
    images: ["/brand/rebelive-og.png"],
  },
};

export default function AuthPage() {
  return <AuthPageShell />;
}
