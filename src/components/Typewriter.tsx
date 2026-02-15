"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterProps {
    text: string;
    speed?: number; // duration in seconds per character
    delay?: number;
    className?: string;
    as?: "h1" | "h2" | "p" | "span" | "div";
}

export function Typewriter({
    text,
    speed = 0.05,
    delay = 0,
    className,
    as: Component = "span"
}: TypewriterProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const displaySafeValue = useTransform(rounded, (latest) => text.slice(0, latest));
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        const controls = animate(count, text.length, {
            type: "tween",
            duration: text.length * speed,
            delay: delay,
            ease: "linear",
            onComplete: () => setComplete(true),
        });
        return controls.stop;
    }, [count, text.length, speed, delay]);

    return (
        <Component className={className}>
            <motion.span>{displaySafeValue}</motion.span>
            {!complete && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
                />
            )}
        </Component>
    );
}
