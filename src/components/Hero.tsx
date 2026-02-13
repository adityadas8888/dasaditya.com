"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/resume";

export function Hero() {
    return (
        <section className="relative flex min-h-[60svh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10"
            >
                <span className="mb-4 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
                    {DATA.role}
                </span>
                <h1 className="mb-6 text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
                    Hello, I&apos;m{" "}
                    <span className="relative inline-block">
                        <span className="animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-[length:200%_auto] bg-clip-text text-transparent">
                            {DATA.name}
                        </span>
                    </span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed">
                    {DATA.bio}
                </p>
            </motion.div>

            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
                <div className="h-[400px] w-[400px] animate-pulse rounded-full bg-blue-600/10 blur-[120px]" />
            </div>
        </section>
    );
}
