'use client';

import { motion, AnimatePresence } from 'framer-motion';
import EverestPattern from './EverestPattern';
import ProgressRail from './ProgressRail';
import { ShuffledQuestion } from '@/lib/quiz';
import { Persona } from '@/data/questions';
import { ArrowUpRight } from 'lucide-react';

const TAGS = ['A', 'B', 'C'];
const MONO = 'JetBrains Mono, Courier New, monospace';

export default function QuizStage({
  question,
  index,
  total,
  onAnswer,
}: {
  question: ShuffledQuestion;
  index: number;
  total: number;
  onAnswer: (persona: Persona) => void;
}) {
  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex min-h-[calc(100vh-80px)] w-full flex-col justify-between pt-2 sm:pt-4 pb-8 text-white"
    >
      <EverestPattern strokeColor="rgba(255, 255, 255, 0.35)" opacity={0.35} />

      {/* ── Top stage bar ── */}
      <div className="relative z-10 flex w-full items-center justify-between px-6 pt-4 sm:px-10 sm:pt-6">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold"
          style={{ fontFamily: MONO }}
        >
          Find your persona
        </span>

       
      </div>

      {/* Progress rail */}
      <div className="relative z-10 px-6 pt-3 sm:px-10">
        <ProgressRail total={total} current={index} tone="dark" />
      </div>

      {/* ── Centered glass question card ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-6 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl rounded-2xl"
            style={{
              background: '#0e0e0e',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)',
              padding: 'clamp(24px, 4vw, 44px)',
            }}
          >
            {/* Question number tag */}
            <div className="mb-4 flex items-center gap-3">
              <span
                className="font-mono text-[9px] uppercase tracking-[0.35em] text-emerald-400 font-semibold"
                style={{ fontFamily: MONO }}
              >
                {question.title}
              </span>
              <div className="h-px flex-1 bg-white/10" />
              <span
                className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40"
                style={{ fontFamily: MONO }}
              >
                Q{index + 1}
              </span>
            </div>

            {/* Question text */}
            <h2
              className="text-white select-none leading-[1.1] mb-6 font-bold"
              style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {question.prompt}
            </h2>

            {/* Answer options */}
            <div className="flex flex-col gap-2.5">
              {question.options.map((opt, i) => (
                <motion.button
                  key={opt.text}
                  onClick={() => onAnswer(opt.persona)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.08, duration: 0.3 }}
                  className="group flex w-full items-center justify-between border border-white/10 rounded-xl px-5 py-4 text-left transition-all duration-200 hover:border-white/30 hover:bg-white/[0.08] active:scale-[0.99] cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="font-mono flex h-6 w-6 shrink-0 items-center justify-center border border-white/20 rounded-md text-[10px] text-white/60 transition-all group-hover:border-white group-hover:text-white group-hover:bg-white/10"
                      style={{ fontFamily: MONO }}
                    >
                      {TAGS[i]}
                    </span>
                    <span
                      className="text-[13px] leading-snug text-white/80 transition-colors group-hover:text-white font-light"
                      style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
                    >
                      {opt.text}
                    </span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/40 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.button>
              ))}
            </div>

            {/* Hint */}
            <p
              className="mt-5 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-white/40"
              style={{ fontFamily: MONO }}
            >
              Choose fast — instinct only.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
