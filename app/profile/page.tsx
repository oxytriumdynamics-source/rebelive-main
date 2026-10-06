"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileStage from "@/components/profile/ProfileStage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMe } from "@/store/slices/authslice";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Hydrate auth token if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("rebelive_auth_token");
      if (token && !isAuthenticated) {
        dispatch(getMe());
      }
    }
  }, [dispatch, isAuthenticated]);

  // If not authenticated and finished initial check, redirect to /auth
  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken") || localStorage.getItem("rebelive_auth_token")
          : null;
      if (!token) {
        router.replace("/auth");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || (!user && !isAuthenticated)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#090909] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-white/50">
            AUTHENTICATING REBEL ACCESS…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white pt-24 sm:pt-32 pb-16 px-4 max-w-6xl mx-auto">
      <ProfileStage user={user} />
    </div>
  );
}
