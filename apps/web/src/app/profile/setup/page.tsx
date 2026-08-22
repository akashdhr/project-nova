"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { profileService, resumeService } from "@/services/api";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function ProfileSetup() {
  const router = useRouter();
  const [resumeState, setResumeState] = useState<'idle'|'uploading'|'uploaded'|'error'>('idle');
  const [form, setForm] = useState({
    targetRoles: "",
    industries: "",
    locations: "",
    workMode: "remote",
    compensation: "",
    careerPriorities: "",
    dealBreakers: ""
  });

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeState('uploading');
      try {
        await resumeService.upload(e.target.files[0]);
        setResumeState('uploaded');
      } catch (err) {
        setResumeState('error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileService.update({
        targetRoles: form.targetRoles.split(',').map(s=>s.trim()).filter(Boolean),
        industries: form.industries.split(',').map(s=>s.trim()).filter(Boolean),
        locations: form.locations.split(',').map(s=>s.trim()).filter(Boolean),
        workMode: form.workMode,
        compensation: form.compensation,
        careerPriorities: form.careerPriorities.split(',').map(s=>s.trim()).filter(Boolean),
        dealBreakers: form.dealBreakers.split(',').map(s=>s.trim()).filter(Boolean)
      });
      router.push("/matches");
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-[var(--border-color)] p-8">
          <h1 className="text-3xl font-bold">Complete your profile</h1>
          <p className="text-[var(--text-secondary)] mt-2">Help us find your perfect matches.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Resume Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Resume</h2>
            <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50">
              {resumeState === 'idle' && (
                <>
                  <UploadCloud className="w-10 h-10 text-[var(--text-secondary)] mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">PDF, DOCX up to 10MB</p>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleResumeUpload} accept=".pdf,.doc,.docx" />
                </>
              )}
              {resumeState === 'uploading' && <p className="text-sm font-medium text-primary animate-pulse">Uploading...</p>}
              {resumeState === 'uploaded' && (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  <span className="font-medium">Resume uploaded successfully</span>
                </div>
              )}
              {resumeState === 'error' && <p className="text-sm font-medium text-red-500">Error uploading resume. Try again.</p>}
            </div>
          </section>

          {/* Target Job */}
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Target Job</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Roles (comma separated)</label>
                <input type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="e.g. Senior Product Manager, Lead Designer" onChange={e => setForm({...form, targetRoles: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industries (comma separated)</label>
                <input type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="e.g. FinTech, SaaS, Healthcare" onChange={e => setForm({...form, industries: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Work Preferences */}
          <section>
            <h2 className="text-xl font-semibold mb-4">3. Work Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Locations (comma separated)</label>
                <input type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="e.g. New York, London, Remote" onChange={e => setForm({...form, locations: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Work Mode</label>
                  <select className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" value={form.workMode} onChange={e => setForm({...form, workMode: e.target.value})}>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                    <option value="any">Any</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Compensation</label>
                  <input type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="e.g. $150k" onChange={e => setForm({...form, compensation: e.target.value})} />
                </div>
              </div>
            </div>
          </section>

          {/* Priorities */}
          <section>
            <h2 className="text-xl font-semibold mb-4">4. Priorities</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Career Priorities (comma separated)</label>
                <input type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="e.g. Growth, Mentorship, Work-life balance" onChange={e => setForm({...form, careerPriorities: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deal Breakers (comma separated)</label>
                <input type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="e.g. Legacy tech stack, Micro-management" onChange={e => setForm({...form, dealBreakers: e.target.value})} />
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-[var(--border-color)]">
            <button type="submit" className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
              Find My Matches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
