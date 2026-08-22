"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { profileService } from "@/services/api";
import { APP_NAME } from "@/config/brand";
import { Edit2, FileText, Download, MapPin, CheckCircle2, XCircle, Star, Slash } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Resume & Skills");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.get();
        // Fallback demo data if some fields are empty
        setProfile({
          ...res.data,
          firstName: res.data?.firstName || "Alex",
          lastName: res.data?.lastName || "Mercer",
          title: "Senior Product Designer", // Mock title
          resumeUrl: res.data?.resumeUrl || "Alex_Mercer_Resume_2024.pdf",
          skills: ["Product Design", "UX Strategy", "Figma", "Design Systems", "User Research"],
          targetRoles: res.data?.targetRoles?.length ? res.data.targetRoles : ["Senior Product Designer", "UX Director"],
          locations: res.data?.locations?.length ? res.data.locations : ["San Francisco, CA", "New York, NY", "Anywhere (Remote)"],
          workMode: res.data?.workMode || "remote",
          compensation: res.data?.compensation || "$160,000 - $190,000",
          careerPriorities: res.data?.careerPriorities?.length ? res.data.careerPriorities : ["Strong design culture and executive buy-in.", "Opportunities for mentorship and team building.", "Flexible working hours."],
          dealBreakers: res.data?.dealBreakers?.length ? res.data.dealBreakers : ["Mandatory 5-day return to office.", "Legacy tech stacks or resistance to modern tools."]
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <DashboardLayout><div className="flex-1 flex items-center justify-center animate-pulse">Loading profile...</div></DashboardLayout>;

  const sidebarLinks = [
    "Resume & Skills",
    "Target Roles",
    "Industries & Companies",
    "Locations & Mode",
    "Compensation",
    "Priorities & Deal Breakers"
  ];

  return (
    <DashboardLayout>
      <div className="bg-[var(--bg-color)] min-h-screen pb-16">
        
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Profile & Preferences</h1>
            <p className="text-[var(--text-secondary)] mt-2 text-sm max-w-2xl">
              Manage your professional details and career criteria to ensure {APP_NAME} matches you with optimal opportunities.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 mb-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Alex+Mercer&background=4F46E5&color=fff" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[var(--text-primary)] text-lg">{profile.firstName} {profile.lastName}</h2>
                    <p className="text-xs text-[var(--text-secondary)]">{profile.title}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {sidebarLinks.map(link => (
                    <button
                      key={link}
                      onClick={() => setActiveTab(link)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                        activeTab === link
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-primary"
                          : "text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {link}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 space-y-6">
              
              {/* Resume & Core Details Card */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Resume & Core Details</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Your foundational professional profile.</p>
                  </div>
                  <button className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                    <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg mb-6">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[var(--text-secondary)] mr-3" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{profile.resumeUrl}</p>
                      <p className="text-xs text-[var(--text-secondary)]">Last updated: Oct 12, 2024</p>
                    </div>
                  </div>
                  <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] text-xs font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Roles Card */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Target Roles</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Positions you are actively seeking.</p>
                  </div>
                  <button className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                    <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.targetRoles.map((role: string, idx: number) => (
                    <div key={idx} className="border-l-2 border-primary pl-4">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{role}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Individual Contributor</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations & Work Mode Card */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Locations & Work Mode</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Where and how you want to work.</p>
                  </div>
                  <button className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                    <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">Preferred Work Mode</h3>
                  <div className="inline-flex rounded-lg border border-[var(--border-color)] overflow-hidden bg-[var(--bg-color)]">
                    <button className={`px-4 py-2 text-sm font-medium ${profile.workMode === 'remote' ? 'bg-[var(--card-bg)] text-white border border-[var(--border-color)] rounded-md shadow-sm m-0.5' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Remote</button>
                    <button className={`px-4 py-2 text-sm font-medium ${profile.workMode === 'hybrid' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md shadow-sm m-0.5' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Hybrid</button>
                    <button className={`px-4 py-2 text-sm font-medium ${profile.workMode === 'onsite' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md shadow-sm m-0.5' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>On-site</button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">Target Locations</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.locations.map((loc: string, idx: number) => (
                      <span key={idx} className="flex items-center px-3 py-1.5 bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium rounded-md">
                        <MapPin className="w-3.5 h-3.5 mr-1.5" /> {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compensation Expectations */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Compensation Expectations</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Your financial requirements.</p>
                  </div>
                  <button className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                    <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-2">Base Salary (USD)</h3>
                    <p className="text-xl font-bold text-[var(--text-primary)]">{profile.compensation}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-2">Equity Expectation</h3>
                    <p className="text-xl font-bold text-[var(--text-primary)]">Required</p>
                  </div>
                </div>
              </div>

              {/* Priorities & Deal Breakers */}
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Priorities & Deal Breakers</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">What matters most in your next role.</p>
                  </div>
                  <button className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                    <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-4 flex items-center">
                      <Star className="w-4 h-4 mr-1.5 text-indigo-400" /> Top Priorities
                    </h3>
                    <ul className="space-y-4">
                      {profile.careerPriorities.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 mr-2.5 text-indigo-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-[var(--text-primary)]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-4 flex items-center">
                      <Slash className="w-4 h-4 mr-1.5 text-red-400" /> Deal Breakers
                    </h3>
                    <ul className="space-y-4">
                      {profile.dealBreakers.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <XCircle className="w-5 h-5 mr-2.5 text-red-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-[var(--text-primary)]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="border-t border-[var(--border-color)] py-6 mt-12 bg-[var(--bg-color)]">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs font-medium">
            <div className="text-[var(--text-primary)] font-bold">{APP_NAME}</div>
            <div className="text-[var(--text-secondary)] mt-4 md:mt-0">© 2024 {APP_NAME}. AI-Powered Precision.</div>
            <div className="flex space-x-6 mt-4 md:mt-0 text-[var(--text-secondary)]">
              <a href="#" className="hover:text-[var(--text-primary)]">Privacy</a>
              <a href="#" className="hover:text-[var(--text-primary)]">Terms</a>
              <a href="#" className="hover:text-[var(--text-primary)]">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
