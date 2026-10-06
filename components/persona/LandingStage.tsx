'use client';

import { motion } from 'framer-motion';
import EverestPattern from './EverestPattern';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const MONO = 'JetBrains Mono, Courier New, monospace';
const DISPLAY = 'Anton, Arial Narrow, sans-serif';

export default function LandingStage({
  onStart,
}: {
  onStart: () => void;
}) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

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
        </div>

        {/* Giant headline */}
        <div className="flex flex-1 flex-col justify-center gap-0 my-auto py-2">
          {/* FIND - filled */}
          <motion.h1
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="font-display leading-[0.82] text-white select-none"
            style={{ fontFamily: DISPLAY, fontSize: 'clamp(4rem, 13vw, 11.5rem)', letterSpacing: '-0.02em' }}
          >
            FIND
          </motion.h1>

          {/* YOUR - outlined in crisp white */}
          <motion.h1
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display leading-[0.82] select-none"
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(4rem, 13vw, 11.5rem)',
              letterSpacing: '-0.02em',
              color: 'transparent',
              WebkitTextStroke: '2.5px rgba(255, 255, 255, 0.95)',
            }}
          >
            YOUR
          </motion.h1>

          {/* PERSONA. - filled */}
          <motion.h1
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="font-display leading-[0.82] text-white select-none"
            style={{ fontFamily: DISPLAY, fontSize: 'clamp(4rem, 13vw, 11.5rem)', letterSpacing: '-0.02em' }}
          >
            PERSONA.
          </motion.h1>
        </div>

        {/* Sub-text + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.58 }}
          className="mt-4 sm:mt-6 flex w-full items-center justify-end pb-2 sm:pb-3"
        >
          <button
            id="start-persona-quiz-btn"
            onClick={onStart}
            className="group ml-auto flex w-fit items-center gap-3 bg-white px-8 py-3.5 sm:py-4 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold text-black transition-all duration-200 hover:bg-neutral-200 active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer rounded-none shrink-0"
            style={{ fontFamily: MONO }}
          >
            START THE TEST
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
