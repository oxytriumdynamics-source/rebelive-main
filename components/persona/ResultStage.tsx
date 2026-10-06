'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MemberCard from '@/components/profile/MemberCard';
import { PERSONAS } from '@/data/personas';
import { ScoreResult } from '@/lib/quiz';
import { ArrowRight, RotateCcw } from 'lucide-react';
import EverestPattern from './EverestPattern';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { claimPersona } from '@/store/slices/authslice';

const MONO = 'JetBrains Mono, Courier New, monospace';

export default function ResultStage({
  result,
}: {
  result: ScoreResult;
  onRestart?: () => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const persona = PERSONAS[result.winner];
  const isApex = persona.id === 'APEX';
  const isCapella = persona.id === 'CAPELLA';

  // The member name: use logged-in user's name or empty string if not logged in
  const memberName = user ? `${user.firstName} ${user.lastName}`.trim() : '';

  async function handleClaim() {
    if (isAuthenticated) {
      // Already logged in - claim immediately
      await dispatch(claimPersona(result.winner.toLowerCase()));
      router.push('/profile');
    } else {
      // Guest - save persona in both sessionStorage & localStorage for reliability, send to signup
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingPersona', result.winner.toLowerCase());
        localStorage.setItem('pendingPersona', result.winner.toLowerCase());
      }
      router.push('/auth');
    }
  }

  // Persona-specific accents over luxury dark background
  const patternStroke = isApex ? '#ffffff' : isCapella ? '#f59e0b' : '#f43f5e';
  const halftoneRgb = isApex
    ? '255, 255, 255'
    : isCapella
      ? '245, 158, 11'
      : '244, 63, 94';

  const patternOpacity = 0.25;

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-[calc(100vh-80px)] w-full flex-col justify-between overflow-hidden transition-colors duration-500 pt-2 sm:pt-4 pb-8 text-white"
    >
      {/* EverestPattern */}
      <EverestPattern strokeColor={patternStroke} opacity={patternOpacity} />

      {/* ── Top Status Bar ── */}
      <div className="relative z-20 flex w-full items-center justify-between px-4 pt-2 sm:px-8 sm:pt-3 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-1 backdrop-blur-md border border-white/15 bg-white/[0.06]">
          <span
            className={`h-2 w-2 rounded-full animate-pulse ${
              isApex
                ? 'bg-emerald-400'
                : isCapella
                  ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
            }`}
          />
          <span
            className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-white"
            style={{ fontFamily: MONO }}
          >
            REBEL ID ISSUED // {persona.title}
          </span>
        </div>
      </div>

      {/* ── Center Stage: Member Card + Actions ── */}
      <div className="relative z-20 flex flex-1 min-h-0 flex-col items-center justify-center gap-3 px-4 py-2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center gap-3"
        >
          {/* Member Card with Flip functionality */}
          <MemberCard persona={persona} memberName="" showActions={false} compact={true} />

          {/* CTA row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <button
                id="claim-persona-btn"
                onClick={handleClaim}
                className="group flex items-center gap-2.5 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] font-bold bg-white text-black hover:bg-neutral-200 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-[1.02]"
                style={{ fontFamily: MONO }}
              >
                {isAuthenticated ? 'SAVE TO PROFILE' : 'LOCK IN REBEL ID'}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
