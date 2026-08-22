"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { jobService, savedJobService, applicationService } from "@/services/api";
import { MapPin, Building, DollarSign, ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import Link from "next/link";

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const [jobRes, savedRes] = await Promise.all([
          jobService.getById(params.id as string),
          savedJobService.get()
        ]);
        setJob(jobRes.data);
        setSaved(savedRes.data.some((s: any) => s.jobId === params.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [params.id]);

  const toggleSave = async () => {
    try {
      if (saved) {
        await savedJobService.unsave(job.id);
        setSaved(false);
      } else {
        await savedJobService.save(job.id);
        setSaved(true);
      }
    } catch (err) {
      alert("Error saving job");
    }
  };

  const handleApply = async () => {
    try {
      await applicationService.apply({ jobId: job.id });
      if (job.applicationUrl) {
        window.open(job.applicationUrl, '_blank');
      }
      router.push('/applications');
    } catch (err) {
      alert("Error applying");
    }
  };

  if (loading) return <DashboardLayout><div className="p-8 text-center animate-pulse">Loading job details...</div></DashboardLayout>;
  if (!job) return <DashboardLayout><div className="p-8 text-center">Job not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        <Link href="/matches" className="flex items-center text-sm font-medium text-[var(--text-secondary)] hover:text-primary mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to matches
        </Link>
        
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-3">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)]">
                <span className="flex items-center"><Building className="w-4 h-4 mr-1"/> {job.company}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {job.location} ({job.workMode})</span>
                {job.salary && <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1"/> {job.salary}</span>}
              </div>
            </div>
            <button onClick={toggleSave} className="p-3 border border-[var(--border-color)] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              {saved ? <BookmarkCheck className="w-6 h-6 text-primary" /> : <Bookmark className="w-6 h-6 text-[var(--text-secondary)]" />}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-8">
            {job.requiredSkills.map((skill: string) => (
              <span key={skill} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-primary text-sm rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold mb-4">About the role</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-[var(--text-secondary)]">{job.description}</p>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
            <button onClick={handleApply} className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
