"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { applicationService } from "@/services/api";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await applicationService.get();
        setApps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <DashboardLayout><div className="p-8 text-center">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Application Tracker</h1>
        {apps.length === 0 ? (
          <div className="text-center py-12 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl">
            <p className="text-[var(--text-secondary)]">You haven&apos;t applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-[var(--border-color)]">
                  <th className="p-4 font-semibold text-sm">Role</th>
                  <th className="p-4 font-semibold text-sm">Company</th>
                  <th className="p-4 font-semibold text-sm">Date Applied</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium">{app.job.title}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{app.job.company}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-indigo-50 text-primary dark:bg-indigo-900/30 rounded-full text-xs font-semibold">
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
