import Image from "next/image";
import Link from "next/link";

/**
 * NavLogo - uses the real REBELIVE brand PNG from /public/brand.
 * tone="light" -> black logo for light backgrounds
 * tone="dark"  -> inverts to white for dark backgrounds
 */
export default function NavLogo({
  tone = "light",
  width = 180,
  className = "",
}: {
  tone?: "light" | "dark";
  width?: number;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="REBELIVE Home"
      className={`relative flex items-center cursor-pointer transition-opacity hover:opacity-75 ${className}`}
      style={{ width, height: width * 0.32 }}
    >
      <Image
        src="/brand/REBELIVE Logo Black.webp"
        alt="REBELIVE"
        fill
        priority
        sizes="(max-width: 840px) 240px, 360px"
        className="object-contain object-left"
        style={tone === "dark" ? { filter: "invert(1) brightness(1.1)" } : undefined}
      />
    </Link>
  );
}
