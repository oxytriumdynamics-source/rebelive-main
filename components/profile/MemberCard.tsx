"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PersonaProfile } from "@/data/personas";
import { RotateCcw, Share2, Check } from "lucide-react";

const MONO = "'Poppins', sans-serif";

function getIssuedDate(): string {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const y = now.getFullYear();
  return `${d}.${m}.${y}`;
}

export default function MemberCard({
  persona,
  memberName = "",
  showActions = true,
  compact = false,
}: {
  persona: PersonaProfile;
  memberName?: string;
  showActions?: boolean;
  compact?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "loading" | "done">("idle");
  const issuedDate = useMemo(() => getIssuedDate(), []);
  const cardFrontRef = useRef<HTMLDivElement>(null);

  const isApex = persona.id === "APEX";
  const isCapella = persona.id === "CAPELLA";
  const isAviva = persona.id === "AVIVA";

  const [shareError, setShareError] = useState<string | null>(null);

  const shareCard = useCallback(async () => {
    if (!cardFrontRef.current || shareState === "loading") return;

    setShareState("loading");
    setShareError(null);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const el = cardFrontRef.current;
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const clone = el.cloneNode(true) as HTMLElement;
      const wrapper = document.createElement("div");

      wrapper.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${width}px;
        height: ${height}px;
        z-index: -9999;
        pointer-events: none;
        overflow: hidden;
        visibility: visible;
      `;

      clone.style.cssText = `
        transform: none !important;
        transform-style: flat !important;
        backface-visibility: visible !important;
        -webkit-backface-visibility: visible !important;
        width: ${width}px !important;
        height: ${height}px !important;
        margin: 0 !important;
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      `;

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 150));

      let blob: Blob | null = null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const domToImage = (await import("dom-to-image-more")) as any;
        const lib = domToImage.default || domToImage;
        blob = await lib.toBlob(clone, {
          width,
          height,
          quality: 1,
          scale: 2,
        });
      } catch (e) {
        console.warn("dom-to-image-more failed, using fallback:", e);
      }

      document.body.removeChild(wrapper);

      if (!blob) throw new Error("Image export failed");

      const fileName = `rebelive-${persona.id.toLowerCase()}-card.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      let shared = false;
      const canShareFiles =
        typeof navigator !== "undefined" &&
        "canShare" in navigator &&
        navigator.canShare({ files: [file] });

      if (canShareFiles && typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: `REBELIVE - ${persona.name} Rebel ID`,
            text: `I've claimed my ${persona.name} Rebel ID. Discover your archetype at REBELIVE.`,
            files: [file],
          });
          shared = true;
        } catch (shareErr: unknown) {
          if ((shareErr as { name?: string })?.name === "AbortError") {
            setShareState("idle");
            return;
          }
        }
      }

      if (!shared) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      }

      setShareState("done");
      setTimeout(() => setShareState("idle"), 2500);
    } catch (err) {
      console.error("[ShareCard] Error:", err);
      setShareError("Could not capture card. Try again.");
      setShareState("idle");
      setTimeout(() => setShareError(null), 3000);
    }
  }, [persona, shareState]);

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* 3D Flip Card Container */}
      <div
        className="relative mx-auto cursor-pointer select-none group"
        style={{
          width: compact ? "calc(min(490px, calc(100dvh - 170px), 62vh) / 1.56)" : "min(345px, 100%)",
          height: compact ? "min(490px, calc(100dvh - 170px), 62vh)" : "min(530px, calc(100dvh - 160px))",
          aspectRatio: "1 / 1.56",
          perspective: "1400px",
          WebkitPerspective: "1400px",
        }}
        onClick={() => setFlipped((f) => !f)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          whileHover={{ y: -6, scale: 1.015 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          }}
        >
          {/* FRONT FACE */}
          <div
            ref={cardFrontRef}
            className={`absolute inset-0 overflow-hidden rounded-[20px] ${isApex
                ? "bg-[#090909] text-white border border-white/10"
                : isCapella
                  ? "bg-[#fcfcfc] text-[#111110] border border-black/10"
                  : "bg-[#fcfcfc] text-[#111110] border border-black/10"
              }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg) translateZ(1px)",
              WebkitTransform: "rotateY(0deg) translateZ(1px)",
              opacity: flipped ? 0 : 1,
              pointerEvents: flipped ? "none" : "auto",
              transition: "opacity 0.25s ease",
              boxShadow: isApex
                ? "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)"
                : "0 25px 60px -15px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {/* Background Graphic Illustration from /brand/ */}
            <div className="absolute inset-0 pointer-events-none">
              {isApex && (
                <div className="relative h-full w-full opacity-90">
                  <Image
                    src="/brand/APEX.png"
                    alt="APEX Topography"
                    fill
                    priority
                    sizes="340px"
                    className="object-cover object-[20%_45%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-transparent to-transparent" />
                </div>
              )}

              {isCapella && (
                <div className="relative h-full w-full opacity-95">
                  <Image
                    src="/brand/Capella.png"
                    alt="Capella Constellation"
                    fill
                    priority
                    sizes="340px"
                    className="object-cover object-[22%_18%]"
                  />
                </div>
              )}

              {isAviva && (
                <div className="relative h-full w-full">
                  <Image
                    src="/brand/Aviva.png"
                    alt="Aviva Sakura & Fuji"
                    fill
                    priority
                    sizes="340px"
                    className="object-cover object-[52%_bottom]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/70 via-transparent to-transparent" />
                </div>
              )}
            </div>

            {/* Front Top Bar */}
            <div className={`relative z-10 flex items-center justify-between ${compact ? "p-3.5" : "p-6"}`}>
              <div className={`relative ${compact ? "h-6 w-28" : "h-8 w-36"}`}>
                <Image
                  src="/brand/REBELIVE Logo Black.png"
                  alt="REBELIVE"
                  fill
                  priority
                  sizes="160px"
                  className="object-contain object-left"
                  style={isApex ? { filter: "invert(1) brightness(1.2)" } : undefined}
                />
              </div>

              {/* Panther Insignia Badge */}
              <div
                className={`flex items-center justify-center rounded-full p-1 shadow-sm ${
                  compact ? "h-8 w-8" : "h-10 w-10"
                } ${
                  isApex
                    ? "border-white/50 bg-black/60 backdrop-blur-xs"
                    : "border-black bg-white"
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={
                      isApex
                        ? "/brand/panther_white_icon-transparent.png"
                        : "/brand/panther white icon.jpeg"
                    }
                    alt="Panther Emblem"
                    fill
                    sizes="36px"
                    className="object-contain"
                    style={!isApex ? { filter: "invert(1)" } : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Vertical Coordinates */}
            {isAviva && (
              <div
                className="absolute left-4 top-28 z-10 font-mono text-[9px] tracking-[0.25em] text-black/75"
                style={{
                  fontFamily: MONO,
                  writingMode: "vertical-rl",
                }}
              >
                35°30&apos;04.3&quot;N, 138°48&apos;05.0&quot;E
              </div>
            )}

            {isCapella && (
              <div
                className="absolute right-4 top-28 z-10 font-mono text-[9px] tracking-[0.22em] text-black/75"
                style={{
                  fontFamily: MONO,
                  writingMode: "vertical-rl",
                }}
              >
                RA 05h 16m 41.4s | Dec +45° 59&apos; 53&quot;
              </div>
            )}

            {isApex && (
              <div
                className="absolute left-4 top-28 z-10 font-mono text-[9px] tracking-[0.25em] text-white/75"
                style={{
                  fontFamily: MONO,
                  writingMode: "vertical-rl",
                }}
              >
                27°59&apos;17&quot;N 86°55&apos;31&quot;E
              </div>
            )}

            {/* Front Bottom Info: Name + Dash + Persona Name */}
            <div className={`absolute z-10 flex flex-col ${compact ? "bottom-3.5 left-4" : "bottom-6 left-6"}`}>
              {isApex ? (
                <>
                  {memberName && memberName.trim() ? (
                    <>
                      <p
                        className={`${compact ? "text-[14px]" : "text-[18px]"} font-semibold leading-snug text-white/80`}
                        style={{ fontFamily: "Inter, -apple-system, sans-serif", maxWidth: "10rem" }}
                      >
                        {memberName.split(" ")[0]}
                        <br />
                        {memberName.split(" ").slice(1).join(" ")}
                      </p>
                      <div className={`${compact ? "my-1.5 h-[1.5px] w-5" : "my-2.5 h-[1.5px] w-6"} bg-white/70`} />
                    </>
                  ) : null}
                  <div
                    className={`${compact ? "text-3xl" : "text-4xl"} leading-none tracking-wider text-white`}
                    style={{
                      fontFamily: persona.fontFamily,
                      textShadow: "0 1px 10px rgba(0,0,0,0.5)",
                    }}
                  >
                    APEX
                  </div>
                </>
              ) : isCapella ? (
                <>
                  {memberName && memberName.trim() ? (
                    <>
                      <p
                        className={`${compact ? "text-[13px]" : "text-[15px]"} font-medium leading-snug text-black/70`}
                        style={{ fontFamily: "Inter, -apple-system, sans-serif", maxWidth: "9rem" }}
                      >
                        {memberName.split(" ")[0]}
                        <br />
                        {memberName.split(" ").slice(1).join(" ")}
                      </p>
                      <div className={`${compact ? "mb-1.5 h-[1.5px] w-5" : "mb-2.5 h-[1.5px] w-6"} bg-black/70`} />
                    </>
                  ) : null}
                  <div
                    className={`${compact ? "mt-1.5 text-2xl" : "mt-3 text-3xl"} leading-none tracking-[0.02em] text-[#111110]`}
                    style={{
                      fontFamily: persona.fontFamily,
                    }}
                  >
                    CAPELLA
                  </div>
                </>
              ) : (
                <>
                  {memberName && memberName.trim() ? (
                    <>
                      <p
                        className={`${compact ? "text-[13px]" : "text-[15px]"} font-medium leading-snug text-black/70`}
                        style={{ fontFamily: "Inter, -apple-system, sans-serif", maxWidth: "9rem" }}
                      >
                        {memberName.split(" ")[0]}
                        <br />
                        {memberName.split(" ").slice(1).join(" ")}
                      </p>
                      <div className={`${compact ? "mb-1.5 h-[1.5px] w-5" : "mb-2.5 h-[1.5px] w-6"} bg-black/70`} />
                    </>
                  ) : null}
                  <div
                    className={`${compact ? "mt-1 text-3xl" : "mt-2 text-4xl"} leading-none tracking-wider text-[#111110]`}
                    style={{
                      fontFamily: persona.fontFamily,
                    }}
                  >
                    AVIVA
                  </div>
                </>
              )}
            </div>

            {/* Subtle interactive flip hint */}
            <div className="absolute bottom-2 right-3 z-10 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-sm">
              <RotateCcw className="h-2 w-2 text-white/70" />
              <span
                className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-white/80"
                style={{ fontFamily: MONO }}
              >
                Flip
              </span>
            </div>
          </div>

          {/* BACK FACE */}
          <div
            className={`absolute inset-0 flex flex-col justify-between overflow-hidden ${
              compact ? "p-4" : "p-6"
            } rounded-[20px] select-none transition-all duration-300 ${isApex
                ? "bg-[#090909] text-white border border-white/15"
                : isCapella
                  ? "bg-[#fcfcfc] text-[#111110] border border-black/12"
                  : "bg-[#fcfcfc] text-[#111110] border border-black/12"
              }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)",
              WebkitTransform: "rotateY(180deg) translateZ(1px)",
              opacity: flipped ? 1 : 0,
              pointerEvents: flipped ? "auto" : "none",
              transition: "opacity 0.25s ease",
              boxShadow: isApex
                ? "0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 15px 35px -10px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)"
                : "0 30px 70px -15px rgba(0, 0, 0, 0.32), 0 15px 35px -10px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.08), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95)",
            }}
          >
            {/* Watermark */}
            {isApex && (
              <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
                <Image
                  src="/brand/APEX.png"
                  alt="Watermark"
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              </div>
            )}
            {isCapella && (
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                <Image
                  src="/brand/Capella.png"
                  alt="Watermark"
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              </div>
            )}
            {isAviva && (
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                <Image
                  src="/brand/Aviva.png"
                  alt="Watermark"
                  fill
                  sizes="340px"
                  className="object-cover object-right"
                />
              </div>
            )}

            {/* Back Top Bar */}
            <div
              className={`relative z-10 flex items-center justify-between border-b ${compact ? "pb-1.5" : "pb-2.5"}`}
              style={{
                borderColor: isApex ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
              }}
            >
              <div className={`relative ${compact ? "h-5 w-24" : "h-7 w-32"}`}>
                <Image
                  src="/brand/REBELIVE Logo Black.png"
                  alt="REBELIVE"
                  fill
                  priority
                  sizes="140px"
                  className="object-contain object-left"
                  style={isApex ? { filter: "invert(1) brightness(1.2)" } : undefined}
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className={`relative z-10 flex items-center justify-between ${compact ? "pt-1 pb-0.5" : "pt-1.5 pb-0.5"}`}>
              <span
                className="font-mono text-[8px] uppercase tracking-[0.2em]"
                style={{
                  fontFamily: MONO,
                  color: isApex ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
                }}
              >
                {persona.coordinate}
              </span>
            </div>

            {/* Back Body */}
            <div className={`relative z-10 my-auto flex flex-col ${compact ? "gap-1.5 py-0.5" : "gap-3 py-1"}`}>
              <div>
                <div className="flex items-baseline gap-2 leading-none">
                  <span
                    className={`${compact ? "text-xl" : "text-2xl"} tracking-tight`}
                    style={{
                      fontFamily: persona.fontFamily,
                      color: isApex ? "#ffffff" : "#0a0a0a",
                    }}
                  >
                    {persona.name}
                  </span>
                  <span
                    className={`font-mono ${compact ? "text-[10px]" : "text-[12px]"} font-semibold uppercase tracking-[0.18em]`}
                    style={{
                      fontFamily: MONO,
                      color: isApex ? "rgba(255,255,255,0.5)" : isCapella ? "#c8922a" : "#e8628a",
                    }}
                  >
                    : {persona.cardSubtitle}
                  </span>
                </div>
              </div>

              {/* Quote Block */}
              <div
                className={`space-y-1 border-l-2 ${compact ? "pl-2 py-0.5" : "pl-3 py-0.5"}`}
                style={{
                  borderColor: isApex ? "rgba(255,255,255,0.25)" : isCapella ? "#c8922a" : "#e8628a",
                }}
              >
                <p
                  className={`${compact ? "text-[10.5px]" : "text-[12px]"} font-medium leading-snug`}
                  style={{
                    color: isApex ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)",
                  }}
                >
                  {persona.backQuote1}
                </p>
                <p
                  className={`${compact ? "text-[10px]" : "text-[11.5px]"} leading-snug`}
                  style={{
                    color: isApex ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                  }}
                >
                  {persona.backQuote2}
                </p>
              </div>

              {/* Privilege Section */}
              <div
                className={`relative rounded-lg ${compact ? "p-2 space-y-0.5" : "p-3 space-y-1"}`}
                style={{
                  backgroundColor: isApex ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  border: isApex ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <p
                  className="font-mono text-[7.5px] font-bold uppercase tracking-[0.25em]"
                  style={{
                    fontFamily: MONO,
                    color: isApex ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
                  }}
                >
                  {persona.privilegeHeader}
                </p>
                <p
                  className={`font-mono ${compact ? "text-[9.5px]" : "text-[11px]"} font-bold tracking-[0.08em]`}
                  style={{
                    fontFamily: MONO,
                    color: isApex ? "#ffffff" : "#0a0a0a",
                  }}
                >
                  {persona.privilegeCases}
                </p>
                <p
                  className={`font-mono ${compact ? "text-[7.5px]" : "text-[8.5px]"} tracking-[0.12em] pt-0.5`}
                  style={{
                    fontFamily: MONO,
                    color: isApex ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
                  }}
                >
                  {persona.formula}
                </p>
                <div className="flex justify-end pt-0.5">
                  <span
                    className="font-mono text-[6.5px] uppercase tracking-[0.08em]"
                    style={{
                      fontFamily: MONO,
                      color: isApex ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                    }}
                  >
                    *T &amp; C applied.
                  </span>
                </div>
              </div>

              {/* Issued Date */}
              <div
                className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em]"
                style={{
                  fontFamily: MONO,
                  color: isApex ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
                }}
              >
                <span>ISSUED: {issuedDate}</span>
                <span className="opacity-40">MEMBER ID</span>
              </div>
            </div>

            {/* Back Footer */}
            <div
              className={`relative z-10 flex items-center justify-between border-t ${compact ? "pt-1.5" : "pt-3"}`}
              style={{
                borderColor: isApex ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
              }}
            >
              <p
                className={`${compact ? "text-[8.5px]" : "text-[10px]"} font-medium tracking-[0.03em]`}
                style={{
                  color: isApex ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)",
                }}
              >
                {persona.fuelTagline}
              </p>

              <div className={`relative ${compact ? "h-4 w-4" : "h-6 w-6"} opacity-70`}>
                <Image
                  src="/brand/panther_white_icon-transparent.png"
                  alt="Seal"
                  fill
                  sizes="24px"
                  className="object-contain"
                  style={!isApex ? { filter: "brightness(0)" } : undefined}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sub-card actions row */}
      {showActions && (
        <>
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.22em] transition-opacity hover:opacity-60 cursor-pointer"
              style={{
                fontFamily: MONO,
                color: isApex ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)",
              }}
            >
              <RotateCcw className="h-3 w-3" />
              {flipped ? "View front" : "Flip card"}
            </button>

            <span
              className="h-3 w-px"
              style={{ backgroundColor: isApex ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }}
            />

            <button
              type="button"
              onClick={shareCard}
              disabled={shareState === "loading"}
              className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70 disabled:opacity-40 cursor-pointer"
              style={{
                fontFamily: MONO,
                color:
                  shareState === "done"
                    ? isApex
                      ? "#d8ac52"
                      : isCapella
                        ? "#c8922a"
                        : "#e8628a"
                    : isApex
                      ? "rgba(255,255,255,0.75)"
                      : "rgba(0,0,0,0.65)",
              }}
            >
              {shareState === "done" ? (
                <Check className="h-3 w-3" />
              ) : shareState === "loading" ? (
                <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
              ) : (
                <Share2 className="h-3 w-3" />
              )}
              {shareState === "done" ? "Saved!" : "Share card"}
            </button>
          </div>

          <p
            className="font-mono text-[8px] uppercase tracking-[0.28em] -mt-1"
            style={{
              fontFamily: MONO,
              color: isApex ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)",
            }}
          >
            {shareError ? shareError : "Share to Instagram · WhatsApp · X Status"}
          </p>
        </>
      )}
    </div>
  );
}
