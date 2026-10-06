'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const SubFooter: React.FC = () => {
    return (
        <section className="relative w-full pt-8 pb-10 sm:pt-12 sm:pb-14 text-white z-10 overflow-hidden flex flex-col items-center justify-center px-6 sm:px-12 text-center select-none">
            {/* Subtle atmospheric radial spotlight centered on content */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 45%, transparent 70%)',
                }}
            />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center my-auto py-2 sm:py-4">
                <motion.h2
                    initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-sans font-black tracking-tight text-white leading-[1.08] uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
                >
                    NUTRITION AS A LIFESTYLE.
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="text-sm sm:text-base md:text-lg text-neutral-300 font-sans mt-5 max-w-2xl mx-auto tracking-normal leading-relaxed space-y-2"
                >
                    <p>We believe feeling your best shouldn’t be complicated.</p>
                    <p>
                        Rebelive brings functional nutrition into your everyday routine, made for the way you live, work and move.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8 flex justify-center"
                >
                    <Link
                        href="/shop"
                        className="px-8 py-3.5 bg-white hover:bg-neutral-200 text-black font-sans text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                    >
                        <span>SHOP NOW &rarr;</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default SubFooter;
