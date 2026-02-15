"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface SilkBackgroundProps {
    theme: "light" | "dark";
}

export function SilkBackground({ theme }: SilkBackgroundProps) {
    const isDark = theme === "dark";
    const grainRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);

    // Generate animated grain noise on a tiny canvas, tiled via CSS
    const animateGrain = useCallback(() => {
        const canvas = grainRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const v = Math.random() * 255;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
        frameRef.current = requestAnimationFrame(animateGrain);
    }, []);

    useEffect(() => {
        animateGrain();
        return () => {
            cancelAnimationFrame(frameRef.current);
        };
    }, [animateGrain]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Animated silk blobs — smooth CSS gradients */}
            <div className="absolute inset-0">
                {/* Blob 1 */}
                <div
                    className="absolute w-[130%] h-[130%] -left-[15%] -top-[15%]"
                    style={{
                        background: isDark
                            ? "radial-gradient(ellipse 50% 40% at 40% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)"
                            : "radial-gradient(ellipse 50% 40% at 40% 50%, rgba(0,0,0,0.06) 0%, transparent 70%)",
                        animation: "silk-drift-1 25s ease-in-out infinite",
                        filter: "blur(80px)",
                    }}
                />
                {/* Blob 2 */}
                <div
                    className="absolute w-[130%] h-[130%] -left-[15%] -top-[15%]"
                    style={{
                        background: isDark
                            ? "radial-gradient(ellipse 45% 55% at 65% 35%, rgba(255,255,255,0.08) 0%, transparent 70%)"
                            : "radial-gradient(ellipse 45% 55% at 65% 35%, rgba(0,0,0,0.045) 0%, transparent 70%)",
                        animation: "silk-drift-2 30s ease-in-out infinite",
                        filter: "blur(90px)",
                    }}
                />
                {/* Blob 3 */}
                <div
                    className="absolute w-[130%] h-[130%] -left-[15%] -top-[15%]"
                    style={{
                        background: isDark
                            ? "radial-gradient(ellipse 55% 40% at 50% 60%, rgba(255,255,255,0.06) 0%, transparent 65%)"
                            : "radial-gradient(ellipse 55% 40% at 50% 60%, rgba(0,0,0,0.035) 0%, transparent 65%)",
                        animation: "silk-drift-3 35s ease-in-out infinite",
                        filter: "blur(100px)",
                    }}
                />
            </div>

            {/* Animated grain noise canvas — the definitive anti-banding solution */}
            <canvas
                ref={grainRef}
                width={128}
                height={128}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    opacity: isDark ? 0.04 : 0.03,
                    mixBlendMode: "overlay",
                    imageRendering: "pixelated",
                }}
            />
        </div>
    );
}
