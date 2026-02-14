"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { DATA } from "@/data/resume";
import Image from "next/image";

export function ProjectGrid() {
    return (
        <section className="px-4 py-20 max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold sm:text-4xl text-foreground">Featured Projects</h2>
                <div className="mt-2 h-1.5 w-20 rounded-full bg-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DATA.projects.map((project, index) => (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xl transition-all hover:border-primary/50 hover:shadow-primary/10"
                    >
                        {/* Image Container */}
                        <div className="relative h-48 w-full overflow-hidden">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-6">
                            <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                {project.title}
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                {project.description}
                            </p>

                            {/* Tech Tags */}
                            <div className="mb-6 mt-auto flex flex-wrap gap-2">
                                {project.tech.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-300 border border-border/50"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Action */}
                            <a
                                href={project.link}
                                target="_blank"
                                className="flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:opacity-80"
                            >
                                View Project <ExternalLink size={14} />
                            </a>
                        </div>

                        {/* Glow Effect */}
                        <div className="absolute -inset-px -z-10 rounded-[inherit] bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
