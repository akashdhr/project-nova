import re

new_homepage = """import Link from "next/link";
import { APP_NAME } from "@/config/brand";
import { CheckCircle2, DollarSign, Target, Users, Sparkles, BrainCircuit, Clock, Brain } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-6 py-4 md:px-8 border-b border-[var(--border-color)]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight">{APP_NAME}</span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <Link href="/signin" className="hidden sm:block text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-medium text-white bg-primary px-4 py-2 rounded hover:opacity-90 transition-opacity shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-[80px] w-full max-w-[1280px] mx-auto px-6">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mt-[80px] mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-[48px] md:leading-[56px] font-bold tracking-tight mb-6 drop-shadow-sm">
            Find jobs that actually fit you.
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mb-10 leading-relaxed">
            Experience precision hiring with AI-driven matching that understands your exact skillset, preferred work style, and career trajectory. Stop searching, start matching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link href="/signup" className="w-full sm:w-auto text-sm font-medium text-white bg-primary px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
              Find My Matches
            </Link>
            <Link href="/signin" className="w-full sm:w-auto text-sm font-medium text-[var(--text-primary)] bg-transparent border border-[var(--border-color)] px-8 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm hover:shadow-md">
              Sign In
            </Link>
          </div>
        </section>

        {/* UI Preview - Restrained Job Match Card */}
        <section className="flex justify-center mb-[100px] px-4">
          <div className="relative w-full max-w-md">
            {/* Floating Insight Card 1 */}
            <div className="absolute -top-6 -left-12 md:-left-20 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md border border-[var(--border-color)] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-xl px-4 py-2 z-10 animate-float hidden sm:flex items-center gap-2">
              <CheckCircle2 className="text-indigo-500 w-[18px] h-[18px]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">Skill Match</span>
            </div>
            
            {/* Floating Insight Card 2 */}
            <div className="absolute top-10 -right-8 md:-right-24 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md border border-[var(--border-color)] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-xl px-4 py-2 z-10 animate-float-delayed hidden sm:flex items-center gap-2">
              <DollarSign className="text-emerald-500 w-[18px] h-[18px]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">Salary Fit</span>
            </div>
            
            {/* Floating Insight Card 3 */}
            <div className="absolute -bottom-8 -left-6 md:-left-16 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md border border-[var(--border-color)] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-xl px-4 py-2 z-10 animate-float-slow hidden sm:flex items-center gap-2">
              <Target className="text-blue-400 w-[18px] h-[18px]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">Goal Alignment</span>
            </div>
            
            {/* Floating Insight Card 4 */}
            <div className="absolute -bottom-4 -right-6 md:-right-16 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md border border-[var(--border-color)] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-xl px-4 py-2 z-10 animate-float hidden sm:flex items-center gap-2">
              <Users className="text-amber-500 w-[18px] h-[18px]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">Culture Fit</span>
            </div>

            {/* Main Card */}
            <div className="bg-[var(--card-bg)]/90 backdrop-blur-sm border border-[var(--border-color)] rounded-xl p-6 w-full max-w-md relative overflow-hidden group shadow-lg hover:shadow-xl transition-shadow">
              {/* Subtle indicator dot */}
              <div className="absolute top-6 right-6 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Senior Product Manager</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Acme Corp • San Francisco, CA (Hybrid)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800/50">
                  <Brain className="w-[14px] h-[14px]" />
                  92% Match
                </span>
                <span className="bg-neutral-100 dark:bg-neutral-900/50 border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-bold px-3 py-1.5 rounded-full">
                  $160k - $190k
                </span>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-[var(--border-color)] rounded-lg p-3 border-l-2 border-l-indigo-500">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <span className="text-indigo-500 text-[16px]">ℹ️</span>
                  Why this matches you:
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Strong role alignment based on your 5+ years of B2B SaaS experience and demonstrated success leading cross-functional engineering pods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-[var(--border-color)] mb-12">
          {/* Feature 1 */}
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-900 shadow-sm border border-[var(--border-color)] text-indigo-500 mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Better matches</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Our semantic analysis looks beyond keywords to understand the true context of your experience and the nuances of the role.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-900 shadow-sm border border-[var(--border-color)] text-indigo-500 mb-2">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Explainable recommendations</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Never wonder why you were matched. We provide clear, plain-text reasoning for every job recommendation placed in your feed.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-900 shadow-sm border border-[var(--border-color)] text-indigo-500 mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Less time searching</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Eliminate the infinite scroll. Talvion delivers a curated shortlist of high-probability opportunities directly to you.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[var(--border-color)] mt-auto bg-[var(--bg-color)]">
        <div className="text-sm font-bold text-[var(--text-primary)]">{APP_NAME}</div>
        <div className="text-xs font-medium text-[var(--text-secondary)]">© 2024 {APP_NAME}. AI-Powered Precision.</div>
        <div className="flex gap-6">
          <a className="text-xs font-medium text-[var(--text-secondary)] hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="text-xs font-medium text-[var(--text-secondary)] hover:text-primary transition-colors" href="#">Terms</a>
          <a className="text-xs font-medium text-[var(--text-secondary)] hover:text-primary transition-colors" href="#">Contact</a>
        </div>
      </footer>

    </div>
  );
}
"""

with open("apps/web/src/app/page.tsx", "w") as f:
    f.write(new_homepage)

