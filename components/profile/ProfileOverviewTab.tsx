"use client";

import React from "react";
import {
  Shield,
  Package,
  MapPin,
  ExternalLink,
  Zap,
  CheckCircle2,
} from "lucide-react";
import MemberCard from "./MemberCard";
import { PERSONAS, PersonaProfile } from "@/data/personas";
import { AuthUser } from "@/store/slices/authslice";

interface ProfileOverviewTabProps {
  user: AuthUser;
  persona: PersonaProfile | null;
  personaSlug: string;
  accentColor?: string;
  onSelectTab: (tab: "overview" | "details" | "addresses" | "orders") => void;
  orderCount?: number;
  addressCount?: number;
}

export default function ProfileOverviewTab({
  user,
  persona,
  personaSlug,
  accentColor = "#ffffff",
  onSelectTab,
  orderCount = 0,
  addressCount = 0,
}: ProfileOverviewTabProps) {
  const memberName = `${user.firstName || "Rebel"} ${user.lastName || "Operator"}`.trim();

  return (
    <div className="space-y-8">
     

      {/* Main 2-Column Section: Card on Left, Dossier Details on Right */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">
        {/* Left: Holographic 3D Member Card */}
        <div className="flex flex-col items-center shrink-0 w-full max-w-[320px]">
          {persona ? (
            <>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">
                Holographic Rebel Pass
              </p>
              <MemberCard persona={persona} memberName={memberName} rebelId={user.rebelId || user.id} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center w-full min-h-[360px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
                <Shield className="h-6 w-6 text-white/60" />
              </div>
              <div>
                <p className="font-display text-base uppercase text-white font-bold">Rebel Pass Active</p>
                <p className="mt-1.5 font-mono text-[10px] text-white/50">
                  Verified operator credentials assigned.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Dossier Details & Calibrated Attributes */}
        <div className="flex-1 w-full space-y-5">
          {/* Persona Synopsis & Traits */}
          {persona && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 space-y-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 mb-1">
                  Active Designation
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  {persona.name} — {persona.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed mt-2">
                  {persona.description}
                </p>
              </div>

              {/* Traits Pills - Pure Monochrome */}
              <div>
                <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/40 mb-2.5">
                  Calibrated Attributes
                </p>
                <div className="flex flex-wrap gap-2">
                  {(user.preferences?.personalityType?.traits ?? [
                    "DISCIPLINED",
                    "VISIONARY",
                    "UNCOMPROMISING",
                    "RELENTLESS",
                  ]).map((trait) => (
                    <span
                      key={trait}
                      className="rounded-full px-3.5 py-1 font-mono text-[9px] uppercase tracking-wider border border-white/15 bg-white/[0.04] text-white/80"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Channels - Monochrome */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 mb-3">
              Official Frequency Channels
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <a
                href="https://www.instagram.com/rebelive.official?stkn=aTMyZWJ1N2lqZmht"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 font-mono text-[9.5px] uppercase tracking-wider text-white/70 hover:bg-white hover:text-black transition-all"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/rebelive/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 font-mono text-[9.5px] uppercase tracking-wider text-white/70 hover:bg-white hover:text-black transition-all"
              >
                LinkedIn
              </a>
              <a
                href="https://www.facebook.com/share/1cjZ7Lqgbe/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 font-mono text-[9.5px] uppercase tracking-wider text-white/70 hover:bg-white hover:text-black transition-all"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
