"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

const LONG_PRESS_MS = 600;

export function ThemeSwitcher() {
    const { theme, setTheme, actualTheme } = useTheme();
    const [showAutoTooltip, setShowAutoTooltip] = useState(false);
    const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const didLongPress = useRef(false);

    const isDark = theme === "dark" || (theme === "auto" && actualTheme === "dark");
    const isAuto = theme === "auto";

    const handlePointerDown = useCallback(() => {
        didLongPress.current = false;
        pressTimer.current = setTimeout(() => {
            didLongPress.current = true;
            if (theme === "auto") {
                // Already auto — toggle out to the current actual theme
                setTheme(actualTheme);
                setShowAutoTooltip(false);
            } else {
                setTheme("auto");
                setShowAutoTooltip(true);
                setTimeout(() => setShowAutoTooltip(false), 2000);
            }
        }, LONG_PRESS_MS);
    }, [theme, actualTheme, setTheme]);

    const handlePointerUp = useCallback(() => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
        // Only toggle on short tap (not long press)
        if (!didLongPress.current) {
            if (theme === "auto") {
                // If in auto, a tap goes to the opposite of actual
                setTheme(actualTheme === "dark" ? "light" : "dark");
            } else {
                setTheme(isDark ? "light" : "dark");
            }
        }
    }, [theme, actualTheme, isDark, setTheme]);

    const handlePointerLeave = useCallback(() => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    }, []);

    return (
        <div className="fixed top-6 right-6 z-50">
            {/* Auto Mode Tooltip */}
            <AnimatePresence>
                {showAutoTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-white shadow-xl"
                    >
                        Auto mode enabled
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative flex h-10 w-[72px] items-center rounded-full border border-border p-1 backdrop-blur-xl transition-colors duration-500 shadow-lg select-none",
                    isDark ? "bg-slate-900/80" : "bg-white/80"
                )}
            >
                {/* Sliding Pill Indicator */}
                <motion.div
                    className={cn(
                        "absolute left-1 top-1 h-8 w-8 rounded-full shadow-md",
                        isDark ? "bg-indigo-500/20" : "bg-amber-400/30"
                    )}
                    initial={false}
                    animate={{
                        x: isDark ? 32 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 28,
                    }}
                />

                {/* Sun Icon (Left / East) */}
                <motion.div
                    className="relative z-10 flex h-8 w-8 items-center justify-center"
                    initial={false}
                    animate={{
                        scale: !isDark ? 1.15 : 0.75,
                        opacity: !isDark ? 1 : 0.35,
                        rotate: !isDark ? 0 : -90,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Sun
                        size={18}
                        strokeWidth={2.5}
                        className={cn(
                            "transition-colors duration-300",
                            !isDark ? "text-amber-500" : "text-slate-500"
                        )}
                    />
                </motion.div>

                {/* Moon Icon (Right / West) */}
                <motion.div
                    className="relative z-10 flex h-8 w-8 items-center justify-center"
                    initial={false}
                    animate={{
                        scale: isDark ? 1.15 : 0.75,
                        opacity: isDark ? 1 : 0.35,
                        rotate: isDark ? 0 : 90,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Moon
                        size={18}
                        strokeWidth={2.5}
                        className={cn(
                            "transition-colors duration-300",
                            isDark ? "text-indigo-400" : "text-slate-400"
                        )}
                    />
                </motion.div>

                {/* Auto Mode Indicator Ring */}
                <AnimatePresence>
                    {isAuto && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 shadow-sm shadow-blue-500/30"
                        >
                            <Monitor size={9} strokeWidth={3} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
