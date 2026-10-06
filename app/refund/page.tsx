import type { Metadata } from 'next';
import SubpageShell from '@/components/layout/SubpageShell';

export const metadata: Metadata = {
  title: 'Refund Policy - REBELIVE',
  description:
    'Return & Refund Policy for Rebelive, operated by Oxytrium Dynamics Private Limited. Learn how we handle returns, replacements, and refunds.',
};

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export default function RefundPage() {
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
              Return &amp; Refund Policy
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
                At <strong>Rebelive</strong>, your satisfaction is our top priority. If something&apos;s not quite right with your order, we&apos;re here to help.
              </p>
              <p>
                Please read our Return &amp; Refund Policy below for details on how we handle returns, replacements, and refunds.
              </p>
            </div>

            {/* 1. Order Cancellations */}
            <Section number="1" title="Order Cancellations">
              <p>
                Orders can be cancelled only within <strong>1 hour</strong> of placing the order or before the order is processed, whichever is earlier. Once an order has been processed or shipped, cancellations will not be accepted.
              </p>
            </Section>

            {/* 2. Eligibility for Returns */}
            <Section number="2" title="Eligibility for Returns">
              <p className="mb-3">
                Due to the consumable nature of our products, we are only able to accept returns under the following conditions:
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 mb-5">
                <BulletList items={[
                  'You received the wrong item.',
                  'Your item arrived damaged or defective.',
                  'There is a confirmed quality issue with the product.',
                ]} />
              </div>

              <p className="mb-3 text-white/90 font-medium">
                We are unable to accept returns for:
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <BulletList items={[
                  'Opened or partially consumed products (unless there is a verified quality issue)',
                  'Items purchased more than 7 days ago',
                  'Gift cards, promotional items, or free samples',
                  'Products disliked due to taste preference or personal expectations.',
                ]} />
              </div>
            </Section>

            {/* 3. Damaged or Incorrect Orders */}
            <Section number="3" title="Damaged or Incorrect Orders">
              <p className="mb-3">
                If your order arrives damaged, defective, or incorrect, please contact us within <strong>7 days</strong> of delivery with the following:
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 mb-4">
                <BulletList items={[
                  'Your order number',
                  'A clear photo of the item and the packaging',
                  'A brief description of the issue',
                ]} />
              </div>

              <p className="mb-2 text-white/85 font-medium">
                We&apos;ll investigate the issue and either:
              </p>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <BulletList items={[
                  'Ship a replacement at no extra cost, or',
                  'Issue a refund to your original payment method',
                ]} />
              </div>
            </Section>

            {/* 4. Refunds (if applicable) */}
            <Section number="4" title="Refunds (if applicable)">
              <p className="mb-3">
                Once we&apos;ve reviewed your request, we&apos;ll notify you of the approval or rejection of your refund. If approved:
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 mb-4">
                <BulletList items={[
                  'Refunds will be processed within 5-7 business days to your original payment method',
                  'You’ll receive an email confirmation once your refund has been issued',
                ]} />
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white/70 space-y-2">
                <p>
                  <strong className="text-white">Please note:</strong> Depending on your bank or payment provider, it may take additional time for the refund to appear in your account.
                </p>
                <p>
                  Approved refunds may be issued as a replacement, store credit, or original payment refund, at Rebelive&apos;s discretion, depending on the nature of the issue.
                </p>
              </div>
            </Section>

            {/* 5. Delivery Delays */}
            <Section number="5" title="Delivery Delays">
              <p>
                Delays caused by courier partners, weather conditions, public holidays, or unforeseen circumstances do not qualify for refunds unless the order is lost or returned to origin.
              </p>
              <p className="mt-3 text-white/70">
                Rebelive reserves the right to approve or reject refund requests based on verification and internal quality checks.
              </p>
            </Section>

            {/* Footer Sign-off & Contact */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-semibold text-white">
                Thank you for purchasing from Rebelive (OXYTRIUM DYNAMICS PRIVATE LIMITED)!
              </h3>
              <p className="text-sm text-white/70">
                If you have questions about your order or need to initiate a return or replacement, reach out to our team:
              </p>
              <div
                className="pt-3 border-t border-white/10 space-y-2 font-mono text-xs text-white/80"
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
            </div>

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
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-[14px] text-white/75 leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
