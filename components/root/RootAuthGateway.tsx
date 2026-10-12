'use client';

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, KeyRound, AlertCircle, RefreshCw, Eye, EyeOff, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { adminLoginRequest, adminVerifyOtp, loginTestAdmin, AdminUser } from '@/lib/adminApi';

interface RootAuthGatewayProps {
  onAuthenticated: (user: AdminUser, token: string) => void;
}

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Poppins', sans-serif";

export function RootAuthGateway({ onAuthenticated }: RootAuthGatewayProps) {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('testadmin@rebelive.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>('892147');
  const [skipOtpTest, setSkipOtpTest] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Direct Test Admin Login
  const handleTestAdminLogin = async (targetEmail = 'testadmin@rebelive.com') => {
    setIsLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const { user, accessToken } = await loginTestAdmin(targetEmail);
      setInfoMsg('Test Admin authorization granted. Launching terminal...');
      setTimeout(() => {
        onAuthenticated(user, accessToken);
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate test admin.');
      setIsLoading(false);
    }
  };

  // Handle Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both admin email and password.');
      return;
    }

    if (skipOtpTest) {
      await handleTestAdminLogin(email.trim());
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminLoginRequest(email.trim(), password);
      if (res.demoOtp) {
        setDemoOtpCode(res.demoOtp);
      }
      setInfoMsg(res.message || 'Security code generated and dispatched.');
      setStep('otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication rejected. Verify email and master password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2: Submit OTP
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
      onAuthenticated(user, accessToken);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await adminLoginRequest(email.trim(), password || 'rebelive_root_2026');
      if (res.demoOtp) setDemoOtpCode(res.demoOtp);
      setInfoMsg('A new 6-digit verification code has been dispatched.');
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
            {step === 'credentials' ? 'ADMIN LOGIN' : 'VERIFY PASSCODE'}
          </h1>
          <p className="text-xs text-white/50 tracking-wider">
            {step === 'credentials'
              ? 'Enter root operator credentials to initiate secure session.'
              : `A 6-digit authorization code was dispatched to ${email}.`}
          </p>
        </div>

        {/* Quick Test Admin 1-Click Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-xs font-mono font-bold text-white">TEST ADMIN SHORTCUT</span>
            </div>
            <span className="text-[9px] font-mono text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/20 font-semibold">
              NO OTP NEEDED
            </span>
          </div>
          <p className="text-[11px] text-white/60 leading-relaxed font-sans">
            Instantly unlock root terminal as <span className="text-white font-mono font-bold">testadmin@rebelive.com</span> (SUPERADMIN).
          </p>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleTestAdminLogin('testadmin@rebelive.com')}
            className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Authorizing Test Admin...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>1-Click Test Admin Login</span>
              </>
            )}
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-white/70" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && !errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            <span>{infoMsg}</span>
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
                  placeholder="root@rebelive.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-white/60 uppercase tracking-widest block">
                  SECURITY PASSWORD
                </label>
                <span className="text-[9px] font-mono text-white/40">MASTER ACCESS</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors font-mono"
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

            {/* Skip OTP test toggle */}
            <div className="flex items-center justify-between py-1 px-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70 select-none">
                <input
                  type="checkbox"
                  checked={skipOtpTest}
                  onChange={(e) => setSkipOtpTest(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-white focus:ring-0 cursor-pointer"
                />
                <span>Skip 2FA OTP verification (Test Mode)</span>
              </label>
              {skipOtpTest && (
                <span className="text-[10px] font-mono text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20">
                  BYPASS ACTIVE
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{skipOtpTest ? 'Authorizing Admin...' : 'Verifying Credentials...'}</span>
                </>
              ) : skipOtpTest ? (
                <>
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Login Directly (No OTP)</span>
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
                  6-DIGIT PASSCODE
                </label>
                {demoOtpCode && (
                  <button
                    type="button"
                    onClick={() => setOtp(demoOtpCode)}
                    className="text-[10px] font-mono text-white/70 hover:underline cursor-pointer"
                  >
                    Quick-Fill: {demoOtpCode}
                  </button>
                )}
              </div>

              <input
                type="text"
                required
                maxLength={6}
                placeholder="000000"
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
                  <span>Validating Security Token...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Root Dashboard</span>
                </>
              )}
            </button>

            {/* Test Mode Bypass on Step 2 */}
            <button
              type="button"
              onClick={() => handleTestAdminLogin(email)}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Bypass OTP & Unlock (Test Mode)</span>
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setErrorMsg('');
                }}
                className="text-white/50 hover:text-white transition-colors cursor-pointer text-[11px]"
              >
                ← Back to Password
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-white/70 hover:text-white transition-colors cursor-pointer text-[11px] font-mono"
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
