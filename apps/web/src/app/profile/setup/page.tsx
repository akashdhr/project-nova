"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { profileService } from "@/services/api";
import { ResumeUploader } from "@/components/ResumeUploader";
import { FileText, Briefcase, SlidersHorizontal, Star, X } from "lucide-react";

// Extracted outside to prevent remounting
const TagInput = ({ value, onChange, placeholder }: { value: string[], onChange: (v: string[]) => void, placeholder: string }) => {
  const [inp, setInp] = useState("");
  
  const commit = () => {
    if (inp.trim() && !value.includes(inp.trim())) {
      onChange([...value, inp.trim()]);
    }
    setInp("");
  };

  return (
    <div className="w-full rounded-lg border border-[var(--border-color)] bg-transparent p-2 focus-within:border-primary transition-colors">
      <div className="flex flex-wrap gap-2 mb-1">
        {value.map(tag => (
          <span key={tag} className="flex items-center px-2 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium rounded-full">
            {tag}
            <button type="button" onClick={() => onChange(value.filter(v => v !== tag))} className="ml-1 hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input 
        type="text" 
        value={inp} 
        onChange={e => setInp(e.target.value)} 
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
        className="w-full bg-transparent text-sm focus:outline-none" 
        placeholder={value.length === 0 ? placeholder : "Add more..."} 
      />
    </div>
  );
};

const RedTagInput = ({ value, onChange, placeholder }: { value: string[], onChange: (v: string[]) => void, placeholder: string }) => {
  const [inp, setInp] = useState("");
  
  const commit = () => {
    if (inp.trim() && !value.includes(inp.trim())) {
      onChange([...value, inp.trim()]);
    }
    setInp("");
  };

  return (
    <div className="w-full rounded-lg border border-[var(--border-color)] bg-transparent p-2 focus-within:border-primary transition-colors">
      <div className="flex flex-wrap gap-2 mb-1">
        {value.map(tag => (
          <span key={tag} className="flex items-center px-2 py-1 border border-red-200 text-red-600 dark:border-red-900 dark:text-red-400 text-xs font-medium rounded-full">
            {tag}
            <button type="button" onClick={() => onChange(value.filter(v => v !== tag))} className="ml-1 hover:text-red-800">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input 
        type="text" 
        value={inp} 
        onChange={e => setInp(e.target.value)} 
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
        className="w-full bg-transparent text-sm focus:outline-none" 
        placeholder={value.length === 0 ? placeholder : "Add more..."} 
      />
    </div>
  );
};

export default function ProfileSetup() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    targetRoles: [] as string[],
    industries: [] as string[],
    locations: [] as string[],
    workMode: "Remote",
    minComp: "",
    maxComp: "",
    careerPriorities: [] as string[],
    dealBreakers: [] as string[]
  });

  const [aiSummary, setAiSummary] = useState("");

  const handleResumeSuccess = (profile?: any) => {
    if (profile) {
      if (profile.targetRoles && profile.targetRoles.length > 0) {
         setForm(f => ({ ...f, targetRoles: profile.targetRoles }));
      }
      if (profile.professional_summary) {
         setAiSummary(profile.professional_summary);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileService.update({
        targetRoles: form.targetRoles,
        industries: form.industries,
        locations: form.locations,
        workMode: form.workMode.toLowerCase(),
        compensation: (form.minComp || form.maxComp) ? `${form.minComp} - ${form.maxComp}` : "",
        careerPriorities: form.careerPriorities,
        dealBreakers: form.dealBreakers
      });
      router.push("/matches");
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-[var(--bg-color)] relative">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Complete your profile</h1>
          <p className="text-[var(--text-secondary)] mt-1">Tell us what you're looking for. We'll use your resume to fill in the rest.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Resume */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm flex flex-col">
            <h2 className="flex items-center text-sm font-semibold mb-4 text-[var(--text-primary)]">
              <FileText className="w-4 h-4 mr-2" /> Resume
            </h2>
            <div className="flex-1">
              <ResumeUploader onSuccess={handleResumeSuccess} compact={true} />
              {aiSummary && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">AI Extracted Summary</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">{aiSummary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Target Job */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm flex flex-col">
            <h2 className="flex items-center text-sm font-semibold mb-4 text-[var(--text-primary)]">
              <Briefcase className="w-4 h-4 mr-2" /> Target Job
            </h2>
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Roles</label>
                <TagInput value={form.targetRoles} onChange={v => setForm({...form, targetRoles: v})} placeholder="Search roles..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Industries</label>
                <TagInput value={form.industries} onChange={v => setForm({...form, industries: v})} placeholder="Search industries..." />
              </div>
            </div>
          </div>

          {/* Card 3: Work Preferences */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm flex flex-col">
            <h2 className="flex items-center text-sm font-semibold mb-4 text-[var(--text-primary)]">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Work Preferences
            </h2>
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Work Mode</label>
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {['Remote', 'Hybrid', 'On-site'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setForm({...form, workMode: mode})}
                      className={`flex-1 text-xs font-medium py-1.5 rounded-md transition ${form.workMode === mode ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Locations</label>
                <TagInput value={form.locations} onChange={v => setForm({...form, locations: v})} placeholder="Add locations..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Compensation Range</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">₹</span>
                    <input type="text" value={form.minComp} onChange={e => setForm({...form, minComp: e.target.value})} className="w-full pl-6 p-2 text-sm rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="Min" />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">₹</span>
                    <input type="text" value={form.maxComp} onChange={e => setForm({...form, maxComp: e.target.value})} className="w-full pl-6 p-2 text-sm rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="Max" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Priorities */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm flex flex-col relative">
            <h2 className="flex items-center text-sm font-semibold mb-4 text-[var(--text-primary)]">
              <Star className="w-4 h-4 mr-2" /> Priorities
            </h2>
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Career Priorities</label>
                <TagInput value={form.careerPriorities} onChange={v => setForm({...form, careerPriorities: v})} placeholder="Search priorities..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Deal Breakers</label>
                <RedTagInput value={form.dealBreakers} onChange={v => setForm({...form, dealBreakers: v})} placeholder="Search deal breakers..." />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm flex items-center">
              Find My Matches <span className="ml-2">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
