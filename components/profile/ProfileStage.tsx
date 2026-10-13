"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  MapPin,
  Package,
  Shield,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import EverestPattern from "@/components/persona/EverestPattern";
import { PERSONAS } from "@/data/personas";
import { AuthUser, logoutUser } from "@/store/slices/authslice";
import { formatRebelId } from "@/lib/auth";
import { fetchOrders, fetchAddresses } from "@/lib/profileApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ProfileOverviewTab from "./ProfileOverviewTab";
import ProfileOrdersTab from "./ProfileOrdersTab";
import ProfileAddressesTab from "./ProfileAddressesTab";
import ProfileDetailsTab from "./ProfileDetailsTab";

const MONO = "JetBrains Mono, Courier New, monospace";
const DISPLAY = "'Code Next', Anton, 'Arial Narrow', sans-serif";

const SLUG_TO_PERSONA: Record<string, keyof typeof PERSONAS> = {
  apex: "APEX",
  capella: "CAPELLA",
  aviva: "AVIVA",
};

export type ProfileTab = "overview" | "orders" | "addresses" | "details";

export default function ProfileStage({
  user: initialUser,
}: {
  user?: AuthUser | null;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduxUser = useAppSelector((s) => s.auth.user);

  const user = reduxUser || initialUser;

  // Active tab state from URL search params or default to "overview"
  const tabParam = searchParams?.get("tab") as ProfileTab | null;
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    tabParam && ["overview", "orders", "addresses", "details"].includes(tabParam)
      ? tabParam
      : "overview"
  );

  // Sync tab state when URL searchParams changes
  useEffect(() => {
    if (tabParam && ["overview", "orders", "addresses", "details"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Order & address counts for quick badges
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);

  // Notification toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [ords, addrs] = await Promise.all([fetchOrders(), fetchAddresses()]);
        setOrderCount(ords.length);
        setAddressCount(addrs.length);
      } catch (e) {
        console.error("Failed to load profile metrics:", e);
      }
    }
    loadStats();
  }, []);

  function handleNotify(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }

  function handleTabChange(tab: ProfileTab) {
    setActiveTab(tab);
    // Update URL query param without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url.toString());
  }

  async function handleLogout() {
    await dispatch(logoutUser());
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("rebelive_auth_token");
      sessionStorage.clear();
      window.location.href = "/";
    }
  }

  if (!user) return null;

  // Resolve Persona
  const personaSlug = user.preferences?.personalityType?.slug?.toLowerCase() || "apex";
  const personaKey = personaSlug ? SLUG_TO_PERSONA[personaSlug] || "APEX" : null;
  const persona = personaKey ? PERSONAS[personaKey] : null;

  const patternStroke = "#ffffff";
  const accentColor = "#ffffff";

  return (
    <div className="relative min-h-screen w-full flex flex-col pb-20 select-none">
      {/* Background matrix pattern */}
      <EverestPattern strokeColor={patternStroke} opacity={0.15} />

      {/* Floating Action Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 rounded-full border border-white/20 bg-black/95 px-5 py-2.5 shadow-2xl backdrop-blur-xl text-white font-mono text-xs"
          >
            <CheckCircle2 className="h-4 w-4 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Header Dossier Bar ── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
        <div>
          

          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white mt-1"
            style={{ fontFamily: DISPLAY }}
          >
            {user.firstName || "REBEL"} {user.lastName || "OPERATOR"}
          </h1>

          <div className="flex items-center gap-2 mt-1">
            <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
              REBEL ID: <span className="text-white font-bold tracking-wider">{formatRebelId(user.rebelId || user.id)}</span> · {persona?.name || "APEX"} ARCHETYPE
            </p>
            <button
              type="button"
              id="copy-rebel-id-btn"
              onClick={() => {
                const code = formatRebelId(user.rebelId || user.id);
                navigator.clipboard?.writeText(code);
                setToastMessage("REBEL ID COPIED");
                setTimeout(() => setToastMessage(null), 2500);
              }}
              title="Copy Rebel ID"
              className="flex items-center gap-1 rounded px-1.5 py-0.5 border border-white/10 bg-white/[0.04] hover:bg-white/10 text-white/50 hover:text-white transition-all text-[8.5px] font-mono cursor-pointer"
            >
              <Copy className="h-2.5 w-2.5" />
              <span>COPY</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Sign Out Button */}
          <button
            type="button"
            id="profile-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-4 py-1.5 font-mono text-[9.5px] uppercase tracking-wider text-white/80 hover:bg-white hover:text-black transition-all cursor-pointer"
            style={{ fontFamily: MONO }}
          >
            <LogOut className="h-3 w-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ── Interactive Tab Bar ── */}
      <div className="relative z-10 flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 mb-8 [scrollbar-width:none]">
        {[
          { id: "overview", label: "Overview", icon: Shield },
          { id: "orders", label: `Orders (${orderCount})`, icon: Package },
          { id: "addresses", label: `Addresses (${addressCount})`, icon: MapPin },
          { id: "details", label: "Personal Details", icon: User },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id as ProfileTab)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-[10.5px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-white text-black shadow-lg shadow-white/10 ring-1 ring-white/50"
                  : "border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]"
              }`}
              style={{ fontFamily: MONO }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Views with AnimatePresence ── */}
      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileOverviewTab
                user={user}
                persona={persona}
                personaSlug={personaSlug}
                accentColor={accentColor}
                onSelectTab={handleTabChange}
                orderCount={orderCount}
                addressCount={addressCount}
              />
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="tab-orders"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileOrdersTab
                accentColor={accentColor}
                onNotify={handleNotify}
              />
            </motion.div>
          )}

          {activeTab === "addresses" && (
            <motion.div
              key="tab-addresses"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileAddressesTab
                accentColor={accentColor}
                onNotify={handleNotify}
              />
            </motion.div>
          )}

          {activeTab === "details" && (
            <motion.div
              key="tab-details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileDetailsTab
                user={user}
                accentColor={accentColor}
                onNotify={handleNotify}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
