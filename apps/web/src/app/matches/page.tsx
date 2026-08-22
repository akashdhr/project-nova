"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { matchService, savedJobService, applicationService } from "@/services/api";
import { MapPin, Briefcase, DollarSign, Bookmark, BookmarkCheck, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { APP_NAME } from "@/config/brand";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, savedRes] = await Promise.all([
          matchService.getMatches(),
          savedJobService.get()
        ]);
        setMatches(matchesRes.data);
        if (matchesRes.data.length > 0) {
          setSelectedMatch(matchesRes.data[0]);
        }
        const savedMap: Record<string, boolean> = {};
        savedRes.data.forEach((s: any) => { savedMap[s.jobId] = true; });
        setSavedJobs(savedMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSave = async (jobId: string, isSaved: boolean) => {
    try {
      if (isSaved) {
        await savedJobService.unsave(jobId);
        setSavedJobs(prev => ({...prev, [jobId]: false}));
      } else {
        await savedJobService.save(jobId);
        setSavedJobs(prev => ({...prev, [jobId]: true}));
      }
    } catch (err) {
      alert("Error saving job");
    }
  };

  const handleApply = async (jobId: string, url?: string) => {
    try {
      await applicationService.apply({ jobId });
      if (url) window.open(url, '_blank');
      alert("Application recorded!");
    } catch (err) {
      alert("Error applying");
    }
  };

  if (loading) return <DashboardLayout><div className="flex-1 flex items-center justify-center animate-pulse">Loading matches...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Sub-header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-color)] bg-[var(--bg-color)]">
        <div className="flex space-x-2">
          <button className="px-4 py-1.5 text-sm font-medium border border-[var(--border-color)] bg-[var(--card-bg)] rounded-md">Recommended</button>
          <button className="px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">All matches</button>
          <span className="px-3 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-primary rounded-full flex items-center ml-2">
            {matches.length} new
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-[var(--text-secondary)]">Sort by: <span className="font-medium text-[var(--text-primary)] border border-[var(--border-color)] px-2 py-1 rounded">Match Score</span></span>
          <div className="flex items-center space-x-2">
            <span className="text-[var(--text-secondary)]">1-{matches.length} of {matches.length}</span>
            <button className="p-1 border border-[var(--border-color)] rounded"><ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" /></button>
            <button className="p-1 border border-[var(--border-color)] rounded"><ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Job List */}
        <div className="w-[400px] flex-shrink-0 border-r border-[var(--border-color)] overflow-y-auto bg-[var(--bg-color)] p-4 space-y-4">
          {matches.map((match) => {
            const isSelected = selectedMatch?.id === match.id;
            return (
              <div 
                key={match.id} 
                onClick={() => setSelectedMatch(match)}
                className={`p-4 rounded-xl cursor-pointer transition border ${
                  isSelected 
                    ? 'border-primary bg-[var(--card-bg)] shadow-sm' 
                    : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-gray-400 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-[var(--text-primary)] leading-tight">{match.job.title}</h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/40 text-primary rounded border border-indigo-100 dark:border-indigo-800/50">
                    {match.score}% Match
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mb-3 text-[var(--text-secondary)]">
                  <span>{match.job.company} • {match.job.workMode === 'remote' ? 'Remote' : match.job.location}</span>
                  <span className="text-xs font-medium">{match.job.salary}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {match.job.requiredSkills?.slice(0,3).map((skill: string) => (
                    <span key={skill} className="px-2 py-1 text-xs font-medium border border-[var(--border-color)] rounded-md text-[var(--text-secondary)]">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-xs font-medium text-[var(--text-secondary)]">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-[var(--text-secondary)]" />
                  <span className="truncate">{match.reasons[0] || 'Good fit for your profile'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Content - Job Details */}
        <div className="flex-1 overflow-y-auto bg-[var(--bg-color)] p-6">
          {selectedMatch ? (
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400">
                    {selectedMatch.job.company.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">{selectedMatch.job.title}</h1>
                    <p className="text-lg text-[var(--text-secondary)] mt-1">
                      <span className="text-primary">{selectedMatch.job.company}</span> • {selectedMatch.job.workMode === 'remote' ? 'Remote' : selectedMatch.job.location} • {selectedMatch.job.employmentType}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => toggleSave(selectedMatch.jobId, !!savedJobs[selectedMatch.jobId])}
                    className="flex items-center px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-[var(--text-primary)]"
                  >
                    {savedJobs[selectedMatch.jobId] ? <BookmarkCheck className="w-4 h-4 mr-2 text-primary" /> : <Bookmark className="w-4 h-4 mr-2" />}
                    Save
                  </button>
                  <button onClick={() => handleApply(selectedMatch.jobId, selectedMatch.job.applicationUrl)} className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-indigo-700 transition">
                    Apply Now
                  </button>
                </div>
              </div>

              {/* Meta tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="flex items-center px-3 py-1.5 text-xs font-medium border border-[var(--border-color)] rounded-md bg-[var(--card-bg)] text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4 mr-2" /> {selectedMatch.job.location} ({selectedMatch.job.workMode})
                </span>
                <span className="flex items-center px-3 py-1.5 text-xs font-medium border border-[var(--border-color)] rounded-md bg-[var(--card-bg)] text-[var(--text-secondary)]">
                  <Briefcase className="w-4 h-4 mr-2" /> {selectedMatch.job.workMode === 'hybrid' ? 'Hybrid / Remote Option' : selectedMatch.job.workMode}
                </span>
                {selectedMatch.job.salary && (
                  <span className="flex items-center px-3 py-1.5 text-xs font-medium border border-[var(--border-color)] rounded-md bg-[var(--card-bg)] text-[var(--text-secondary)]">
                    <DollarSign className="w-4 h-4 mr-2" /> {selectedMatch.job.salary}
                  </span>
                )}
              </div>

              {/* Match Score Card */}
              <div className="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] mb-8 overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full border-[3px] border-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-[var(--text-primary)]">{selectedMatch.score}%</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Strong Match</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">Based on your {APP_NAME} profile and recent experience.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 md:border-r border-[var(--border-color)]">
                    <h3 className="text-sm font-medium flex items-center mb-4 text-[var(--text-primary)]">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Why it&apos;s a fit
                    </h3>
                    <ul className="space-y-3">
                      {selectedMatch.reasons.map((r: string, i: number) => (
                        <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start">
                          <span className="mr-2 mt-1 w-1 h-1 rounded-full bg-[var(--text-secondary)] flex-shrink-0"></span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 border-t md:border-t-0 border-[var(--border-color)]">
                    <h3 className="text-sm font-medium flex items-center mb-4 text-[var(--text-primary)]">
                      <AlertCircle className="w-4 h-4 mr-2" /> Potential Gaps
                    </h3>
                    <ul className="space-y-3">
                      {selectedMatch.gaps?.length ? selectedMatch.gaps.map((g: string, i: number) => (
                        <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start">
                          <span className="mr-2 mt-1 w-1 h-1 rounded-full bg-[var(--text-secondary)] flex-shrink-0"></span>
                          {g}
                        </li>
                      )) : (
                        <li className="text-sm text-[var(--text-secondary)]">No significant gaps identified.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Layout Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* About the Role */}
                <div className="lg:col-span-2">
                  <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">About the Role</h2>
                  <div className="text-sm text-[var(--text-secondary)] space-y-4 whitespace-pre-wrap leading-relaxed">
                    {selectedMatch.job.description}
                  </div>
                </div>
                {/* Right Sidebar */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-sm font-bold mb-3 text-[var(--text-primary)]">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedMatch.job.requiredSkills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1.5 border border-[var(--border-color)] text-xs font-medium rounded-full text-[var(--text-secondary)] bg-[var(--bg-color)]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-4">
                    <h2 className="text-sm font-bold mb-4 text-[var(--text-primary)]">About {selectedMatch.job.company}</h2>
                    <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                      Office Image Placeholder
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)] font-medium">Industry</span>
                        <span className="text-[var(--text-primary)]">Tech / SaaS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)] font-medium">Size</span>
                        <span className="text-[var(--text-primary)]">100 - 500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
              Select a match to view details
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
