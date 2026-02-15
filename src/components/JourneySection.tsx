"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { Briefcase, GraduationCap } from "lucide-react";

interface TimelineItem {
    title: string;
    subtitle: string;
    period: string;
    description: string;
    details?: string[];
    icon: React.ReactNode;
}

export function JourneySection() {
    const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const items: TimelineItem[] = activeTab === "experience"
        ? DATA.experience.map(exp => ({
            title: exp.role,
            subtitle: exp.company,
            period: exp.period,
            description: exp.description,
            details: (exp as any).details,
            icon: <Briefcase size={16} />
        }))
        : (DATA as any).education.map((edu: any) => ({
            title: edu.degree,
            subtitle: edu.school,
            period: edu.period,
            description: edu.description,
            details: (edu as any).details,
            icon: <GraduationCap size={16} />
        }));

    return (
        <section id="journey" className="py-20 relative overflow-hidden" ref={containerRef}>
            <div className="mb-16 flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold sm:text-4xl text-foreground tracking-tight">Professional Journey</h2>
                <div className="mt-2 h-1 w-12 rounded-full bg-primary/50" />

                <GlowTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="relative mx-auto max-w-4xl px-4 lg:px-0">
                {/* Master Vertical Line (Track) - Now White */}
                <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-white/20 sm:left-1/2 sm:-ml-[0.5px]" />

                {/* Animated Growing Liquid Line - Now Blue */}
                <motion.div
                    style={{ scaleY, originY: 0 }}
                    className="absolute left-8 top-0 bottom-0 w-[3px] bg-blue-500 sm:left-1/2 sm:-ml-[1.5px] z-10 shadow-[0_0_25px_rgba(59,130,246,0.8),0_0_50px_rgba(59,130,246,0.4)]"
                />

                <div className="space-y-24 relative z-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-24"
                        >
                            {items.map((item, i) => (
                                <TimelineElement key={`${activeTab}-${i}`} item={item} index={i} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

function GlowTabs({
    activeTab,
    setActiveTab
}: {
    activeTab: "experience" | "education";
    setActiveTab: (tab: "experience" | "education") => void
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="mt-10 relative group rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-xl shrink-0"
        >
            {/* Dynamic Cursor Border Glow - Silk Style */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                    background: `radial-gradient(100px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.6), transparent 100%)`,
                    WebkitMaskImage: `radial-gradient(100px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
                    maskImage: `radial-gradient(100px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
                }}
            />

            <div className="relative flex gap-1 z-20">
                <TabButton
                    active={activeTab === "experience"}
                    onClick={() => setActiveTab("experience")}
                    icon={<Briefcase size={16} />}
                    label="Experience"
                />
                <TabButton
                    active={activeTab === "education"}
                    onClick={() => setActiveTab("education")}
                    icon={<GraduationCap size={16} />}
                    label="Education"
                />
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    label
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300",
                active ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            )}
        >
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-full"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
            )}
            <span className="relative z-10 flex items-center gap-2">
                <span className={cn("transition-colors duration-300", active ? "text-primary lucide-icon" : "text-inherit")}>
                    {icon}
                </span>
                {label}
            </span>
        </button>
    );
}

function TimelineElement({ item, index }: { item: TimelineItem; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const isEven = index % 2 === 0;

    // Mouse tilt values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // Reverted tilt intensity to 10deg
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Glare values
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / rect.width) - 0.5;
        const yPct = (mouseY / rect.height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start 90%", "center center"]
    });

    // Tighten the glow trigger range to be more punchy
    const glow = useTransform(scrollYProgress, [0.65, 0.95], [0, 1]);
    const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    const highlightBorder = useTransform(
        glow,
        [0, 1],
        ["rgba(128,128,128,0.15)", "rgba(59, 130, 246, 1)"]
    );
    const cardGlow = useTransform(
        glow,
        [0, 1],
        ["0 0 0px rgba(59, 130, 246, 0)", "0 0 50px rgba(59, 130, 246, 0.5)"]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "relative flex flex-col gap-8 sm:flex-row items-center",
                isEven ? "sm:flex-row-reverse" : "sm:flex-row"
            )}
        >
            {/* The Dot / Junction */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-background border-[0.5px] border-slate-700/50 z-30 sm:left-1/2 sm:-ml-1.5 flex items-center justify-center">
                <motion.div
                    style={{
                        opacity: glow,
                        scale: useTransform(glow, [0, 1], [0.8, 1.8]),
                    }}
                    className="absolute h-full w-full rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6,0_0_50px_#3b82f6,0_0_100px_#3b82f6] flex items-center justify-center"
                >
                    <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_15px_#fff,0_0_30px_#fff]" />
                </motion.div>
            </div>

            {/* Horizontal Branch Line */}
            <motion.div
                style={{ opacity: glow }}
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent sm:w-16 hidden sm:block",
                    isEven ? "right-[50%]" : "left-[50%]"
                )}
            />

            {/* Content Card with FlipTilt */}
            <div
                className="w-full ml-16 sm:ml-0 sm:w-[40%] perspective-[1200px]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    ref={cardRef}
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{
                        rotateX,
                        rotateY: useMotionValue(0), // Handled by animate prop for flip
                        transformStyle: "preserve-3d",
                        borderColor: highlightBorder,
                        boxShadow: cardGlow
                    }}
                    className="relative w-full cursor-pointer h-[300px] sm:h-[260px] border rounded-3xl transition-colors duration-300"
                >
                    {/* Front side */}
                    <div
                        className="absolute inset-0 bg-white/80 dark:bg-card/10 backdrop-blur-md p-5 rounded-3xl transition-colors duration-500 hover:bg-white/90 dark:hover:bg-card/20 group overflow-hidden text-left"
                        style={{ backfaceVisibility: "hidden" as any }}
                    >
                        {/* Liquid Glare Effect */}
                        <motion.div
                            style={{
                                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.12), transparent 80%)`,
                            }}
                            className="pointer-events-none absolute inset-0 z-10"
                        />

                        <div className="flex items-center gap-2 mb-2 text-[11px] font-bold tracking-[0.2em] text-primary/60 uppercase justify-start">
                            {item.period}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
                            {item.title}
                        </h3>
                        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 transition-colors flex-row">
                            <span className="h-1 w-1 rounded-full bg-primary/60" />
                            {item.subtitle}
                        </div>
                        <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
                            {item.description}
                        </p>
                    </div>

                    {/* Back side */}
                    <motion.div
                        className="absolute inset-0 bg-white/90 dark:bg-card/20 backdrop-blur-xl p-5 rounded-3xl overflow-hidden text-left"
                        style={{
                            backfaceVisibility: "hidden" as any,
                            rotateY: 180,
                            transformStyle: "preserve-3d"
                        }}
                    >
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Key Contributions</h4>
                        <ul className="space-y-2 items-start">
                            {item.details?.map((detail, idx) => (
                                <li key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            </div>

            {/* Spacer */}
            <div className="hidden sm:block w-[40%]" />
        </motion.div>
    );
}
