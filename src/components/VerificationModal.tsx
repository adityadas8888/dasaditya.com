"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: () => void;
}

function CaptchaForm({ onVerify }: { onVerify: () => void }) {
    const [captcha] = useState(() => ({
        v1: Math.floor(Math.random() * 10) + 1,
        v2: Math.floor(Math.random() * 10) + 1,
    }));
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(answer) === captcha.v1 + captcha.v2) {
            onVerify();
        } else {
            setError(true);
            setAnswer("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="rounded-lg bg-slate-950 p-4 text-xl font-medium text-white">
                What is {captcha.v1} + {captcha.v2}?
            </div>
            <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                className={cn(
                    "w-full rounded-lg border bg-slate-800 px-4 py-3 text-center text-white outline-none transition-all focus:ring-2",
                    error ? "border-red-500 focus:ring-red-500/20" : "border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                )}
                autoFocus
            />
            {error && <p className="text-sm text-red-500">Incorrect answer. Please try again.</p>}
            <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
            >
                Verify Access
            </button>
        </form>
    );
}

export function VerificationModal({ isOpen, onClose, onVerify }: VerificationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-white">Recruiter Verification</h2>
                            <p className="mb-6 text-slate-400">
                                Welcome! Please confirm you&apos;re a human recruiter to access the AI portfolio assistant.
                            </p>

                            <CaptchaForm onVerify={onVerify} />
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
