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
  onSelectTab: (tab: "overview" | "details" | "orders" | "addresses") => void;
  orderCount?: number;
  addressCount?: number;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.477-.15-.678.15-.2.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.8-1.501-1.788-1.677-2.089-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.123 3.242 5.143 4.547.718.311 1.279.497 1.716.636.721.23 1.377.197 1.896.12.578-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.351zM12.004 2C6.48 2 2 6.48 2 12c0 1.944.557 3.76 1.524 5.301L2 22l4.832-1.488C8.307 21.365 10.096 22 12.004 22 17.524 22 22 17.52 22 12s-4.476-10-9.996-10zm0 18.257c-1.684 0-3.245-.516-4.545-1.401l-.326-.222-2.884.888.895-2.809-.244-.344c-.985-1.385-1.508-3.031-1.508-4.769 0-4.662 3.794-8.457 8.612-8.457 4.817 0 8.611 3.795 8.611 8.457 0 4.663-3.794 8.657-8.611 8.657z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0-.02-3.38 1.69 1.69 0 0 0 .02 3.38zM5.07 18.5h2.77v-8.37H5.07v8.37z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

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

          {/* Quick Access Dossier: Orders & Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSelectTab("orders")}
              className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-black transition-all">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Consignments
                  </p>
                  <p className="font-mono text-[10px] text-white/50">
                    {orderCount} {orderCount === 1 ? "order" : "orders"} placed
                  </p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("addresses")}
              className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-black transition-all">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Saved Addresses
                  </p>
                  <p className="font-mono text-[10px] text-white/50">
                    {addressCount} {addressCount === 1 ? "destination" : "destinations"} saved
                  </p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Social Channels - Monochrome */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 mb-3">
              Official Frequency Channels
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href="https://www.instagram.com/rebelive.official?stkn=aTMyZWJ1N2lqZmht"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 font-mono text-[9.5px] uppercase tracking-wider text-white/70 hover:bg-white hover:text-black transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors shrink-0" />
                <span>Instagram</span>
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb3HB0Y0G0XdgDS5NL1L"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 font-mono text-[9.5px] uppercase tracking-wider text-white/70 hover:bg-white hover:text-black transition-all"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors shrink-0" />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://www.linkedin.com/company/rebelive/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 font-mono text-[9.5px] uppercase tracking-wider text-white/70 hover:bg-white hover:text-black transition-all"
              >
                <LinkedInIcon className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors shrink-0" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.facebook.com/share/1cjZ7Lqgbe/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 font-mono text-[9.5px] uppercase tracking-wider text-white/70 hover:bg-white hover:text-black transition-all"
              >
                <FacebookIcon className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors shrink-0" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
