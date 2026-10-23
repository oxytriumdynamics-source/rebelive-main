'use client';

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, KeyRound, AlertCircle, RefreshCw, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { adminLoginRequest, adminVerifyOtp, AdminUser } from '@/lib/adminApi';
import { showAdminToast } from '@/components/root/AdminToaster';

interface RootAuthGatewayProps {
  onAuthenticated: (user: AdminUser, token: string) => void;
}

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export function RootAuthGateway({ onAuthenticated }: RootAuthGatewayProps) {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('oxytriumdynamics@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Handle Step 1: Submit Email and Password
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both administrator email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminLoginRequest(email.trim(), password);
      setInfoMsg(res.message || 'Security verification code dispatched to your email.');
      setStep('otp');
      showAdminToast('2FA verification code sent to your email.', 'info', 'OTP Dispatched');
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please verify credentials.';
      setErrorMsg(msg);
      showAdminToast(msg, 'error', 'Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2: Submit 6-digit OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp.trim() || otp.trim().length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, accessToken } = await adminVerifyOtp(email.trim(), otp.trim());
      showAdminToast(`Authenticated successfully as ${user.email}`, 'success', 'Access Granted');
      onAuthenticated(user, accessToken);
    } catch (err: any) {
      const msg = err.message || 'Verification failed. Invalid or expired OTP.';
      setErrorMsg(msg);
      showAdminToast(msg, 'error', 'Verification Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!password) {
      setErrorMsg('Session expired. Please re-enter your password.');
      setStep('credentials');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await adminLoginRequest(email.trim(), password);
      setInfoMsg(res.message || 'A new 6-digit verification code has been dispatched.');
      showAdminToast('A new 6-digit code has been sent to your email.', 'info', 'OTP Resent');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ fontFamily: SANS }}
      className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Security Gateway Card */}
      <div className="w-full max-w-md bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl relative z-10">
        {/* Terminal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 mb-2">
            <Lock className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-white font-bold" style={{ fontFamily: MONO }}>
              ROOT CONTROL GATEWAY
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {step === 'credentials' ? 'ADMIN LOGIN' : 'ENTER 2FA CODE'}
          </h1>
          <p className="text-xs text-white/50 tracking-wider">
            {step === 'credentials'
              ? 'Enter administrator credentials to initiate 2-factor authentication.'
              : `Enter the 6-digit verification code sent to ${email}.`}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-white" />
            <span className="font-mono">{errorMsg}</span>
          </div>
        )}

        {infoMsg && !errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            <span className="font-mono">{infoMsg}</span>
          </div>
        )}

        {step === 'credentials' ? (
          /* Step 1: Email + Password */
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-white/60 uppercase tracking-widest block">
                ADMINISTRATOR EMAIL
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="admin@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-white/60 uppercase tracking-widest block">
                  SECURITY PASSWORD
                </label>
                <span className="text-[9px] font-mono text-white/40">SUPERADMIN / ADMIN</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Request 2FA OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP */
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-white/60 uppercase tracking-widest block">
                  6-DIGIT EMAIL CODE
                </label>
                <span className="text-[9px] font-mono text-white/40">EXP: 10 MIN</span>
              </div>

              <input
                type="text"
                required
                maxLength={6}
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                autoFocus
                className="w-full bg-white/[0.04] border border-white/20 rounded-xl py-3.5 text-center text-xl font-bold tracking-[0.5em] text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full mt-2 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating OTP Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Unlock Dashboard</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setErrorMsg('');
                  setOtp('');
                }}
                className="text-white/50 hover:text-white transition-colors cursor-pointer text-[11px]"
              >
                ← Back to Login
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-white/70 hover:text-white transition-colors cursor-pointer text-[11px] font-mono underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
