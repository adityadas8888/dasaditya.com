"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/resume";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { Typewriter } from "./Typewriter";

export function Hero() {
    const { actualTheme } = useTheme();

    return (
        <section id="hero" className="relative flex min-h-[65svh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 flex flex-col items-center"
            >
                <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    {DATA.role}
                </span>

                <h1 className={cn(
                    "mb-6 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl transition-colors duration-500",
                    actualTheme === "dark" ? "text-white" : "text-slate-900"
                )}>
                    Hello, I&apos;m{" "}
                    <span className="relative inline-block">
                        <span className="animate-gradient-x bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent">
                            <Typewriter
                                text={DATA.name}
                                speed={0.15} // Slow typewriter
                                delay={0.5}
                            />
                        </span>
                    </span>
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: DATA.name.length * 0.15 + 1, duration: 0.5 }}
                    className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400 sm:text-xl leading-relaxed"
                >
                    {DATA.bio}
                </motion.p>
            </motion.div>

            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
                <div className="h-[400px] w-[400px] animate-pulse rounded-full bg-primary/10 blur-[120px]" />
            </div>
        </section>
    );
}
