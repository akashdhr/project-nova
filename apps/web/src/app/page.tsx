import Link from "next/link";
import { APP_NAME } from "@/config/brand";
import { Sparkles, BrainCircuit, Clock, CheckCircle2, Bookmark, Target, Users } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0F111A] text-gray-900 dark:text-white transition-colors">
      
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800/60 sticky top-0 bg-white/80 dark:bg-[#0F111A]/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-bold text-xl text-indigo-600 dark:text-indigo-400">
            {APP_NAME}
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/matches" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Matches</Link>
            <Link href="/saved" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Saved</Link>
            <Link href="/applications" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Applications</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <Link href="/signin" className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-primary hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full max-w-5xl px-6 pt-24 pb-20 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white leading-tight">
            Find jobs that actually fit you.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
            Experience precision hiring with AI-driven matching that understands your exact skillset, preferred work style, and career trajectory. Stop searching, start matching.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
            <Link href="/signup" className="px-8 py-3.5 bg-primary hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition shadow-lg shadow-indigo-500/20">
              Find My Matches
            </Link>
            <Link href="/signin" className="px-8 py-3.5 bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg transition">
              Sign In
            </Link>
          </div>

          {/* Hero Illustration / Mockup */}
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Floating Badges */}
            <div className="absolute -top-4 -left-8 bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center shadow-xl z-10 animate-float">
              <CheckCircle2 className="w-4 h-4 text-primary dark:text-indigo-400 mr-2" />
              <span className="text-xs font-semibold text-gray-800 dark:text-white">Skill Match</span>
            </div>
            
            <div className="absolute top-12 -right-8 bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center shadow-xl z-10 animate-float-delayed">
              <span className="text-green-600 dark:text-green-400 font-bold mr-2 text-xs">$</span>
              <span className="text-xs font-semibold text-gray-800 dark:text-white">Salary Fit</span>
            </div>
            
            <div className="absolute -bottom-6 -left-12 bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center shadow-xl z-10 animate-float-slow">
              <Target className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Goal Alignment</span>
            </div>
            
            <div className="absolute -bottom-4 -right-6 bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center shadow-xl z-10 animate-float">
              <Users className="w-4 h-4 text-amber-500 dark:text-amber-400 mr-2" />
              <span className="text-xs font-semibold text-gray-800 dark:text-white">Culture Fit</span>
            </div>

            {/* Central Card */}
            <div className="bg-white dark:bg-[#151822] border border-gray-200 dark:border-gray-700/60 rounded-xl p-8 text-left shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary dark:bg-indigo-500"></div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Senior Product Manager</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Acme Corp • San Francisco, CA (Hybrid)</p>
              
              <div className="flex gap-3 mb-6">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-500/30 text-primary dark:text-indigo-300 text-xs font-semibold rounded-full flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1.5" /> 92% Match
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold rounded-full">
                  $160k - $190k
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#1C202E] border border-gray-200 dark:border-gray-700/50 rounded-lg p-5">
                <h4 className="text-sm font-semibold flex items-center text-gray-800 dark:text-gray-300 mb-2">
                  <span className="mr-2">ℹ️</span> Why this matches you:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Strong role alignment based on your 5+ years of B2B SaaS experience and demonstrated success leading cross-functional engineering pods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent my-12"></div>

        {/* Features Section */}
        <section className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          
          <div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Better matches</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Our semantic analysis looks beyond keywords to understand the true context of your experience and the nuances of the role.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center mb-6">
              <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Explainable recommendations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Never wonder why you were matched. We provide clear, plain-text reasoning for every job recommendation placed in your feed.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Less time searching</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Eliminate the infinite scroll. Talvion delivers a curated shortlist of high-probability opportunities directly to you.
            </p>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800/60 py-8 bg-white dark:bg-[#0F111A]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs font-medium">
          <div className="text-gray-900 dark:text-white font-bold">{APP_NAME}</div>
          <div className="text-gray-500 mt-4 md:mt-0">© 2024 {APP_NAME}. AI-Powered Precision.</div>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
