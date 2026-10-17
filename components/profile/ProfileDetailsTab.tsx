"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Lock,
  Check,
  AlertCircle,
} from "lucide-react";
import { AuthUser } from "@/store/slices/authslice";
import { changePassword } from "@/lib/profileApi";
import { updateProfileThunk } from "@/store/slices/profileSlice";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authslice";
import { formatRebelId } from "@/lib/auth";

interface ProfileDetailsTabProps {
  user: AuthUser;
  accentColor?: string;
  onNotify?: (msg: string) => void;
}

export default function ProfileDetailsTab({
  user,
  accentColor = "#ffffff",
  onNotify,
}: ProfileDetailsTabProps) {
  const dispatch = useAppDispatch();

  // Personal details state
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatarUrl] = useState(
    user.avatarUrl || "/brand/panther_white_icon-transparent.webp"
  );
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  async function handleSaveDetails(e: React.FormEvent) {
    e.preventDefault();
    setDetailsError(null);

    if (!firstName.trim()) {
      setDetailsError("First name is required.");
      return;
    }

    setDetailsSaving(true);
    try {
      const updated = await dispatch(
        updateProfileThunk({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || undefined,
        })
      ).unwrap();

      if (updated) {
        dispatch(setUser(updated));
      }
      if (onNotify) onNotify("Operator details saved successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save details.";
      setDetailsError(msg);
    } finally {
      setDetailsSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(newPassword);
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      if (onNotify) onNotify("Security passcode updated.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      setPasswordError(msg);
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <div className="pb-2 border-b border-white/10">
        <h2 className="font-display text-2xl font-bold tracking-tight uppercase text-white">
          Operator Credentials
        </h2>
        <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/50 mt-1">
          Identity Profile, Contact Channels & Defense Passcodes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Identifier */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 text-center space-y-4">
           

            <div className="relative mx-auto h-28 w-28 rounded-full border border-white/20 bg-black/80 p-1 shadow-[0_0_20px_rgba(255,255,255,0.06)] flex items-center justify-center overflow-hidden">
              <Image
                src={avatarUrl}
                alt={firstName}
                fill
                sizes="112px"
                unoptimized={Boolean(avatarUrl?.startsWith("http"))}
                className="object-cover rounded-full"
              />
            
            </div>

            <div>
              <p className="font-display text-base font-bold uppercase text-white">
                {firstName} {lastName}
              </p>
              <p className="font-mono text-[10px] text-white/60 uppercase tracking-wider mt-0.5">
                OPERATOR {formatRebelId(user.rebelId || user.id)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Columns: Personal Details Form & Change Password Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <User className="h-4 w-4 text-white" />
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-white">
                Personal Identification
              </h3>
            </div>

            {detailsError && (
              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] p-3 text-xs text-white/90">
                <AlertCircle className="h-4 w-4 shrink-0 text-white" />
                <span>{detailsError}</span>
              </div>
            )}

            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
                    First Name <span className="text-white/40">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Operator First Name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Operator Last Name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
                    Email Channel
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 font-sans text-xs text-white/50 cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-wider text-white bg-white/15 px-1.5 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
                    Rebel ID Designation
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={formatRebelId(user.rebelId || user.id)}
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 font-mono text-xs text-white/80 tracking-wider cursor-not-allowed font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-wider text-white bg-white/15 px-1.5 py-0.5 rounded">
                      UNIQUE
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
                    Phone (1-Click Fastrr Checkout &amp; Order Sync)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                  <p className="mt-1 text-[10px] text-white/40 font-mono">
                    Past guest orders placed with this number will be automatically linked to your account.
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
                    Security Clearance
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="font-mono text-xs text-white/80 uppercase tracking-wider">
                      VERIFIED REBEL
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={detailsSaving}
                  className="flex items-center gap-2 rounded-full px-6 py-2.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {detailsSaving ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Security Passcode Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Lock className="h-4 w-4 text-white" />
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-white">
                Access Passcode & Encryption
              </h3>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] p-3 text-xs text-white/90">
                <AlertCircle className="h-4 w-4 shrink-0 text-white" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-white">
                <Check className="h-4 w-4 shrink-0 text-white" />
                <span>Passcode updated successfully.</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
                    New Security Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1.5">
                    Confirm Security Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new passcode"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {passwordSaving ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                  <span>Update Passcode</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
