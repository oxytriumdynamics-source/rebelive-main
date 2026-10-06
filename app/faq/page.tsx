'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, HelpCircle, MessageSquare, X } from 'lucide-react';
import SubpageShell from '@/components/layout/SubpageShell';

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export type FaqCategory = 'THE PRODUCT' | "REBEL'S PERSONA" | 'SAFETY' | 'ORDERS & DELIVERY';

interface FaqItem {
  id: string;
  category: FaqCategory;
  number: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  // THE PRODUCT
  {
    id: '01',
    category: 'THE PRODUCT',
    number: '01',
    question: 'What exactly is Rebelive?',
    answer:
      'Rebelive is a functional beverage built for days that ask more of you. It combines **natural caffeine, L-theanine, Ashwagandha KSM66, prebiotics, probiotics, vitamins and minerals** designed to support **energy, focus, stress support, gut health, hydration and everyday wellbeing**.',
  },
  {
    id: '02',
    category: 'THE PRODUCT',
    number: '02',
    question: 'Is Rebelive an energy drink?',
    answer:
      'Rebelive goes beyond the traditional energy drink. While energy drinks are primarily built around an energy boost, Rebelive takes a more **holistic approach** by combining energy, focus, stress support, gut health, hydration, vitamins and minerals in one functional beverage. It is built not just to give you energy, but to support more of what your day demands.',
  },
  {
    id: '03',
    category: 'THE PRODUCT',
    number: '03',
    question: 'Does Rebelive contain sugar?',
    answer:
      'Rebelive contains **no added sugar** and is sweetened with **monk fruit**, a non-caloric sweetener that keeps things sweet without the unnecessary sugar load.',
  },
  {
    id: '04',
    category: 'THE PRODUCT',
    number: '04',
    question: 'How much caffeine is in Rebelive?',
    answer:
      'Each 250 ml serving contains **50 mg of natural caffeine**, designed to provide an energy boost while being complemented by functional ingredients such as L-theanine.',
  },

  // REBEL'S PERSONA
  {
    id: '05',
    category: "REBEL'S PERSONA",
    number: '05',
    question: 'What is Rebel’s Persona?',
    answer:
      'Rebel’s Persona is our way of figuring out **what kind of Rebel you are**. Answer a few questions about how you think, work, recharge and take on life, and we’ll match you with the Persona that fits you best.',
  },
  {
    id: '06',
    category: "REBEL'S PERSONA",
    number: '06',
    question: 'How does the Persona test work?',
    answer:
      'It’s simple. Answer honestly, let us connect the dots, and you’ll discover your Rebel’s Persona. There are no right answers, no wrong answers and absolutely no personality exam you need to study for.',
  },
  {
    id: '07',
    category: "REBEL'S PERSONA",
    number: '07',
    question: 'What do I get after discovering my Persona?',
    answer:
      'Your Persona is more than a result on a screen. You get your **Rebel Persona ID**, which becomes your identity inside the Rebelive ecosystem and can unlock **Persona specific experiences, rewards, exclusive drops, early access and annual benefits** as the ecosystem grows.',
  },
  {
    id: '08',
    category: "REBEL'S PERSONA",
    number: '08',
    question: 'Do different Personas get different benefits?',
    answer:
      'They can. We’re building Rebelive so your Persona can influence the experiences, rewards and opportunities you get along the way. Your Persona isn\'t just a label. It’s your way into the Rebelive world.',
  },

  // SAFETY
  {
    id: '09',
    category: 'SAFETY',
    number: '09',
    question: 'How much Rebelive can I have in a day?',
    answer:
      'We recommend consuming **no more than 500 ml per day**. Each 250 ml can contains 50 mg of caffeine.',
  },
  {
    id: '10',
    category: 'SAFETY',
    number: '10',
    question: 'Who should not consume Rebelive?',
    answer:
      'Rebelive is **not recommended for children, pregnant or lactating women, or persons sensitive to caffeine**. It is **not suitable for anyone below 18 years of age**.',
  },
  {
    id: '11',
    category: 'SAFETY',
    number: '11',
    question: 'Anything else I should know before drinking Rebelive?',
    answer:
      'Yep. Rebelive contains **caffeine, a non-caloric sweetener and nature-identical flavouring substances**. Please consume responsibly and within the recommended limit of **500 mladd  per day**.',
  },

  // ORDERS & DELIVERY
  {
    id: '12',
    category: 'ORDERS & DELIVERY',
    number: '12',
    question: 'How long does shipping take?',
    answer:
      'We currently deliver across India. Orders typically arrive within **3 to 7 business days** after dispatch, depending on your location. You’ll receive delivery updates once your order is on its way.',
  },
  {
    id: '13',
    category: 'ORDERS & DELIVERY',
    number: '13',
    question: 'How can I track my order?',
    answer:
      'Once your order has been shipped, you’ll receive a **tracking link** on your registered contact details. You can also track your order anytime from the **Orders section** of your Rebelive account.',
  },
  {
    id: '14',
    category: 'ORDERS & DELIVERY',
    number: '14',
    question: 'Can I cancel or modify my order?',
    answer:
      'Yes, as long as your order hasn’t been dispatched. Contact us as soon as possible with your order details and we’ll do our best to make the changes. Once shipped, cancellation or modification may not be possible.',
  },
  {
    id: '15',
    category: 'ORDERS & DELIVERY',
    number: '15',
    question: 'What is your refund and replacement policy?',
    answer:
      'If your order qualifies for a refund or replacement, contact us with your order details and the relevant information. Once the issue is reviewed and approved, we’ll process the appropriate resolution.',
  },
  {
    id: '16',
    category: 'ORDERS & DELIVERY',
    number: '16',
    question: 'What if my Rebelive arrives damaged or leaking?',
    answer:
      'Don’t drink it. Take clear photos or a short video of the damaged product and packaging, then contact us within **24 hours of delivery**. We’ll review the issue and arrange a replacement or appropriate resolution.',
  },
  {
    id: '17',
    category: 'ORDERS & DELIVERY',
    number: '17',
    question: 'Do you offer corporate or bulk orders?',
    answer:
      'Absolutely. Whether you’re stocking Rebelive for your office, event, team or organisation, we offer **corporate and bulk order solutions** with volume based pricing. Contact our team with your requirements, quantity and delivery location, and we’ll take it from there.',
  },
];

const CATEGORIES = ['ALL', 'THE PRODUCT', "REBEL'S PERSONA", 'SAFETY', 'ORDERS & DELIVERY'] as const;

function FormattedAnswer({ text }: { text: string }) {
  // Parses markdown-style **bold** text into strong tags
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="text-white font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>('01');

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

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
        <div style={{ fontFamily: SANS }} className="min-h-screen text-white bg-transparent">
          {/* Hero */}
          <div className="pt-4 pb-8 px-6 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-sm mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 font-medium" style={{ fontFamily: MONO }}>
                KNOWLEDGE BASE
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white leading-tight">
              FREQUENTLY ASKED
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
              Everything you need to know about the product, persona experience, safety guidelines, orders &amp; delivery.
            </p>

            {/* Search Bar */}
            <div className="mt-7 max-w-md mx-auto relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-white/40 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 rounded-full pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const count = cat === 'ALL' ? FAQS.length : FAQS.filter((f) => f.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] font-semibold'
                        : 'bg-white/[0.04] text-white/60 border border-white/10 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="mx-auto max-w-3xl px-6 pb-20 sm:px-12 sm:pb-28 space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-white/50 text-sm">No answers found matching &quot;{searchQuery}&quot;.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('ALL');
                  }}
                  className="mt-4 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer select-none gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 pr-2 flex-1 min-w-0">
                        <span className="text-[11px] font-mono tracking-widest text-white/40 shrink-0 mt-0.5 sm:mt-0">
                          {faq.number}
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-white/90 tracking-tight leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {activeCategory === 'ALL' && (
                          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 hidden md:inline-block">
                            {faq.category}
                          </span>
                        )}
                        <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm leading-relaxed text-white/70 border-t border-white/5 pt-4">
                        <FormattedAnswer text={faq.answer} />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Quick Contact Box */}
            <div className="mt-14 p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Still have a question?</h3>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Our team is here to assist you 7 days a week.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-white/90 transition-colors"
                >
                  Contact Us
                </Link>
                <a
                  href="https://wa.me/message/CV56ETMKXMV5M1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </SubpageShell>
    </>
  );
}
