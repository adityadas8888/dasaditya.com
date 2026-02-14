"use client";

import { useAccessControl } from "@/hooks/use-access-control";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ChatInterface } from "@/components/ChatInterface";
import { VerificationModal } from "@/components/VerificationModal";
import { StagingBadge } from "@/components/StagingBadge";
import { ContactButton } from "@/components/ContactButton";
import { Suspense } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

function PortfolioContent() {
  const { isVerified, showModal, setShowModal, verify } = useAccessControl();
  const { actualTheme } = useTheme();

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-500">
      <StagingBadge />

      {/* Background patterns */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-full transition-opacity duration-700",
            actualTheme === "dark"
              ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background opacity-100"
              : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-background to-background opacity-100"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full blur-[120px] transition-all duration-700",
            actualTheme === "dark" ? "bg-purple-900/10" : "bg-blue-200/20"
          )}
        />
      </div>

      <Hero />

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <ProjectGrid />

        {/* Skills Section */}
        <section className="py-20">
          <div className="mb-12 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold sm:text-4xl text-foreground">Technical Stack</h2>
            <div className="mt-2 h-1.5 w-20 rounded-full bg-primary" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 15", "React 19", "TypeScript", "Tailwind CSS",
              "Node.js", "Python", "PostgreSQL", "Redis",
              "Docker", "AWS", "Google Cloud", "LLMs", "RAG"
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-border bg-card/10 px-6 py-3 text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-border pt-10 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Aditya Das. Build with Next.js & AI.</p>
        </footer>
      </div>

      <ContactButton />
      <ChatInterface isVerified={isVerified} />

      <VerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onVerify={verify}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PortfolioContent />
    </Suspense>
  );
}
