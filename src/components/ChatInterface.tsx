"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Lock, Sparkles, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";

interface ChatInterfaceProps {
    isVerified: boolean;
}

export function ChatInterface({ isVerified }: ChatInterfaceProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const { messages, sendMessage, status } = useChat();

    const isLoading = status === "streaming" || status === "submitted";

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;
        const text = inputValue;
        setInputValue("");
        sendMessage({ text });
    }, [inputValue, isLoading, sendMessage]);

    const getMessageText = (m: UIMessage): string => {
        return m.parts
            .filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-xl sm:w-[400px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border bg-slate-100/50 dark:bg-slate-800/50 p-4">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 p-1.5 text-primary">
                                        <Sparkles className="h-full w-full" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">Aditya&apos;s AI Agent</h3>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Always online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-500 transition-colors hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="relative flex flex-1 flex-col overflow-hidden">
                            {!isVerified ? (
                                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                    <div className="mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-4 text-slate-400">
                                        <Lock className="h-10 w-10" />
                                    </div>
                                    <h4 className="mb-2 font-bold text-foreground">AI Assistant Locked</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        The AI Assistant is reserved for recruiters. Connect on LinkedIn or use a referral link to access.
                                    </p>
                                    <a
                                        href="https://linkedin.com/in/adityadas"
                                        target="_blank"
                                        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                                    >
                                        Connect on LinkedIn
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <div
                                        ref={scrollRef}
                                        className="flex-1 overflow-y-auto p-4 space-y-4"
                                    >
                                        {messages.length === 0 && (
                                            <div className="text-center py-8">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Ask me anything about Aditya&apos;s experience, skills, or projects!
                                                </p>
                                            </div>
                                        )}
                                        {messages.map((m: UIMessage) => (
                                            <div
                                                key={m.id}
                                                className={cn(
                                                    "flex w-full items-start gap-3",
                                                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm",
                                                        m.role === "user" ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-primary/20 text-primary"
                                                    )}
                                                >
                                                    {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                                                </div>
                                                <div
                                                    className={cn(
                                                        "rounded-2xl px-4 py-3 text-sm shadow-sm max-w-[80%]",
                                                        m.role === "user"
                                                            ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-tr-none"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-border"
                                                    )}
                                                >
                                                    {getMessageText(m)}
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs italic ml-11">
                                                <span className="flex gap-1">
                                                    <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce"></span>
                                                </span>
                                                Thinking...
                                            </div>
                                        )}
                                    </div>

                                    {/* Input form */}
                                    <form
                                        onSubmit={handleSubmit}
                                        className="border-t border-border bg-slate-100/30 dark:bg-slate-800/30 p-4"
                                    >
                                        <div className="relative">
                                            <input
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                placeholder="Type a message..."
                                                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none focus:border-primary/50"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!inputValue.trim() || isLoading}
                                                className="absolute right-2 top-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition-all hover:bg-primary/90 disabled:opacity-50"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300",
                    isOpen
                        ? "bg-slate-200 dark:bg-slate-800 text-foreground"
                        : "bg-primary text-white hover:opacity-90 shadow-primary/20"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </motion.button>
        </div>
    );
}
