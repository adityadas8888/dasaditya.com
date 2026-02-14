"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Github, Mail, X as XIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const CONTACTS = [
    {
        id: "linkedin",
        icon: Linkedin,
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/aditya-das-02414862/",
        bg: "#0A66C2",
    },
    {
        id: "github",
        icon: Github,
        label: "GitHub",
        href: "https://github.com/adityadas8888",
        bg: "#24292e",
    },
    {
        id: "email",
        icon: Mail,
        label: "Email",
        href: "mailto:aditya.das8.ad@gmail.com",
        bg: "#EA4335",
    },
];

const SLIME = "#55263b";

const PILL_W = 130;
const PILL_H = 40;
const SLIME_LEVEL = 14; /* remaining slime height when open */

/*
 * STREAM blobs — curved path from slime level outward.
 * Positioned relative to streamAnchor (pill right edge, slime level).
 * Starts horizontal (y ≈ 0) then curves up (y goes negative).
 * Sizes taper from fat base to thin tip.
 */
const STREAM_SIZE = SLIME_LEVEL - 4; /* 8px — goo blur expands to ~12px, matching level */

/* 200 blobs along smooth curve, with conical expansion and color transition at the tip */
const STREAM_COUNT = 200;
const STREAM = Array.from({ length: STREAM_COUNT }, (_, i) => {
    const t = i / (STREAM_COUNT - 1);

    // Elegant conical fan: scale up to 3.5x at the very tip
    const isTip = t > 0.8;
    const fanStrength = isTip ? (t - 0.8) / 0.2 : 0;
    const sizeScale = 1 + fanStrength * 2.5;

    // Color Interp: SLIME (#55263b) to GitHub (#24292e)
    let color = SLIME;
    if (t > 0.6) {
        const factor = (t - 0.6) / 0.4;
        const r = Math.round(85 + (36 - 85) * factor);
        const g = Math.round(38 + (41 - 38) * factor);
        const b = Math.round(59 + (46 - 59) * factor);
        color = `rgb(${r}, ${g}, ${b})`;
    }

    return {
        x: 52 * t,
        y: -70 * Math.pow(t, 1.5),
        size: STREAM_SIZE * sizeScale,
        color,
    };
});

/*
 * ORIGINAL menu layout — fanned cross pattern.
 * These are relative to menuAnchor (pill right-center),
 * which is the SAME anchor the menu always used.
 *
 *   LinkedIn (upper-left)       Close (upper-right)
 *                    \           /
 *                     GitHub (hub)
 *                    /
 *              (stream)
 *                  /
 *            Email (lower-right)
 */
const MENU_TARGETS = [
    { x: 24, y: -100 },   // LinkedIn — upper-left arm
    { x: 64, y: -60 },    // GitHub — center hub
    { x: 104, y: -20 },   // Email — lower-right arm
];

/* Close continues the upper-right diagonal from hub */
const CLOSE_POS = { x: 99, y: -95 };

/* Viscous honey spring */
const HONEY_SPRING = {
    type: "spring" as const,
    stiffness: 90,
    damping: 18,
    mass: 1.2,
};

/* ─── Googly Eye ─── */
function Eye({ id }: { id: string }) {
    const eyeRef = useRef<HTMLDivElement>(null);
    const [iris, setIris] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!eyeRef.current) return;
            const r = eyeRef.current.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const angle = Math.atan2(dy, dx);
            const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 250);
            const factor = dist / 250;
            const max = 8;
            setIris({
                x: Math.cos(angle) * max * factor,
                y: Math.sin(angle) * max * factor,
            });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return (
        <div
            ref={eyeRef}
            id={`eye-${id}`}
            className="relative overflow-hidden pointer-events-none"
            style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.18)",
            }}
        >
            <motion.div
                className="absolute"
                style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    top: "50%",
                    left: "50%",
                    marginTop: -7,
                    marginLeft: -7,
                    background:
                        "radial-gradient(circle at 35% 35%, #333 60%, #111 100%)",
                }}
                animate={{ x: iris.x, y: iris.y }}
                transition={{ type: "spring", stiffness: 300, damping: 12, mass: 0.35 }}
            >
                <div
                    className="absolute"
                    style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#fff",
                        top: 1.5,
                        left: 2,
                        opacity: 0.9,
                    }}
                />
            </motion.div>
        </div>
    );
}

/* ─── Main Component ─── */
export function ContactButton() {
    const [isOpen, setIsOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const { actualTheme } = useTheme();
    const isDark = actualTheme === "dark";

    const handleContactClick = useCallback(
        (href: string, isExternal: boolean) => {
            setIsOpen(false);
            setTimeout(() => {
                if (isExternal) {
                    window.open(href, "_blank", "noopener,noreferrer");
                } else {
                    window.location.href = href;
                }
            }, 400);
        },
        []
    );

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    const CX = PILL_W / 2;
    const borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";

    /*
     * TWO SEPARATE ANCHORS:
     *
     * menuAnchor — original position at pill right-center.
     * Used by menu items + close so the fan layout is preserved.
     *
     * streamAnchor — at the pill right edge, at the slime level.
     * Used by stream blobs + cover blob so the honey flows
     * out of the slime surface.
     */
    const menuAnchorX = PILL_W - 20;
    const menuAnchorBottom = PILL_H / 2;

    const streamAnchorX = PILL_W - 8;
    const streamAnchorBottom = 8; /* mid-slime — drops stream into the slime band */

    return (
        <div
            ref={wrapRef}
            className="fixed bottom-6 left-6 z-40"
            style={{ width: 310, height: 220 }}
        >
            {/* Gooey SVG filter */}
            <svg className="absolute" style={{ width: 0, height: 0 }} aria-hidden>
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12.5" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            {/*
       * Z-ORDER:
       *   z-0: Eyes
       *   z-1: Pill container (overflow:hidden) with remaining slime inside
       *   z-2: Goo layer (cover + stream + menu)
       *   z-3: Pill border
       *   z-4: Text
       */}

            {/* ── PILL SLIME CONTAINER (z-1) ── */}
            <div
                className="absolute cursor-pointer"
                style={{
                    width: PILL_W,
                    height: PILL_H,
                    borderRadius: 9999,
                    overflow: "hidden",
                    bottom: 0,
                    left: 0,
                    zIndex: 0,
                    background: isDark ? "transparent" : "#d1d5db",
                    clipPath: "inset(0 round 9999px)",
                }}
                onClick={() => setIsOpen((o) => !o)}
            >
                <motion.div
                    className="absolute"
                    style={{
                        width: "100%",
                        left: 0,
                        bottom: 0,
                        background: SLIME,
                    }}
                    initial={false}
                    animate={{
                        height: isOpen ? SLIME_LEVEL : PILL_H,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 14,
                    }}
                />
            </div>

            {/* ── EYES (z-1) ── */}
            <motion.div
                className="absolute flex items-center justify-center gap-[3px] pointer-events-none"
                style={{
                    bottom: PILL_H / 2 - 11,
                    left: CX - 24,
                    zIndex: 1,
                }}
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <Eye id="L" />
                <Eye id="R" />
            </motion.div>

            {/* ── GOO LAYER (z-3) — stream + menu only ── */}
            <div
                className="absolute"
                style={{
                    bottom: 0,
                    left: 0,
                    width: 310,
                    height: 220,
                    filter: "url(#goo)",
                    zIndex: 3,
                }}
            >

                {/* STREAM — blob chain, uniform size for smooth goo merge */}
                {STREAM.map((blob, i) => (
                    <motion.div
                        key={`s${i}`}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: blob.size,
                            height: blob.size,
                            background: blob.color,
                            left: streamAnchorX - blob.size / 2,
                            bottom: streamAnchorBottom - blob.size / 2,
                            willChange: "transform",
                        }}
                        initial={false}
                        animate={{
                            x: isOpen ? blob.x : 0,
                            y: isOpen ? blob.y : 0,
                            scale: isOpen ? 1 : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 15,
                            delay: isOpen ? i * 0.001 : (STREAM_COUNT - 1 - i) * 0.0004,
                        }}
                    />
                ))}

                {/*
         * MENU ITEMS — uses menuAnchor (pill center-right)
         * to preserve the original fanned cross pattern.
         */}
                {CONTACTS.map((contact, i) => {
                    const Icon = contact.icon;
                    const target = MENU_TARGETS[i];

                    return (
                        <motion.button
                            key={contact.id}
                            onClick={() => {
                                if (isOpen) {
                                    handleContactClick(contact.href, contact.id !== "email");
                                } else {
                                    setIsOpen(true);
                                }
                            }}
                            className="absolute flex items-center justify-center rounded-full text-white cursor-pointer"
                            style={{
                                width: 46,
                                height: 46,
                                left: menuAnchorX - 23,
                                bottom: menuAnchorBottom - 23,
                            }}
                            initial={false}
                            animate={{
                                x: isOpen ? target.x : 0,
                                y: isOpen ? target.y : 0,
                                scale: isOpen ? 1 : 0,
                                backgroundColor: isOpen ? contact.bg : SLIME,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 15,
                                delay: isOpen ? 0.2 + i * 0.05 : (2 - i) * 0.02,
                                backgroundColor: {
                                    duration: 0.4,
                                    delay: isOpen ? 0.3 + i * 0.06 : 0,
                                    ease: "easeInOut",
                                },
                            }}
                            whileHover={isOpen ? { scale: 1.12 } : {}}
                            whileTap={isOpen ? { scale: 0.95 } : {}}
                            title={isOpen ? contact.label : undefined}
                        >
                            <motion.div
                                animate={{
                                    opacity: isOpen ? 1 : 0,
                                    scale: isOpen ? 1 : 0.2,
                                }}
                                transition={{
                                    duration: 0.15,
                                    delay: isOpen ? 0.25 : 0,
                                }}
                            >
                                <Icon size={18} strokeWidth={2} />
                            </motion.div>
                        </motion.button>
                    );
                })}

                {/* CLOSE — also uses menuAnchor */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.button
                            key="close"
                            onClick={() => setIsOpen(false)}
                            className="absolute flex items-center justify-center rounded-full text-white cursor-pointer"
                            style={{
                                width: 34,
                                height: 34,
                                left: menuAnchorX - 17,
                                bottom: menuAnchorBottom - 17,
                                background: isDark ? "#475569" : "#94a3b8",
                            }}
                            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                            animate={{
                                x: CLOSE_POS.x,
                                y: CLOSE_POS.y,
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 15,
                                delay: isOpen ? 0.25 : 0,
                            }}
                        >
                            <XIcon size={13} strokeWidth={2.5} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* ── PILL BORDER (z-3) ── */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: PILL_W,
                    height: PILL_H,
                    borderRadius: 9999,
                    border: `2px solid ${borderColor}`,
                    bottom: 0,
                    left: 0,
                    zIndex: 4,
                    background: "transparent",
                }}
            />

            {/* ── TEXT (z-4) ── */}
            <motion.div
                className="absolute flex items-center justify-center cursor-pointer"
                style={{
                    bottom: 0,
                    left: 0,
                    width: PILL_W,
                    height: PILL_H,
                    zIndex: 5,
                }}
                onClick={() => setIsOpen((o) => !o)}
                animate={{
                    opacity: isOpen ? 0 : 1,
                    scale: isOpen ? 0.5 : 1,
                }}
                transition={{ duration: 0.12 }}
            >
                <span className="font-semibold text-[11px] text-white tracking-widest select-none uppercase">
                    Contact Me
                </span>
            </motion.div>
        </div>
    );
}
