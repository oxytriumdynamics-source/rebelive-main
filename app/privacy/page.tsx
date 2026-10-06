import type { Metadata } from 'next';
import SubpageShell from '@/components/layout/SubpageShell';

export const metadata: Metadata = {
  title: 'Privacy Policy - REBELIVE',
  description:
    'Privacy Policy for rebelive.com, operated by Oxytrium Dynamics Private Limited. Learn how we collect, use, and protect your personal information.',
};

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export default function PrivacyPage() {
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
          <div className="border-b border-white/10 px-6 py-14 text-center sm:px-12 sm:py-20">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-3"
              style={{ fontFamily: MONO }}
            >
              Oxytrium Dynamics Private Limited
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Privacy Policy
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p
                className="text-[11px] tracking-wider text-white/70"
                style={{ fontFamily: MONO }}
              >
                Last updated: 20th September, 2026
              </p>
            </div>
          </div>

          {/* Content Container */}
          <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12 sm:py-16 space-y-12">

            {/* Overview / Introduction */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-4 text-[15px] leading-relaxed text-white/80">
              <p>
                This Privacy Policy describes how <strong>Rebelive</strong> (the &quot;Site&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from <strong className="text-white">rebelive.com</strong> (the &quot;Site&quot;) or otherwise communicate with us regarding the Site (collectively, the &quot;Services&quot;). For purposes of this Privacy Policy, &quot;you&quot; and &quot;your&quot; means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.
              </p>
              <p>
                Please read this Privacy Policy carefully. By using and accessing any of the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not use or access any of the Services.
              </p>
              <div className="pt-2 border-t border-white/10 text-white/90 font-medium">
                Rebelive is a consumer wellness and functional beverage brand operated by <strong>Oxytrium Dynamics Pvt. Ltd.</strong> We value transparency and do not treat user data as a business model. Personal information is collected only to operate, improve, and communicate our services responsibly.
              </div>
            </div>

            {/* Changes to This Privacy Policy */}
            <Section title="Changes to This Privacy Policy">
              <p>
                We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the &quot;Last updated&quot; date and take any other steps required by applicable law.
              </p>
            </Section>

            {/* How We Collect and Use Your Personal Information */}
            <Section title="How We Collect and Use Your Personal Information">
              <p>
                To provide the Services, we collect personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.
              </p>
              <p>
                In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide or improve the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.
              </p>
            </Section>

            {/* What Personal Information We Collect */}
            <Section title="What Personal Information We Collect">
              <p>
                The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term &quot;personal information&quot;, we are referring to information that identifies, relates to, describes or can be associated with you. The following sections describe the categories and specific types of personal information we collect.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <SubHeading>Information We Collect Directly from You</SubHeading>
                  <p className="mb-3 text-[14px] text-white/70">
                    Information that you directly submit to us through our Services may include:
                  </p>
                  <BulletList items={[
                    'Contact details including your name, address, phone number, and email.',
                    'Order information including your name, billing address, shipping address, payment confirmation, email address, and phone number.',
                    'Account information including your username, password, security questions and other information used for account security purposes.',
                    'Customer support information including the information you choose to include in communications with us, for example, when sending a message through the Services.',
                  ]} />
                  <p className="mt-3 text-xs text-white/50 italic">
                    Some features of the Services may require you to directly provide us with certain information about yourself. You may elect not to provide this information, but doing so may prevent you from using or accessing these features.
                  </p>
                </div>

                <div>
                  <SubHeading>Information We Collect about Your Usage</SubHeading>
                  <p>
                    We may also automatically collect certain information about your interaction with the Services (&quot;Usage Data&quot;). To do this, we may use cookies, pixels and similar technologies (&quot;Cookies&quot;). Usage Data may include information about how you access and use our Site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with the Services.
                  </p>
                  <p className="mt-2 text-white/70">
                    This information is used in aggregated form to understand how users interact with our Services and to improve performance and experience.
                  </p>
                </div>

                <div>
                  <SubHeading>Information We Obtain from Third Parties</SubHeading>
                  <p className="mb-3 text-[14px] text-white/70">
                    Finally, we may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as:
                  </p>
                  <BulletList items={[
                    'Companies who support our Site and Services.',
                    'Our payment processors, who collect payment information (e.g., bank account, credit or debit card information, billing address) to process your payment in order to fulfill your orders and provide you with products or services you have requested, in order to perform our contract with you.',
                    'When you visit our Site, open or click on emails we send you, or interact with our Services or advertisements, we, or third parties we work with, may automatically collect certain information using online tracking technologies such as pixels, web beacons, software developer kits, third-party libraries, and cookies.',
                  ]} />
                  <p className="mt-3 text-xs text-white/50">
                    Any information we obtain from third parties will be treated in accordance with this Privacy Policy. Also see the section below, Third Party Websites and Links.
                  </p>
                </div>
              </div>
            </Section>

            {/* How We Use Your Personal Information */}
            <Section title="How We Use Your Personal Information">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <h4 className="font-semibold text-white text-sm mb-1">Providing Products and Services</h4>
                  <p className="text-white/70 text-sm">
                    We use your personal information to provide you with the Services in order to perform our contract with you, including to process your payments, fulfill your orders, to send notifications to you related to your account, purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage your account, to arrange for shipping, facilitate any returns and exchanges and other features and functionalities related to your account.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <h4 className="font-semibold text-white text-sm mb-1">Marketing and Advertising</h4>
                  <p className="text-white/70 text-sm">
                    We may use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you advertisements for products or services. This may include using your personal information to better tailor the Services and advertising on our Site and other websites. We do not sell personal data for monetary consideration.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <h4 className="font-semibold text-white text-sm mb-1">Security and Fraud Prevention</h4>
                  <p className="text-white/70 text-sm">
                    We use your personal information to detect, investigate or take action regarding possible fraudulent, illegal or malicious activity. If you choose to use the Services and register an account, you are responsible for keeping your account credentials safe. We highly recommend that you do not share your username, password, or other access details with anyone else. If you believe your account has been compromised, please contact us immediately.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <h4 className="font-semibold text-white text-sm mb-1">Communicating with You and Service Improvement</h4>
                  <p className="text-white/70 text-sm">
                    We use your personal information to provide you with customer support and improve our Services. This is in our legitimate interests in order to be responsive to you, to provide effective services to you, and to maintain our business relationship with you.
                  </p>
                </div>
              </div>
            </Section>

            {/* Cookies */}
            <Section title="Cookies">
              <p>
                Like many websites, we use Cookies on our Site. For specific information about the Cookies that we use related to powering our store. We use Cookies to power and improve our Site and our Services (including to remember your actions and preferences), to run analytics and better understand user interaction with the Services (in our legitimate interests to administer, improve and optimize the Services). We may also permit third parties and services providers to use Cookies on our Site to better tailor the services, products and advertising on our Site and other websites.
              </p>
              <p className="mt-3">
                Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies through your browser controls. Please keep in mind that removing or blocking Cookies can negatively impact your user experience and may cause some of the Services, including certain features and general functionality, to work incorrectly or no longer be available. Additionally, blocking Cookies may not completely prevent how we share information with third parties such as our advertising partners.
              </p>
            </Section>

            {/* How We Disclose Personal Information */}
            <Section title="How We Disclose Personal Information">
              <p className="mb-3">
                In certain circumstances, we may disclose your personal information to third parties for contract fulfillment purposes, legitimate purposes and other reasons subject to this Privacy Policy. Such circumstances may include:
              </p>
              <BulletList items={[
                'With vendors or other third parties who perform services on our behalf (e.g., IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping).',
                'With business and marketing partners to provide services and advertise to you. Our business and marketing partners will use your information in accordance with their own privacy notices.',
                'When you direct, request us or otherwise consent to our disclosure of certain information to third parties, such as to ship you products or through your use of social media widgets or login integrations, with your consent.',
                'With our affiliates or otherwise within our corporate group, in our legitimate interests to run a successful business.',
                'In connection with a business transaction such as a merger or bankruptcy, to comply with any applicable legal obligations (including to respond to subpoenas, search warrants and similar requests), to enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.',
              ]} />

              <p className="mt-6 mb-4 text-white/90">
                We disclose the following categories of personal information and sensitive personal information about users for the purposes set out above in &quot;How we Collect and Use your Personal Information&quot; and &quot;How we Disclose Personal Information&quot;:
              </p>

              {/* Table 1: Category vs Recipients */}
              <div className="overflow-x-auto rounded-xl border border-white/15 bg-white/[0.02]">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/15 bg-white/[0.04]">
                      <th className="p-4 font-semibold uppercase tracking-wider text-white/80 w-1/2">
                        Category of Personal Information
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-white/80 w-1/2">
                        Categories of Recipients
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-white/70">
                    <tr>
                      <td className="p-4 align-top">
                        Identifiers such as basic contact details and certain order and account information
                      </td>
                      <td className="p-4 align-top" rowSpan={4}>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Vendors and third parties who perform services on our behalf (such as Internet service providers, payment processors, fulfillment partners, customer support partners and data analytics providers)</li>
                          <li>Business and marketing partners</li>
                          <li>Affiliates</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 align-top">
                        Commercial information such as order information, shopping information and customer support information
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 align-top">
                        Internet or other similar network activity, such as Usage Data
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 align-top">
                        Geolocation data such as locations determined by an IP address or other technical measures
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-5 text-sm text-white/80">
                We do not use or disclose sensitive personal information without your consent or for the purposes of inferring characteristics about you.
              </p>

              <div className="mt-6">
                <p className="mb-3 text-sm text-white/80">
                  We have &ldquo;sold&rdquo; and &ldquo;shared&rdquo; (as those terms are defined in applicable law) personal information over the preceding 12 months for the purpose of engaging in advertising and marketing activities, as follows:
                </p>

                {/* Table 2: Sold / Shared */}
                <div className="overflow-x-auto rounded-xl border border-white/15 bg-white/[0.02]">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/15 bg-white/[0.04]">
                        <th className="p-3.5 font-semibold uppercase tracking-wider text-white/80 w-1/2">
                          Category of Personal Information
                        </th>
                        <th className="p-3.5 font-semibold uppercase tracking-wider text-white/80 w-1/2">
                          Categories of Recipients
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white/70">
                      <tr>
                        <td className="p-3.5">Identifiers such as name, e-mail address and phone number</td>
                        <td className="p-3.5">Business and marketing partners</td>
                      </tr>
                      <tr>
                        <td className="p-3.5">Commercial information such as records of products or services purchased</td>
                        <td className="p-3.5">Business and marketing partners</td>
                      </tr>
                      <tr>
                        <td className="p-3.5">Usage Data</td>
                        <td className="p-3.5">Business and marketing partners</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-white/80 leading-relaxed">
                  <strong className="text-emerald-400">For clarity:</strong> &ldquo;sharing&rdquo; refers to the use of advertising, analytics, and marketing technologies. Rebelive does not sell personal data such as names, phone numbers, or email addresses as a standalone commercial activity.
                </div>
              </div>
            </Section>

            {/* User Generated Content */}
            <Section title="User Generated Content">
              <p>
                The Services may enable you to post product reviews and other user-generated content. If you choose to submit user generated content to any public area of the Services, this content will be public and accessible by anyone.
              </p>
              <p className="mt-2">
                We do not control who will have access to the information that you choose to make available to others, and cannot ensure that parties who have access to such information will respect your privacy or keep it secure. We are not responsible for the privacy or security of any information that you make publicly available, or for the accuracy, use or misuse of any information that you disclose or receive from third parties.
              </p>
            </Section>

            {/* Third Party Websites and Links */}
            <Section title="Third Party Websites and Links">
              <p>
                Our Site may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites.
              </p>
              <p className="mt-2">
                Information you provide on public or semi-public venues, including information you share on third-party social networking platforms may also be viewable by other users of the Services and/or users of those third-party platforms without limitation as to its use by us or by a third party. Our inclusion of such links does not, by itself, imply any endorsement of the content on such platforms or of their owners or operators, except as disclosed on the Services.
              </p>
            </Section>

            {/* Children's Data */}
            <Section title="Children's Data">
              <p>
                The Services are not intended to be used by children, and we do not knowingly collect any personal information about children. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted.
              </p>
              <p className="mt-2">
                As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we &ldquo;share&rdquo; or &ldquo;sell&rdquo; (as those terms are defined in applicable law) personal information of individuals under 16 years of age.
              </p>
            </Section>

            {/* Security and Retention of Your Information */}
            <Section title="Security and Retention of Your Information">
              <p>
                Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee &ldquo;perfect security.&rdquo; In addition, any information you send to us may not be secure while in transit. We recommend that you do not use insecure channels to communicate sensitive or confidential information to us.
              </p>
              <p className="mt-2">
                How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide the Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.
              </p>
            </Section>

            {/* Your Rights */}
            <Section title="Your Rights">
              <p className="mb-4">
                Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <strong className="text-white text-sm">Right to Access / Know:</strong>
                  <span className="text-white/70 text-sm ml-1.5">You may have a right to request access to personal information that we hold about you, including details relating to the ways in which we use and share your information.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <strong className="text-white text-sm">Right to Delete:</strong>
                  <span className="text-white/70 text-sm ml-1.5">You may have a right to request that we delete personal information we maintain about you.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <strong className="text-white text-sm">Right to Correct:</strong>
                  <span className="text-white/70 text-sm ml-1.5">You may have a right to request that we correct inaccurate personal information we maintain about you.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <strong className="text-white text-sm">Right of Portability:</strong>
                  <span className="text-white/70 text-sm ml-1.5">You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <strong className="text-white text-sm">Restriction of Processing:</strong>
                  <span className="text-white/70 text-sm ml-1.5">You may have the right to ask us to stop or restrict our processing of personal information.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <strong className="text-white text-sm">Withdrawal of Consent:</strong>
                  <span className="text-white/70 text-sm ml-1.5">Where we rely on consent to process your personal information, you may have the right to withdraw this consent.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <strong className="text-white text-sm">Appeal:</strong>
                  <span className="text-white/70 text-sm ml-1.5">You may have a right to appeal our decision if we decline to process your request. You can do so by replying directly to our denial.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <strong className="text-white text-sm">Managing Communication Preferences:</strong>
                  <span className="text-white/70 text-sm ml-1.5">We may send you promotional emails, and you may opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you. If you opt out, we may still send you non-promotional emails, such as those about your account or orders that you have made.</span>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/75 leading-relaxed">
                <p>
                  You may exercise any of these rights where indicated on our Site or by contacting us using the contact details provided below.
                </p>
                <p>
                  We will not discriminate against you for exercising any of these rights. We may need to collect information from you to verify your identity, such as your email address or account information, before providing a substantive response to the request. In accordance with applicable laws, you may designate an authorized agent to make requests on your behalf to exercise your rights. Before accepting such a request from an agent, we will require that the agent provide proof you have authorized them to act on your behalf, and we may need you to verify your identity directly with us. We will respond to your request in a timely manner as required under applicable law.
                </p>
              </div>
            </Section>

            {/* Complaints */}
            <Section title="Complaints">
              <p>
                If you have complaints about how we process your personal information, please contact us using the contact details provided below. If you are not satisfied with our response to your complaint, depending on where you live you may have the right to appeal our decision by contacting us using the contact details set out below, or lodge your complaint with your local data protection authority.
              </p>
            </Section>

            {/* Compliance with Indian Data Protection Laws */}
            <Section title="Compliance with Indian Data Protection Laws">
              <div className="p-5 rounded-xl border border-white/15 bg-white/[0.03]">
                <p className="text-[14.5px] leading-relaxed text-white/85">
                  We comply with applicable Indian data protection laws, including the <strong className="text-white">Digital Personal Data Protection Act, 2023</strong>. Users may contact us using the details below to raise concerns or request information related to their personal data.
                </p>
              </div>
            </Section>

            {/* International Users */}
            <Section title="International Users">
              <p>
                Please note that we may transfer, store and process your personal information outside the country you live in. Your personal information is also processed by staff and third party service providers and partners in these countries.
              </p>
              <p className="mt-2">
                If we transfer your personal information out of Europe, we will rely on recognized transfer mechanisms like the European Commission&apos;s Standard Contractual Clauses, or any equivalent contracts issued by the relevant competent authority of the UK, as relevant, unless the data transfer is to a country that has been determined to provide an adequate level of protection.
              </p>
            </Section>

            {/* Contact Information */}
            <Section title="Contact">
              <p className="text-white/80">
                Rebelive is a brand owned and operated by <strong className="text-white">Oxytrium Dynamics Private Limited</strong>.
              </p>
              <p className="mt-2 text-white/80">
                Should you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of the rights available to you, please call or email us or contact us at our registered office:
              </p>

              <div
                className="mt-5 rounded-2xl border border-white/15 bg-white/[0.04] p-6 space-y-3 font-mono text-xs text-white/80"
                style={{ fontFamily: MONO }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="uppercase text-white/50 tracking-wider">Email:</span>
                  <a
                    href="mailto:support@rebelive.com"
                    className="text-white underline hover:text-emerald-400 font-sans normal-case text-sm"
                  >
                    support@rebelive.com
                  </a>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1 text-white/85">
                  <div className="font-semibold text-white tracking-wider">OXYTRIUM DYNAMICS PRIVATE LIMITED</div>
                  <div>2nd Floor, House No. 81, Ward No. 12</div>
                  <div>Manikpur, Keshopur, Buxar</div>
                  <div>Rajpur, Bihar, India - 802113</div>
                </div>
              </div>
            </Section>

          </div>
        </div>
      </SubpageShell>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2
        className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/60 border-b border-white/15 pb-2.5"
        style={{ fontFamily: MONO }}
      >
        {title}
      </h2>
      <div className="text-[14.5px] leading-relaxed text-white/75 space-y-3">{children}</div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-semibold text-[14px] text-white/90 mt-5 mb-2" style={{ fontFamily: SANS }}>
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 pl-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-[14px] text-white/75 leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
