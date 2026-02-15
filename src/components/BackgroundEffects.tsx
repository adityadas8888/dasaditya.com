"use client";

import { useEffect, useState } from "react";
import { SilkBackground } from "./SilkBackground";
import { useTheme } from "./ThemeProvider";

export function BackgroundEffects() {
    const [mounted, setMounted] = useState(false);
    const { actualTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base color layer */}
            <div className={`absolute inset-0 ${actualTheme === "dark" ? "bg-black" : "bg-white"}`} />

            {/* Silk background with grain overlay */}
            <div className="absolute inset-0">
                <SilkBackground theme={actualTheme} />
            </div>
        </div>
    );
}
