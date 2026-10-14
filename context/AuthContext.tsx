"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  AuthUser,
  DEMO_USER,
  readToken,
  saveToken,
  clearToken,
  readStoredUser,
  saveStoredUser,
  clearStoredUser,
} from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerifying: boolean;
  otpError: string | null;
  loginUser: (creds: { email: string; password?: string }) => Promise<boolean>;
  registerUser: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
  }) => Promise<boolean>;
  sendOtp: (email: string) => Promise<boolean>;
  verifyOtp: (data: { email: string; otp: string }) => Promise<boolean>;
  forgotPasswordRequest: (email: string) => Promise<boolean>;
  forgotPasswordVerify: (data: { email: string; otp: string; newPassword: string }) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  claimPersona: (slug: string) => void;
  clearError: () => void;
  setDemoMode: (personaSlug?: "apex" | "capella" | "aviva") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Hydrate on mount
  useEffect(() => {
    try {
      const storedToken = readToken();
      const storedUser = readStoredUser();

      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(storedUser);
      }
    } catch (e) {
      console.error("Failed to hydrate auth state:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setOtpError(null);
  }, []);

  const loginUser = async (creds: { email: string; password?: string }) => {
    setLoading(true);
    clearError();
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg =
          data.message ||
          (Array.isArray(data.errors) && data.errors[0]?.message) ||
          "Invalid email or password.";
        throw new Error(errorMsg);
      }

      const token = data.data?.accessToken || data.token;
      const loggedUser = data.data?.user || data.user;
      if (!token || !loggedUser) {
        throw new Error("Invalid authentication response from server.");
      }

      saveToken(token);
      saveStoredUser(loggedUser);
      setAccessToken(token);
      setUser(loggedUser);
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg);
      setLoading(false);
      return false;
    }
  };

  const registerUser = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
  }) => {
    setLoading(true);
    clearError();
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg =
          resData.message ||
          (Array.isArray(resData.errors) && resData.errors[0]?.message) ||
          "Registration failed.";
        throw new Error(errorMsg);
      }

      setOtpSent(true);
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      setLoading(false);
      return false;
    }
  };

  const sendOtp = async (email: string) => {
    clearError();
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOtpError(resData.message || "Failed to send verification code.");
        return false;
      }
      setOtpSent(true);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send code";
      setOtpError(msg);
      return false;
    }
  };

  const verifyOtp = async (data: { email: string; otp: string }) => {
    setOtpVerifying(true);
    setOtpError(null);
    try {
      if (!data.otp || data.otp.trim().length !== 6) {
        setOtpError("Please enter a valid 6-digit verification code");
        setOtpVerifying(false);
        return false;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp: data.otp.trim() }),
      });
      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg =
          resData.message ||
          (Array.isArray(resData.errors) && resData.errors[0]?.message) ||
          "Verification failed. Invalid or expired code.";
        throw new Error(errorMsg);
      }

      const token = resData.data?.accessToken;
      const verifiedUser = resData.data?.user;
      if (token && verifiedUser) {
        saveToken(token);
        saveStoredUser(verifiedUser);
        setAccessToken(token);
        setUser(verifiedUser);
      }
      setOtpVerifying(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Code verification failed";
      setOtpError(msg);
      setOtpVerifying(false);
      return false;
    }
  };

  const forgotPasswordRequest = async (email: string): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/auth/forgot-password-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to request password reset code");
      }
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to request code";
      setError(msg);
      setLoading(false);
      return false;
    }
  };

  const forgotPasswordVerify = async (data: { email: string; otp: string; newPassword: string }): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/auth/forgot-password-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Verification failed");
      }
      const token = resData.data?.accessToken;
      const loggedUser = resData.data?.user;
      if (token && loggedUser) {
        saveToken(token);
        saveStoredUser(loggedUser);
        setAccessToken(token);
        setUser(loggedUser);
      }
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Password reset failed";
      setError(msg);
      setLoading(false);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      await fetch(`${apiBase}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: "include",
      }).catch(() => {});
    } finally {
      clearToken();
      clearStoredUser();
      setUser(null);
      setAccessToken(null);
      setOtpSent(false);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  };

  const claimPersona = (slug: string) => {
    const s = slug.toLowerCase();
    const personaMap: Record<string, { id: string; name: string; color: string; desc: string; tagline: string; traits: string[] }> = {
      apex: {
        id: "APEX",
        name: "APEX",
        color: "#d8ac52",
        desc: "You are Built to climb. Driven to go further. The peak isn't the end. It's proof you can go higher.",
        tagline: "Ascend Without Limits",
        traits: ["Relentless", "Summit Seeker", "High-Altitude Focus", "Zero Sugar"],
      },
      capella: {
        id: "CAPELLA",
        name: "CAPELLA",
        color: "#c8922a",
        desc: "Some paths aren't meant to be understood all at once. Keep moving. One day, it will all make sense.",
        tagline: "Navigate The Unknown",
        traits: ["Visionary", "Signal Reader", "Intuitive Precision", "Zero Bullshit"],
      },
      aviva: {
        id: "AVIVA",
        name: "AVIVA",
        color: "#e8628a",
        desc: "Every new chapter begins with a decision. Take the leap. The rest comes after.",
        tagline: "Ignite The Momentum",
        traits: ["Live Wire", "Unapologetic Energy", "Catalyst", "Botanical Intensity"],
      },
    };

    const base = user || readStoredUser();
    if (base?.preferences?.personalityType) {
      console.warn("Persona already allocated and locked.");
      return;
    }
    const target = personaMap[s] || personaMap.apex;
    const userToUpdate = base || DEMO_USER;

    const updatedUser: AuthUser = {
      ...userToUpdate,
      preferences: {
        id: `pref-${s}`,
        userId: userToUpdate.id,
        personalityTypeId: target.id,
        personalityType: {
          id: target.id,
          name: target.name,
          slug: s,
          cardImage: `/brand/${target.name}.webp`,
          colorHex: target.color,
          description: target.desc,
          tagline: target.tagline,
          traits: target.traits,
        },
      },
    };

    saveStoredUser(updatedUser);
    setUser(updatedUser);
  };

  const setDemoMode = (personaSlug: "apex" | "capella" | "aviva" = "apex") => {
    const token = "demo-rebel-access-key";
    saveToken(token);
    setAccessToken(token);
    claimPersona(personaSlug);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        loading,
        error,
        otpSent,
        otpVerifying,
        otpError,
        loginUser,
        registerUser,
        sendOtp,
        verifyOtp,
        forgotPasswordRequest,
        forgotPasswordVerify,
        logoutUser,
        claimPersona,
        clearError,
        setDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
