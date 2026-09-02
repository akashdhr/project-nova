"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { profileService } from "@/services/api";
import { ResumeUploader } from "@/components/ResumeUploader";

export default function ProfileSetup() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    targetRoles: "",
    industries: "",
    locations: "",
    workMode: "remote",
    compensation: "",
    careerPriorities: "",
    dealBreakers: ""
  });

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
        
        <div className="p-8 space-y-8">
          {/* Resume Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">1. Resume</h2>
            <ResumeUploader />
          </section>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Target Job */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">2. Target Job</h2>
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
              <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">3. Work Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Locations (comma separated)</label>
                  <input type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:border-primary" placeholder="e.g. New York, London, Remote" onChange={e => setForm({...form, locations: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">4. Priorities</h2>
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
              <button 
                type="submit" 
                className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                Confirm My Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
