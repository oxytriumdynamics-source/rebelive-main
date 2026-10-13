import type { Metadata } from "next";
import AuthPageShell from "@/components/auth/AuthPageShell";

export const metadata: Metadata = {
  title: "Operator Login & Access | REBELIVE",
  description: "Sign in or create your REBELIVE account. Lock in your Rebel ID, manage cold delivery subscriptions, and track orders.",
  alternates: {
    canonical: "/auth",
  },
  openGraph: {
    title: "Access REBELIVE | Operator Portal",
    description: "Lock in your verified Rebel ID and manage orders.",
    url: "https://rebelive.com/auth",
    siteName: "REBELIVE",
  },
};

export default function AuthPage() {
  return <AuthPageShell />;
}
