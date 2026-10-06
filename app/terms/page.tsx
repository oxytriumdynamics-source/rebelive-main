import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageShell from '@/components/layout/SubpageShell';

export const metadata: Metadata = {
  title: 'Terms of Service - REBELIVE',
  description:
    'Terms and Conditions for rebelive.com, operated by Oxytrium Dynamics Private Limited.',
};

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export default function TermsPage() {
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
          <div className="border-b border-white/10 px-6 py-14 text-center sm:px-12 sm:py-20 bg-gradient-to-b from-white/[0.02] to-transparent">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-3"
              style={{ fontFamily: MONO }}
            >
              Oxytrium Dynamics Private Limited
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Terms &amp; Conditions
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p
                className="text-[11px] tracking-wider text-white/70"
                style={{ fontFamily: MONO }}
              >
                Effective Date: 20th September 2026
              </p>
            </div>
          </div>

          {/* Content Container */}
          <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12 sm:py-16 space-y-10">
            {/* Introduction Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-4 text-[15px] leading-relaxed text-white/80">
              <p>
                Welcome to <strong>rebelive.com</strong> (&ldquo;Site&rdquo;), operated by{' '}
                <strong>Oxytrium Dynamics Private Limited</strong>, 2nd Floor, House No. 81, Ward No. 12, Manikpur, Keshopur, Buxar, Rajpur, Bihar, India, 802113 (&ldquo;Rebelive&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
              </p>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your use of our website and services. By accessing or using this Site, you agree to be bound by these Terms and our <Link href="/privacy" className="text-white underline hover:text-emerald-400">Privacy Policy</Link>. If you do not agree, please do not use our Site.
              </p>
            </div>

            {/* Eligibility */}
            <div className="p-5 rounded-xl border border-white/15 bg-white/[0.03]">
              <h2 className="text-base font-bold text-white mb-2" style={{ fontFamily: SANS }}>
                Eligibility
              </h2>
              <p className="text-[14.5px] leading-relaxed text-white/80">
                By using this Site, you confirm that you are at least <strong>18 years old</strong> or accessing the Site under the supervision of a parent or legal guardian.
              </p>
            </div>

            {/* 1. Products and Services */}
            <Section number="1" title="Products and Services">
              <p>
                We offer food &amp; beverages and other related products for sale. All purchases are subject to availability. We reserve the right to modify or discontinue products at any time without notice.
              </p>
              <p>
                Prices are subject to change without notice. We make every effort to display accurate product information but do not guarantee the completeness, accuracy, or reliability of any content.
              </p>
            </Section>

            {/* 2. Orders, Billing, and Subscriptions */}
            <Section number="2" title="Orders, Billing, and Subscriptions">
              <p>
                By placing an order, you agree to provide current, complete, and accurate purchase and account information.
              </p>
              <p>
                If you opt into a subscription or recurring service, you authorize us to charge your payment method at the designated intervals. You may cancel your subscription at any time through your account dashboard or by contacting us.
              </p>
            </Section>

            {/* 3. Shipping and Returns */}
            <Section number="3" title="Shipping and Returns">
              <p>
                Please refer to our{' '}
                <Link href="/shipping" className="text-white underline hover:text-emerald-400 font-medium">
                  Shipping Policy
                </Link>{' '}
                and{' '}
                <Link href="/refund" className="text-white underline hover:text-emerald-400 font-medium">
                  Refund &amp; Returns Policy
                </Link>{' '}
                for information on processing times, delivery methods, and return eligibility.
              </p>
            </Section>

            {/* 4. Intellectual Property */}
            <Section number="4" title="Intellectual Property">
              <p>
                All content on this Site, including logos, images, graphics, text, product names, and designs, is the property of Rebelive or our licensors. You may not copy, modify, distribute, or use any part of this Site without prior written consent.
              </p>
            </Section>

            {/* 5. User Conduct */}
            <Section number="5" title="User Conduct">
              <p className="mb-3">You agree not to:</p>
              <BulletList items={[
                'Use the Site for any unlawful purpose',
                'Attempt to gain unauthorized access to our systems',
                'Interfere with the security or integrity of the Site',
                'Post or transmit any harmful, defamatory, or infringing content',
              ]} />
            </Section>

            {/* 6. Third-Party Links */}
            <Section number="6" title="Third-Party Links">
              <p>
                The Site may contain links to third-party websites that are not controlled by us. We are not responsible for their content, terms, or practices.
              </p>
            </Section>

            {/* 7. Disclaimer of Warranties */}
            <Section number="7" title="Disclaimer of Warranties">
              <p>
                Your use of the Site is at your sole risk. The Site and all products are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white/70 italic">
                Individual results may vary. Our products are not intended to diagnose, treat, cure, or prevent any disease.
              </div>
            </Section>

            {/* 8. Limitation of Liability */}
            <Section number="8" title="Limitation of Liability">
              <p>
                To the fullest extent permitted by law, Rebelive shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or products, including lost profits or data, even if we have been advised of the possibility of such damages.
              </p>
            </Section>

            {/* 9. Indemnification */}
            <Section number="9" title="Indemnification">
              <p>
                You agree to indemnify and hold Rebelive harmless from any claims, losses, liabilities, or expenses (including legal fees) arising out of your use of the Site, violation of these Terms, or infringement of any third-party rights.
              </p>
            </Section>

            {/* 10. Changes to These Terms */}
            <Section number="10" title="Changes to These Terms">
              <p>
                We may update these Terms at any time. If we make material changes, we&apos;ll post the new Terms on this page with a revised effective date. Continued use of the Site after changes means you accept the updated Terms.
              </p>
            </Section>

            {/* 11. Governing Law */}
            <Section number="11" title="Governing Law">
              <p>
                These Terms are governed by the laws of India, without regard to its conflict of laws principles.
              </p>
            </Section>

            {/* 12. Contact Us */}
            <Section number="12" title="Contact Us">
              <p className="text-white/80">
                Rebelive is a brand owned and operated by <strong>Oxytrium Dynamics Private Limited</strong>.
              </p>
              <p className="mt-2 text-white/80">
                If you have questions or concerns about these Terms, please contact us at:
              </p>

              <div
                className="mt-4 rounded-2xl border border-white/15 bg-white/[0.04] p-5 space-y-2 font-mono text-xs text-white/80"
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
                <div className="pt-2 text-white/60">
                  Oxytrium Dynamics Private Limited • 2nd Floor, House No. 81, Ward No. 12, Manikpur, Keshopur, Buxar, Rajpur, Bihar, India, 802113
                </div>
              </div>
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
