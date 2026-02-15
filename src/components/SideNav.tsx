"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SECTIONS = [
    { id: "hero", label: "Top" },
    { id: "journey", label: "Journey" },
    { id: "activity", label: "Activity" },
    { id: "projects", label: "Projects" },
    { id: "stack", label: "Stack" },
];

export function SideNav() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -80% 0px", // Trigger when section is in the upper part of the viewport
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        SECTIONS.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100, // Offset for better centering
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className="fixed right-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-6 lg:flex">
            {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;

                return (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="group relative flex items-center justify-end gap-4 outline-none"
                    >
                        <AnimatePresence>
                            {isActive && (
                                <motion.span
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="text-xs font-bold uppercase tracking-widest text-primary pr-2"
                                >
                                    {section.label}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        <div
                            className={cn(
                                "h-2 w-2 rounded-full transition-all duration-300",
                                isActive
                                    ? "h-8 bg-primary"
                                    : "bg-border group-hover:bg-primary/50 group-hover:h-4"
                            )}
                        />
                    </button>
                );
            })}
        </nav>
    );
}
