import React from "react";
import Link from "next/link";
import {
  Shield,
  Package,
  MapPin,
  ExternalLink,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Compass,
  ArrowRight,
} from "lucide-react";
import MemberCard from "./MemberCard";
import { PERSONAS, PersonaProfile } from "@/data/personas";
import { AuthUser } from "@/store/slices/authslice";

interface ProfileOverviewTabProps {
  user: AuthUser;
  persona: PersonaProfile | null;
  personaSlug?: string | null;
  accentColor?: string;
  onSelectTab: (tab: "overview" | "details" | "orders") => void;
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
      {/* Phone Link Banner for Instant Checkout & Past Order Sync */}
      {!user.phone && (
        <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shrink-0" />
            <div>
              <p className="font-bold text-white uppercase tracking-wider">Link Mobile Number</p>
              <p className="text-[11px] text-white/60 font-sans mt-0.5">
                Connect your phone to sync past orders placed via Fastrr and enable 1-Click Instant Checkout.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab("details")}
            className="py-2 px-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-[11px] uppercase tracking-wider shrink-0 transition-all cursor-pointer"
          >
            Link Phone Now
          </button>
        </div>
      )}

      {/* Main 2-Column Section: Card on Left, Dossier Details on Right */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">
        {/* Left: Holographic 3D Member Card or Uncalibrated Invitation */}
        <div className="flex flex-col items-center shrink-0 w-full max-w-[320px]">
          {persona ? (
            <>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">
                Holographic Rebel Pass
              </p>
              <MemberCard persona={persona} memberName={memberName} rebelId={user.rebelId || user.id} />
              
              {/* Permanent Allocation Badge */}
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono text-[9px] uppercase tracking-wider">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                <span>ARCHETYPE LOCKED · PERMANENT ALLOCATION</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-between gap-5 rounded-3xl border border-dashed border-white/20 bg-white/[0.02] hover:border-white/35 p-7 text-center w-full min-h-[380px] transition-all">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-[9px] uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>1 CALIBRATION REMAINING</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 my-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/10 shadow-inner">
                  <Compass className="h-8 w-8 text-white/80 animate-pulse" />
                </div>
                <div>
                  <p className="font-display text-lg uppercase text-white font-bold tracking-tight">Archetype Uncalibrated</p>
                  <p className="mt-1 font-mono text-[10.5px] text-white/50 leading-relaxed max-w-[240px]">
                    Discover whether your operator persona aligns with Apex, Capella, or Aviva.
                  </p>
                </div>
              </div>

              <Link
                href="/persona"
                className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
              >
                <span>Calibrate Persona</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right: Dossier Details & Calibrated Attributes */}
        <div className="flex-1 w-full space-y-5">
          {/* Persona Synopsis & Traits */}
          {persona ? (
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
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                  Designation Status
                </p>
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Pending Calibration
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                Unlock Your Rebel Identity
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
                Complete the 5-question calibration quiz to unlock your official Holographic Rebel ID Pass and persona designation (Apex, Capella, or Aviva).
              </p>
              <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 text-[10.5px] font-mono text-white/60 space-y-1">
                <p className="text-white font-semibold flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Protocol Policy:</span>
                </p>
                <p>Persona allocation is restricted to <strong className="text-white">one-time only</strong>. Once your archetype is calibrated, it is locked to your account permanently.</p>
              </div>
              <Link
                href="/persona"
                className="inline-flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider hover:underline pt-1"
              >
                <span>Take Archetype Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
