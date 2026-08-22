"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { savedJobService } from "@/services/api";
import Link from "next/link";
import { BookmarkMinus } from "lucide-react";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  async function fetchSaved() {
    try {
      const res = await savedJobService.get();
      setSavedJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function removeSaved(jobId: string) {
    try {
      await savedJobService.unsave(jobId);
      setSavedJobs(savedJobs.filter(s => s.jobId !== jobId));
    } catch (err) {
      alert("Error removing saved job");
    }
  };

  if (loading) return <DashboardLayout><div className="p-8 text-center">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
        {savedJobs.length === 0 ? (
          <div className="text-center py-12 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl">
            <p className="text-[var(--text-secondary)]">No saved jobs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((item) => (
              <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 hover:shadow-sm transition flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{item.job.title}</h2>
                  <p className="text-[var(--text-secondary)] mb-4">{item.job.company} • {item.job.location}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-color)]">
                  <Link href={`/jobs/${item.jobId}`} className="text-primary font-medium hover:underline">
                    View Details
                  </Link>
                  <button onClick={() => removeSaved(item.jobId)} className="text-red-500 hover:text-red-600 p-2">
                    <BookmarkMinus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
