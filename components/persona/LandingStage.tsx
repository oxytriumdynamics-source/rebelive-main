'use client';

import { motion } from 'framer-motion';
import EverestPattern from './EverestPattern';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

const MONO = "var(--font-poppins), 'Poppins', sans-serif";
const DISPLAY = "'Code Next', sans-serif";

export default function LandingStage({
  onStart,
}: {
  onStart: () => void;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const isAllocated = Boolean(user?.preferences?.personalityType);
  const allocatedName = user?.preferences?.personalityType?.name || 'ARCHETYPE';

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="relative flex w-full flex-1 flex-col justify-between select-none text-white px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 py-4 sm:py-6 lg:py-8 min-h-[calc(100vh-5rem)]"
    >
      {/* ── Background Patterns ── */}
      <EverestPattern strokeColor="rgba(255, 255, 255, 0.45)" opacity={0.5} />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] rounded-full blur-3xl pointer-events-none -z-10 opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* ── Hero Content Section (Full-bleed edge-to-edge layout) ── */}
      <div className="relative z-10 flex flex-1 flex-col justify-between w-full h-full">
        {/* Status indicator bar */}
        <div className="flex w-full items-center justify-between pt-1">
          {isAuthenticated && user && (
            <span
              className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/60 font-medium"
              style={{ fontFamily: MONO }}
            >
              LOGGED IN: {user.firstName}
            </span>
          )}

          {isAllocated && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-[10px] uppercase tracking-wider ml-auto">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>ARCHETYPE LOCKED: {allocatedName}</span>
            </div>
          )}
        </div>

        {/* Giant headline */}
        <div className="flex flex-1 flex-col justify-center gap-0 my-auto py-2">
          {isAllocated ? (
            <h1 className="flex flex-col select-none">
              {/* ARCHETYPE - filled */}
              <motion.span
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-[0.82] text-white select-none block"
                style={{ fontFamily: DISPLAY, fontSize: 'clamp(4rem, 13vw, 11.5rem)', letterSpacing: '-0.02em' }}
              >
                ARCHETYPE
              </motion.span>

              {/* LOCKED - outlined in crisp white */}
              <motion.span
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-[0.82] select-none block"
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 'clamp(4rem, 13vw, 11.5rem)',
                  letterSpacing: '-0.02em',
                  color: 'transparent',
                  WebkitTextStroke: '2.5px rgba(255, 255, 255, 0.95)',
                }}
              >
                LOCKED.
              </motion.span>

              {/* PERSONA NAME - filled */}
              <motion.span
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-[0.82] text-white select-none block"
                style={{ fontFamily: DISPLAY, fontSize: 'clamp(4rem, 13vw, 11.5rem)', letterSpacing: '-0.02em' }}
              >
                {allocatedName}.
              </motion.span>
            </h1>
          ) : (
            <h1 className="flex flex-col select-none">
              {/* FIND - filled */}
              <motion.span
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-[0.82] text-white select-none block"
                style={{ fontFamily: DISPLAY, fontSize: 'clamp(4rem, 13vw, 11.5rem)', letterSpacing: '-0.02em' }}
              >
                FIND
              </motion.span>

              {/* YOUR - outlined in crisp white */}
              <motion.span
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-[0.82] select-none block"
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 'clamp(4rem, 13vw, 11.5rem)',
                  letterSpacing: '-0.02em',
                  color: 'transparent',
                  WebkitTextStroke: '2.5px rgba(255, 255, 255, 0.95)',
                }}
              >
                YOUR
              </motion.span>

              {/* PERSONA. - filled */}
              <motion.span
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-[0.82] text-white select-none block"
                style={{ fontFamily: DISPLAY, fontSize: 'clamp(4rem, 13vw, 11.5rem)', letterSpacing: '-0.02em' }}
              >
                PERSONA.
              </motion.span>
            </h1>
          )}
        </div>

        {/* Sub-text + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.58 }}
          className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 pb-2 sm:pb-3"
        >
          {isAllocated ? (
            <>
              <div className="max-w-md">
                <p className="font-mono text-xs text-white/70 leading-relaxed">
                  Your Rebel Persona is permanently calibrated to your account. Persona allocations cannot be retaken or altered.
                </p>
              </div>

              <button
                id="view-rebel-pass-btn"
                onClick={() => router.push('/profile')}
                className="group ml-auto flex w-fit items-center gap-3 bg-white px-8 py-3.5 sm:py-4 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold text-black transition-all duration-200 hover:bg-neutral-200 active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer rounded-none shrink-0"
                style={{ fontFamily: MONO }}
              >
                VIEW YOUR REBEL PASS
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </>
          ) : (
            <>
              <div className="max-w-md">
                <p className="font-mono text-xs text-white/50 leading-relaxed">
                  5 intuitive scenario questions. Allocate your permanent Rebel ID archetype (Apex, Capella, or Aviva).
                </p>
              </div>

              <button
                id="start-persona-quiz-btn"
                onClick={onStart}
                className="group ml-auto flex w-fit items-center gap-3 bg-white px-8 py-3.5 sm:py-4 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold text-black transition-all duration-200 hover:bg-neutral-200 active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer rounded-none shrink-0"
                style={{ fontFamily: MONO }}
              >
                START THE TEST
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
