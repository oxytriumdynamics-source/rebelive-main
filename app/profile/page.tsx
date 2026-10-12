"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import ProfileStage from "@/components/profile/ProfileStage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMe } from "@/store/slices/authslice";
import { useAuth } from "@/context/AuthContext";

function ProfileContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxAuth = useAppSelector((s) => s.auth);
  const authCtx = useAuth();

  const user = reduxAuth.user || authCtx.user;
  const isAuthenticated = reduxAuth.isAuthenticated || authCtx.isAuthenticated;
  const loading = reduxAuth.loading && authCtx.loading;

  // Hydrate auth token if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("rebelive_auth_token");
      if (token && !reduxAuth.isAuthenticated) {
        dispatch(getMe());
      }
    }
  }, [dispatch, reduxAuth.isAuthenticated]);

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
      <div className="fixed inset-0 flex items-center justify-center bg-[#090909] text-white z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
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

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[#090909] text-white">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

