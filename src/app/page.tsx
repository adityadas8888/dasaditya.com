"use client";

import { useAccessControl } from "@/hooks/use-access-control";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ChatInterface } from "@/components/ChatInterface";
import { VerificationModal } from "@/components/VerificationModal";
import { StagingBadge } from "@/components/StagingBadge";
import { Suspense } from "react";

function PortfolioContent() {
  const { isVerified, showModal, setShowModal, verify } = useAccessControl();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      <StagingBadge />

      {/* Background patterns */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      <Hero />

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <ProjectGrid />

        {/* Skills Section */}
        <section className="py-20">
          <div className="mb-12 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Technical Stack</h2>
            <div className="mt-2 h-1.5 w-20 rounded-full bg-blue-600" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 15", "React 19", "TypeScript", "Tailwind CSS",
              "Node.js", "Python", "PostgreSQL", "Redis",
              "Docker", "AWS", "Google Cloud", "LLMs", "RAG"
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition-all hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/5 pt-10 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Aditya Das. Built with Next.js & AI.</p>
        </footer>
      </div>

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
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <PortfolioContent />
    </Suspense>
  );
}
