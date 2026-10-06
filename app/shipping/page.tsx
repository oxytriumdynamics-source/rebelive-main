import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageShell from '@/components/layout/SubpageShell';

export const metadata: Metadata = {
  title: 'Shipping Policy - REBELIVE',
  description:
    'Shipping & Delivery Policy for domestic orders within India on rebelive.com, operated by Oxytrium Dynamics Private Limited.',
};

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export default function ShippingPage() {
  return (
    <>
      <style>{`
        html, body {
          position: static !important;
          overflow: auto !important;
          height: auto !important;
          inset: auto !important;
          overscroll-behavior: auto !important;
        }
      `}</style>

      <SubpageShell>
        <div style={{ fontFamily: SANS }} className="relative text-white">
          {/* Hero Header */}
          <div className="border-b border-white/10 px-6 py-14 text-center sm:px-12 sm:py-20 ">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-3"
              style={{ fontFamily: MONO }}
            >
              Oxytrium Dynamics Private Limited
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Shipping &amp; Delivery Policy
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p
                className="text-[11px] tracking-wider text-white/70"
                style={{ fontFamily: MONO }}
              >
                Last updated: 20th September 2026
              </p>
            </div>
          </div>

          {/* Content Container */}
          <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12 sm:py-16 space-y-10">
            {/* Introduction Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-3 text-[15px] leading-relaxed text-white/80">
              <p>
                Thank you for shopping with <strong>rebelive.com</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). This Shipping &amp; Delivery Policy outlines how we handle shipping for domestic orders within India. By placing an order with us, you agree to this policy.
              </p>
            </div>

            {/* 1. Shipping Methods & Carriers */}
            <Section number="1" title="Shipping Methods & Carriers">
              <p>
                Domestic orders are shipped via trusted courier services. Estimated delivery timelines typically range from <strong>3–7 business days</strong> within India, depending on location and courier service.
              </p>
            </Section>

            {/* 2. Order Processing Times */}
            <Section number="2" title="Order Processing Times">
              <BulletList items={[
                'Orders are typically processed within 1–3 business days after payment confirmation.',
                'Processing may take longer during peak seasons or due to high demand.',
                'You\'ll receive a shipping confirmation email with tracking details once your order is dispatched.',
              ]} />
            </Section>

            {/* 3. Delivery Address & Tracking */}
            <Section number="3" title="Delivery Address & Tracking">
              <BulletList items={[
                'Delivery will be made to the address you provide at checkout. Please double-check the accuracy.',
                'Tracking information is emailed and/or texted at the time of shipment dispatch.',
                'We are not responsible for delivery delays or wrong deliveries due to incorrect or incomplete addresses provided by you.',
              ]} />
              <div className="mt-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white/70 flex items-center justify-between">
                <span>Looking to track an existing shipment?</span>
                <Link href="/track-order" className="text-white underline hover:text-emerald-400 font-medium">
                  Go to Track Order →
                </Link>
              </div>
            </Section>

            {/* 4. Delivery Times & Delays */}
            <Section number="4" title="Delivery Times & Delays">
              <p className="mb-2">Estimated delivery times may vary due to:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-white/70 mb-4">
                <li>Courier/postal service performance</li>
                <li>Weather disruptions and public holidays</li>
              </ul>
              <p className="text-sm text-white/75">
                If your order is significantly delayed, please contact us at{' '}
                <a href="mailto:support@rebelive.com" className="text-white underline hover:text-emerald-400">
                  support@rebelive.com
                </a>{' '}
                and we&apos;ll investigate with the carrier.
              </p>
            </Section>

            {/* 5. Shipping Costs & Duties */}
            <Section number="5" title="Shipping Costs & Duties">
              <p>
                Shipping charges are calculated at checkout based on your order size, weight, and destination.
              </p>
            </Section>

            {/* 6. Damaged or Lost Shipments */}
            <Section number="6" title="Damaged or Lost Shipments">
              <BulletList items={[
                'If your package arrives damaged, or is lost in transit, contact our support team within 7 days of delivery (or expected delivery date in case of loss). Include your order number, tracking details, and photos of the damage.',
                'We’ll work with the carrier to resolve the issue promptly.',
              ]} />
            </Section>

            {/* 7. Undeliverable Packages */}
            <Section number="7" title="Undeliverable Packages">
              <p>
                Packages returned to us due to incorrect addresses, refusal of delivery, or inability to deliver will incur additional shipping charges for re-shipment.
              </p>
            </Section>

            {/* 8. Changes to Orders */}
            <Section number="8" title="Changes to Orders">
              <BulletList items={[
                'Need to update your shipping address or cancel your order? Contact us within 1 hour of placing your order or before the order is processed, whichever is earlier.',
                'After your order is processed or shipped, changes or cancellations may not be possible.',
              ]} />
            </Section>

            {/* 9. Contact Us */}
            <Section number="9" title="Contact Us">
              <p className="mb-3">
                For any questions or concerns about your shipment, please reach out:
              </p>
              <div
                className="rounded-2xl border border-white/15 bg-white/[0.04] p-5 space-y-2 font-mono text-xs text-white/80"
                style={{ fontFamily: MONO }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-white/50 uppercase">Email:</span>
                  <a
                    href="mailto:support@rebelive.com"
                    className="text-white underline hover:text-emerald-400 font-sans normal-case text-sm"
                  >
                    support@rebelive.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-white/50 uppercase">WhatsApp:</span>
                  <a
                    href="https://wa.me/message/CV56ETMKXMV5M1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline hover:text-emerald-400 font-sans normal-case text-sm"
                  >
                    Chat with Rebelive Support
                  </a>
                </div>
                <div className="pt-2 text-white/60">
                  Oxytrium Dynamics Private Limited • 2nd Floor, House No. 81, Ward No. 12, Manikpur, Keshopur, Buxar, Bihar - 802113
                </div>
              </div>
            </Section>

            {/* 10. Policy Updates */}
            <Section number="10" title="Policy Updates">
              <p>
                We may update this policy occasionally. Any changes will be posted here with a revised &ldquo;Last updated&rdquo; date. Continued use of <strong>rebelive.com</strong> means you accept these updates.
              </p>
            </Section>

          </div>
        </div>
      </SubpageShell>
    </>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 border-b border-white/15 pb-2.5">
        <span
          className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white/90"
          style={{ fontFamily: MONO }}
        >
          {number}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: SANS }}>
          {title}
        </h2>
      </div>
      <div className="text-[14.5px] leading-relaxed text-white/75 space-y-3 pl-1 sm:pl-2">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-[14px] text-white/75 leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
