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
      // Check if backend API is configured & reachable
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      try {
        const res = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(creds),
        });
        if (res.ok) {
          const data = await res.json();
          const token = data.data?.accessToken || data.token || "rebel-session-live";
          const loggedUser = data.data?.user || data.user;
          saveToken(token);
          saveStoredUser(loggedUser);
          setAccessToken(token);
          setUser(loggedUser);
          setLoading(false);
          return true;
        }
      } catch {
        // Backend not reachable, proceed with local authenticated session
      }

      // Local interactive mock login
      const nameParts = creds.email.split("@")[0].split(".");
      const first = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : "Rebel";
      const last = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : "Operator";

      const newUser: AuthUser = {
        ...DEMO_USER,
        id: `REBEL-${Math.floor(1000 + Math.random() * 9000)}`,
        email: creds.email,
        firstName: first,
        lastName: last,
        createdAt: new Date().toISOString(),
      };

      const token = `token-${Date.now()}`;
      saveToken(token);
      saveStoredUser(newUser);
      setAccessToken(token);
      setUser(newUser);
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
      // Try backend if running
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      try {
        const res = await fetch(`${apiBase}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          setOtpSent(true);
          setLoading(false);
          return true;
        }
      } catch {
        // Backend offline
      }

      // Local mock: set temporary registered profile awaiting OTP
      const pendingUser: AuthUser = {
        ...DEMO_USER,
        id: `REBEL-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: data.firstName || "Rebel",
        lastName: data.lastName || "Operator",
        email: data.email,
        phone: data.phone || null,
        emailVerified: false,
      };
      saveStoredUser(pendingUser);
      setUser(pendingUser);
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
    setOtpSent(true);
    return true;
  };

  const verifyOtp = async (data: { email: string; otp: string }) => {
    setOtpVerifying(true);
    setOtpError(null);
    try {
      // Simulate quick verification latency
      await new Promise((r) => setTimeout(r, 600));

      if (data.otp.length !== 6) {
        setOtpError("Please enter a valid 6-digit verification code");
        setOtpVerifying(false);
        return false;
      }

      const activeUser = user || readStoredUser() || DEMO_USER;
      const verifiedUser: AuthUser = {
        ...activeUser,
        email: data.email || activeUser.email,
        emailVerified: true,
      };

      const token = `token-${Date.now()}`;
      saveToken(token);
      saveStoredUser(verifiedUser);
      setAccessToken(token);
      setUser(verifiedUser);
      setOtpVerifying(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Code verification failed";
      setOtpError(msg);
      setOtpVerifying(false);
      return false;
    }
  };

  const logoutUser = async () => {
    clearToken();
    clearStoredUser();
    setUser(null);
    setAccessToken(null);
    setOtpSent(false);
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

    const target = personaMap[s] || personaMap.apex;
    const base = user || readStoredUser() || DEMO_USER;

    const updatedUser: AuthUser = {
      ...base,
      preferences: {
        id: `pref-${s}`,
        userId: base.id,
        personalityTypeId: target.id,
        personalityType: {
          id: target.id,
          name: target.name,
          slug: s,
          cardImage: `/brand/${target.name}.png`,
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
