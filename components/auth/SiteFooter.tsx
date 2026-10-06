import Link from "next/link";

const MONO = "'Poppins', sans-serif";

interface SiteFooterProps {
  borderColor?: string;
  textColor?: string;
  className?: string;
}

/**
 * Shared minimal footer matching start project stage footer
 */
export default function SiteFooter({
  borderColor = "border-black/10",
  textColor = "text-black/65",
  className = "",
}: SiteFooterProps) {
  return (
    <footer
      className={`relative z-20 flex w-full items-center justify-between gap-4 px-4 py-2.5 sm:px-10 border-t ${borderColor} ${textColor} ${className}`}
    >
      {/* Left - copyright */}
      <span
        className="font-mono text-[10px] uppercase tracking-[0.18em] shrink-0 hidden sm:block"
        style={{ fontFamily: MONO }}
      >
        © Oxytrium Dynamics Private Limited
      </span>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.18em] shrink-0 sm:hidden"
        style={{ fontFamily: MONO }}
      >
        © Oxytrium Dynamics
      </span>

      {/* Centre - tagline */}
      <span
        className="font-mono text-[9px] uppercase tracking-[0.3em] shrink-0 mx-auto"
        style={{ fontFamily: MONO }}
      >
        WAKE · FUEL · REBEL
      </span>

      {/* Right - legal links */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap justify-end">
        <Link
          href="/privacy"
          className="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100"
          style={{ fontFamily: MONO }}
        >
          Privacy
        </Link>
        <span className="opacity-40">·</span>
        <Link
          href="/terms"
          className="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100"
          style={{ fontFamily: MONO }}
        >
          Terms
        </Link>
        <span className="opacity-40">·</span>
        <Link
          href="/shipping"
          className="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100"
          style={{ fontFamily: MONO }}
        >
          Shipping
        </Link>
        <span className="opacity-40">·</span>
        <Link
          href="/refund"
          className="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100"
          style={{ fontFamily: MONO }}
        >
          Refund
        </Link>
      </div>
    </footer>
  );
}
