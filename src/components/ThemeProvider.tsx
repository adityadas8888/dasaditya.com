"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
    theme: Theme;
    actualTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const interpolate = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
};

// Pure function to calculate theme state without calling setState
function calculateThemeState(theme: Theme) {
    if (typeof window === "undefined") return { targetTheme: "dark" as const, sunsetFactor: -1 };

    const now = new Date();
    const currentTimeMinutes = (typeof window !== "undefined" && (window as any).__portfolio_sim_time !== undefined)
        ? (window as any).__portfolio_sim_time
        : now.getHours() * 60 + now.getMinutes();
    const sunsetStart = 16 * 60;
    const sunsetEnd = 17 * 60;

    let targetTheme: "light" | "dark" = "dark";
    let sunsetFactor = -1;

    if (theme === "auto") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

        if (currentTimeMinutes >= sunsetEnd || currentTimeMinutes < 6 * 60) {
            targetTheme = "dark";
        } else if (currentTimeMinutes < sunsetStart) {
            targetTheme = systemTheme;
        } else {
            sunsetFactor = (currentTimeMinutes - sunsetStart) / (sunsetEnd - sunsetStart);
            targetTheme = sunsetFactor > 0.5 ? "dark" : "light";
        }
    } else {
        targetTheme = theme;
    }

    return { targetTheme, sunsetFactor };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [theme, setThemeState] = useState<Theme>("auto");

    // After mount, read from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("portfolio-theme") as Theme | null;
        if (stored) setThemeState(stored);
        setMounted(true);
    }, []);

    const { targetTheme, sunsetFactor } = useMemo(
        () => (mounted ? calculateThemeState(theme) : { targetTheme: "dark" as const, sunsetFactor: -1 }),
        [theme, mounted]
    );

    useEffect(() => {
        if (!mounted) return;
        const html = document.documentElement;
        html.setAttribute("data-theme", targetTheme);

        if (targetTheme === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }

        if (sunsetFactor !== -1) {
            const h = interpolate(210, 222, sunsetFactor);
            const s = interpolate(40, 47, sunsetFactor);
            const l = interpolate(98, 4, sunsetFactor);
            html.style.setProperty("--background", `${h} ${s}% ${l}%`);
        } else {
            html.style.removeProperty("--background");
        }
    }, [targetTheme, sunsetFactor, mounted]);

    const [tick, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("portfolio-theme", newTheme);
    }, []);

    const currentThemeState = useMemo(() =>
        mounted ? calculateThemeState(theme) : { targetTheme: "dark" as const, sunsetFactor: -1 },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme, tick, mounted]
    );

    return (
        <ThemeContext.Provider value={{
            theme,
            actualTheme: currentThemeState.targetTheme,
            setTheme,
            mounted,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
