"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import LandingStage from "@/components/persona/LandingStage";

const QuizStage = dynamic(() => import("@/components/persona/QuizStage"), {
  ssr: false,
});
const ResultStage = dynamic(() => import("@/components/persona/ResultStage"), {
  ssr: false,
});
const ProfileStage = dynamic(() => import("@/components/profile/ProfileStage"), {
  ssr: false,
});

import { pickSession, scoreSession, Answer, ShuffledQuestion, ScoreResult } from "@/lib/quiz";
import { Persona } from "@/data/questions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMe } from "@/store/slices/authslice";
import { PRODUCTS } from "@/data/products";

type Stage = "landing" | "quiz" | "result" | "profile";

function PersonaContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, loading } = useAppSelector((s) => s.auth);

  const [stage, setStage] = useState<Stage>("landing");
  const [session, setSession] = useState<ShuffledQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Hydrate auth state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("rebelive_auth_token");
      if (token && !isAuthenticated) {
        dispatch(getMe());
      }
    }
  }, [dispatch, isAuthenticated]);

  // Handle retake query param
  useEffect(() => {
    const isRetake = searchParams.get("retake");
    if (isRetake === "true") {
      startTest();
    }
  }, [searchParams]);

  function startTest() {
    setSession(pickSession());
    setAnswers([]);
    setQIndex(0);
    setResult(null);
    setStage("quiz");
  }

  function handleAnswer(persona: Persona) {
    const next = [...answers, { questionId: session[qIndex].id, persona }];
    setAnswers(next);
    if (qIndex + 1 < session.length) {
      setQIndex(qIndex + 1);
    } else {
      const calculated = scoreSession(next);
      setResult(calculated);
      setStage("result");
    }
  }

  function restart() {
    setResult(null);
    setStage("landing");
  }

  return (
    <div className="w-full bg-black text-white relative flex flex-col justify-between pt-20 min-h-screen overflow-x-hidden">
      {/* ── Stage Machine ── */}
      <main className="flex-1 w-full flex flex-col relative z-10 min-h-[calc(100vh-5rem)]">
        <AnimatePresence mode="wait">
          {stage === "landing" && (
            <LandingStage key="landing" onStart={startTest} />
          )}

          {stage === "quiz" && session.length > 0 && (
            <QuizStage
              key="quiz"
              question={session[qIndex]}
              index={qIndex}
              total={session.length}
              onAnswer={handleAnswer}
            />
          )}

          {stage === "result" && result && (
            <ResultStage key="result" result={result} onRestart={restart} />
          )}

          {stage === "profile" && isAuthenticated && user && (
            <ProfileStage
              key="profile"
              user={user}
              onStartQuiz={startTest}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function PersonaPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[#08080a] text-white">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/40">
            LOADING PERSONA EXPERIENCE…
          </span>
        </div>
      }
    >
      <PersonaContent />
    </Suspense>
  );
}
