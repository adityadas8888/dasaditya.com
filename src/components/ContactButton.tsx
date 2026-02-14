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
const STREAM_SIZE = SLIME_LEVEL - 4; /* 10px — goo blur expands to ~14px, matching level */

/*
 * 50 blobs along a smooth parametric curve.
 * First 70%: full size, full opacity.
 * Last 30%: dramatic size taper + fade to invisible.
 */
const STREAM_COUNT = 200;
const STREAM = Array.from({ length: STREAM_COUNT }, (_, i) => {
    const t = i / (STREAM_COUNT - 1);
    const sizeTaperT = t < 0.7 ? 0 : (t - 0.7) / 0.3;
    return {
        x: Math.round(48 * t),
        y: Math.round(-70 * Math.pow(t, 1.5)),
        size: t < 0.7
            ? STREAM_SIZE
            : Math.max(2, Math.round(STREAM_SIZE * (1 - sizeTaperT * 0.85))),
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
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
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
                        borderRadius: 9999,
                    }}
                    initial={false}
                    animate={{
                        height: isOpen ? SLIME_LEVEL : PILL_H - 4,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 14,
                    }}
                />
            </div>

            {/* ── EYES (z-0) ── */}
            <div
                className="absolute flex items-center justify-center gap-[3px] pointer-events-none"
                style={{
                    bottom: PILL_H / 2 - 11,
                    left: CX - 24,
                    zIndex: 1,
                }}
            >
                <Eye id="L" />
                <Eye id="R" />
            </div>

            {/* ── COVER BLOB (z-[1.5]) — outside goo filter for exact fit ── */}
            <motion.div
                className="absolute cursor-pointer"
                style={{
                    borderRadius: 9999,
                    background: SLIME,
                    zIndex: 2,
                }}
                onClick={() => setIsOpen((o) => !o)}
                initial={false}
                animate={
                    isOpen
                        ? {
                            width: 16,
                            height: 12,
                            bottom: 2,
                            left: streamAnchorX - 8,
                        }
                        : {
                            /* Exact pill size — no goo filter so no blur */
                            width: PILL_W,
                            height: PILL_H,
                            bottom: 0,
                            left: 0,
                        }
                }
                transition={{
                    type: "spring",
                    stiffness: isOpen ? 80 : 140,
                    damping: 16,
                }}
            />

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

                {/*
         * STREAM — curved blob chain from slime level
         * outward. Uses streamAnchor so it exits from the
         * slime surface at the pill wall.
         */}
                {STREAM.map((blob, i) => (
                    <motion.div
                        key={`s${i}`}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: blob.size,
                            height: blob.size,
                            background: SLIME,
                            left: streamAnchorX - blob.size / 2,
                            bottom: streamAnchorBottom - blob.size / 2,
                        }}
                        initial={false}
                        animate={{
                            x: isOpen ? blob.x : 0,
                            y: isOpen ? blob.y : 0,
                            scale: isOpen ? 1 : 0,
                        }}
                        transition={{
                            ...HONEY_SPRING,
                            delay: 0,
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
                                ...HONEY_SPRING,
                                delay: isOpen ? 0 : (2 - i) * 0.03,
                                backgroundColor: {
                                    duration: 0.4,
                                    delay: isOpen ? 0.15 + i * 0.06 : 0,
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
                                ...HONEY_SPRING,
                                delay: 0.1,
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
