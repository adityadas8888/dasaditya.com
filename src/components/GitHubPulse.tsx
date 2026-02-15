"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Loader2 } from "lucide-react";
import { DATA } from "@/data/resume";

interface ContributionDay {
    color: string;
    contributionCount: number;
    contributionLevel: string;
    date: string;
}

export function GitHubPulse() {
    const [contributionData, setContributionData] = useState<ContributionDay[][] | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalToday, setTotalToday] = useState(0);

    const githubUsername = DATA.contact.github.split("/").pop() || "adityadas8888";

    useEffect(() => {
        async function fetchGithubData() {
            try {
                const response = await fetch(`https://github-contributions-api.deno.dev/${githubUsername}.json`);
                const data = await response.json();

                if (data.contributions) {
                    // Take the last 15 weeks for a compact pulse view
                    const weeks = data.contributions;
                    const recentWeeks = weeks.slice(-15);
                    setContributionData(recentWeeks);

                    // Calculate today's commits
                    const lastWeek = weeks[weeks.length - 1];
                    const today = lastWeek[lastWeek.length - 1];
                    setTotalToday(today.contributionCount);
                }
            } catch (error) {
                console.error("Failed to fetch Github data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchGithubData();
    }, [githubUsername]);

    return (
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/5 bg-card/15 p-8 backdrop-blur-2xl transition-all hover:border-primary/30 group max-w-4xl w-full mx-auto">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                    <Github size={20} className="text-primary animate-pulse" />
                    <span>GitHub Activity Momentum</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-green-500/90 uppercase tracking-widest">Live System</span>
                </div>
            </div>

            <div className="relative flex w-full flex-col items-center gap-4 py-2">
                {loading ? (
                    <div className="flex h-[120px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                    </div>
                ) : (
                    <div className="flex justify-center gap-[4px] w-full overflow-x-auto pb-2 scrollbar-none">
                        {contributionData?.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[4px]">
                                {week.map((day, dayIndex) => (
                                    <motion.div
                                        key={day.date}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay: (weekIndex * 7 + dayIndex) * 0.002,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20
                                        }}
                                        className="h-[11px] w-[11px] rounded-[2px] border border-white/[0.02]"
                                        style={{
                                            backgroundColor: day.contributionCount > 0
                                                ? `rgba(var(--primary-rgb), ${0.4 + Math.min(day.contributionCount * 0.15, 0.6)})`
                                                : 'rgba(255,255,255,0.05)'
                                        }}
                                        title={`${day.contributionCount} contributions on ${day.date}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex w-full items-center justify-between border-t border-white/5 pt-6">
                <div className="flex flex-col gap-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        Current Snapshot
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                        Showing last <span className="text-white">6 months</span> of commits
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        Today
                    </div>
                    <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                        {totalToday} <span className="text-xs font-bold uppercase tracking-tighter text-slate-500 ml-1">Commits</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
