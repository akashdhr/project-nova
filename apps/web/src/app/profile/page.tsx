"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ResumeUploader } from "@/components/ResumeUploader";
import { TagEditor } from "@/components/TagEditor";
import { profileService } from "@/services/api";
import { APP_NAME } from "@/config/brand";
import { X, Camera, Edit2, FileText, Download, MapPin, CheckCircle2, XCircle, Star, Slash } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Resume & Skills");
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameForm, setNameForm] = useState({ firstName: "", lastName: "" });
  const [roleInput, setRoleInput] = useState("");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const SAMPLE_AVATARS = [
    "/avatars/avatar1.svg",
    "/avatars/avatar2.svg",
    "/avatars/avatar3.svg",
    "/avatars/avatar4.svg",
    "/avatars/avatar5.svg",
    "/avatars/avatar6.svg"
  ];
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const selectSampleAvatar = async (url: string) => {
    try {
      await profileService.update({ avatarUrl: url });
      setProfile({ ...profile, avatarUrl: url });
      setShowAvatarOptions(false);
    } catch (err) {
      alert("Failed to update avatar");
    }
  };


  const startEditing = (card: string) => {
    setEditingCard(card);
    setEditForm({ ...profile });
  };

  const saveCard = async () => {
    try {
      await profileService.update(editForm);
      setProfile({ ...profile, ...editForm });
      setEditingCard(null);
    } catch(err) {
      alert("Failed to update profile");
    }
  };

  const handleAvatarUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await profileService.update({ avatarUrl: base64String });
        setProfile({ ...profile, avatarUrl: base64String });
        setShowAvatarOptions(false);
      } catch(err) {
        alert("Failed to upload avatar");
      }
    };
    reader.readAsDataURL(file);
  };


  const sidebarLinks = [
    { name: "Resume & Skills", id: "resume-skills" },
    { name: "Target Roles", id: "target-roles" },
    { name: "Industries & Companies", id: "industries" },
    { name: "Locations & Mode", id: "locations-mode" },
    { name: "Compensation", id: "compensation" },
    { name: "Priorities & Deal Breakers", id: "priorities-deal-breakers" }
  ];

  const scrollToSection = (id: string, name: string) => {
    setActiveTab(name);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const matchingLink = sidebarLinks.find(link => link.id === entry.target.id);
          if (matchingLink) {
            setActiveTab(matchingLink.name);
          }
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });

    sidebarLinks.forEach(link => {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.get();
        setProfile({
          ...res.data,
          firstName: res.data?.firstName || "",
          lastName: res.data?.lastName || "",
          currentRole: res.data?.currentRole || "Senior Product Designer",
          resumeUrl: res.data?.resumeUrl || "",
          skills: res.data?.skills?.length ? res.data.skills : ["Product Design", "UX Strategy", "Figma", "Design Systems", "User Research"],
          targetRoles: res.data?.targetRoles?.length ? res.data.targetRoles : ["Senior Product Designer", "UX Director"],
          industries: res.data?.industries?.length ? res.data.industries : ["SaaS", "Fintech"],
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
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 mb-4 sticky top-32">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative group w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-white bg-primary text-xl flex-shrink-0 cursor-pointer" onClick={() => setShowAvatarOptions(true)}>
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <>{profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}</>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 w-full overflow-hidden pr-2">
                    {isEditingName ? (
                      <div className="flex flex-col space-y-2 mt-1 mb-2">
                        <input type="text" value={nameForm.firstName} onChange={e => setNameForm({...nameForm, firstName: e.target.value})} className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md px-2 py-1 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary" placeholder="First Name" />
                        <input type="text" value={nameForm.lastName} onChange={e => setNameForm({...nameForm, lastName: e.target.value})} className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md px-2 py-1 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary" placeholder="Last Name" />
                        <div className="flex space-x-2">
                          <button onClick={() => {
                            profileService.update({ firstName: nameForm.firstName, lastName: nameForm.lastName }).then(() => {
                              setProfile({ ...profile, firstName: nameForm.firstName, lastName: nameForm.lastName });
                              setIsEditingName(false);
                            });
                          }} className="text-xs bg-primary text-white px-2 py-1 rounded">Save</button>
                          <button onClick={() => setIsEditingName(false)} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="group/name relative">
                        <h2 className="font-bold text-[var(--text-primary)] text-lg truncate pr-6">{profile.firstName} {profile.lastName}</h2>
                        <button onClick={() => {
                          setNameForm({ firstName: profile.firstName || "", lastName: profile.lastName || "" });
                          setIsEditingName(true);
                        }} className="absolute right-0 top-1 opacity-0 group-hover/name:opacity-100 text-[var(--text-secondary)] hover:text-primary transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{profile.currentRole}</p>
                      </div>
                    )}
                  </div>
                </div>

                <nav className="space-y-1">
                  {sidebarLinks.map(link => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id, link.name)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                        activeTab === link.name
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-primary"
                          : "text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-neutral-900"
                      }`}
                    >
                      {link.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 space-y-6">
              
              {/* Resume & Core Details Card */}
              <div id="resume-skills">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">Resume & Core Details</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">Your foundational professional profile.</p>
                    </div>
                    <button 
                      onClick={() => setIsEditingResume(!isEditingResume)}
                      className="flex items-center text-sm font-medium text-primary hover:text-indigo-400"
                    >
                      {isEditingResume ? 'Cancel' : <><Edit2 className="w-4 h-4 mr-1.5" /> Edit</>}
                    </button>
                  </div>
                  
                  {isEditingResume ? (
                    <div className="mb-6">
                      <ResumeUploader compact onSuccess={() => {
                        setIsEditingResume(false);
                        window.location.reload();
                      }} />
                    </div>
                  ) : (
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
                  )}

                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Current Role</h4>
                      <button 
                        onClick={() => {
                          if (isEditingRole) {
                            profileService.update({ currentRole: roleInput }).then(() => {
                              setProfile({ ...profile, currentRole: roleInput });
                              setIsEditingRole(false);
                            });
                          } else {
                            setRoleInput(profile.currentRole);
                            setIsEditingRole(true);
                          }
                        }}
                        className="text-xs font-medium text-primary hover:text-indigo-400"
                      >
                        {isEditingRole ? 'Save' : 'Edit Role'}
                      </button>
                    </div>
                    {isEditingRole ? (
                      <input 
                        type="text" 
                        value={roleInput} 
                        onChange={(e) => setRoleInput(e.target.value)} 
                        className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                        placeholder="e.g. Senior Product Designer"
                      />
                    ) : (
                      <p className="text-sm text-[var(--text-primary)]">{profile.currentRole}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase">Top Skills</h3>
                      {!isEditingSkills && (
                        <button 
                          onClick={() => setIsEditingSkills(true)} 
                          className="text-xs font-medium text-primary hover:text-indigo-400"
                        >
                          Edit Skills
                        </button>
                      )}
                    </div>
                    
                    {isEditingSkills ? (
                      <TagEditor 
                        initialTags={profile.skills} 
                        onSave={async (newTags) => {
                          await profileService.update({ skills: newTags });
                          setProfile({ ...profile, skills: newTags });
                          setIsEditingSkills(false);
                        }}
                        onCancel={() => setIsEditingSkills(false)}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: string) => (
                          <span key={skill} className="px-3 py-1.5 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-medium rounded-full">
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length === 0 && (
                          <span className="text-xs text-[var(--text-secondary)]">No skills added yet.</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Target Roles Card */}
              <div id="target-roles">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">Target Roles</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">Positions you are actively seeking.</p>
                    </div>
                    {editingCard === 'roles' ? (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingCard(null)} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                        <button onClick={saveCard} className="text-sm font-medium text-primary hover:text-indigo-400">Save</button>
                      </div>
                    ) : (
                      <button onClick={() => startEditing('roles')} className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                        <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                      </button>
                    )}
                  </div>
                  
                  {editingCard === 'roles' ? (
                    <TagEditor 
                      initialTags={editForm.targetRoles || []} 
                      onSave={async (tags) => {
                        try {
                          await profileService.update({ targetRoles: tags });
                          setProfile({ ...profile, targetRoles: tags });
                          setEditingCard(null);
                        } catch(e) {}
                      }}
                      onCancel={() => setEditingCard(null)}
                      placeholder="Add a target role..."
                      emptyMessage="No target roles added."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.targetRoles.map((role: string, idx: number) => (
                        <div key={idx} className="border-l-2 border-primary pl-4">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{role}</p>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">Individual Contributor</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Industries & Companies Card */}
              <div id="industries">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">Industries & Companies</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">Sectors and organizations you are targeting.</p>
                    </div>
                    {editingCard === 'industries' ? (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingCard(null)} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                        <button onClick={saveCard} className="text-sm font-medium text-primary hover:text-indigo-400">Save</button>
                      </div>
                    ) : (
                      <button onClick={() => startEditing('industries')} className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                        <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                      </button>
                    )}
                  </div>
                  
                  {editingCard === 'industries' ? (
                    <TagEditor 
                      initialTags={editForm.industries || []} 
                      onSave={async (tags) => {
                        try {
                          await profileService.update({ industries: tags });
                          setProfile({ ...profile, industries: tags });
                          setEditingCard(null);
                        } catch(e) {}
                      }}
                      onCancel={() => setEditingCard(null)}
                      placeholder="Add an industry..."
                      emptyMessage="No industries added."
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.industries?.map((industry: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-900 text-[var(--text-primary)] text-xs font-medium rounded-full">
                          {industry}
                        </span>
                      ))}
                      {(!profile.industries || profile.industries.length === 0) && (
                        <span className="text-xs text-[var(--text-secondary)]">No industries added yet.</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Locations & Work Mode Card */}
              <div id="locations-mode">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">Locations & Work Mode</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">Where and how you want to work.</p>
                    </div>
                    {editingCard === 'locations' ? (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingCard(null)} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                        <button onClick={saveCard} className="text-sm font-medium text-primary hover:text-indigo-400">Save</button>
                      </div>
                    ) : (
                      <button onClick={() => startEditing('locations')} className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                        <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                      </button>
                    )}
                  </div>
                  
                  {editingCard === 'locations' ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">Preferred Work Mode</label>
                        <select 
                          value={editForm.workMode} 
                          onChange={(e) => setEditForm({...editForm, workMode: e.target.value})}
                          className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-primary)] focus:border-primary outline-none"
                        >
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="onsite">On-site</option>
                          <option value="any">Any</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">Target Locations</label>
                        <TagEditor 
                          initialTags={editForm.locations || []} 
                          onSave={(tags) => setEditForm({...editForm, locations: tags})}
                          onCancel={() => {}}
                          placeholder="Add a location..."
                          emptyMessage="No locations added."
                        />
                        <p className="text-xs text-[var(--text-secondary)] mt-2">Click &apos;Save&apos; at the top to apply all changes.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">Preferred Work Mode</h3>
                        <div className="inline-flex rounded-lg border border-[var(--border-color)] overflow-hidden bg-[var(--bg-color)]">
                          <button className={`px-4 py-2 text-sm font-medium ${profile.workMode === 'remote' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] dark:text-white border border-[var(--border-color)] rounded-md shadow-sm m-0.5' : 'text-[var(--text-secondary)]'}`}>Remote</button>
                          <button className={`px-4 py-2 text-sm font-medium ${profile.workMode === 'hybrid' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md shadow-sm m-0.5' : 'text-[var(--text-secondary)]'}`}>Hybrid</button>
                          <button className={`px-4 py-2 text-sm font-medium ${profile.workMode === 'onsite' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md shadow-sm m-0.5' : 'text-[var(--text-secondary)]'}`}>On-site</button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">Target Locations</h3>
                        <div className="flex flex-wrap gap-3">
                          {profile.locations.map((loc: string, idx: number) => (
                            <span key={idx} className="flex items-center px-3 py-1.5 bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-medium rounded-md">
                              <MapPin className="w-3.5 h-3.5 mr-1.5" /> {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Compensation Expectations */}
              <div id="compensation">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">Compensation Expectations</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">Your financial requirements.</p>
                    </div>
                    {editingCard === 'compensation' ? (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingCard(null)} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                        <button onClick={saveCard} className="text-sm font-medium text-primary hover:text-indigo-400">Save</button>
                      </div>
                    ) : (
                      <button onClick={() => startEditing('compensation')} className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                        <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                      </button>
                    )}
                  </div>
                  
                  {editingCard === 'compensation' ? (
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">Base Salary (USD)</label>
                      <input 
                        type="text" 
                        value={editForm.compensation || ''} 
                        onChange={(e) => setEditForm({...editForm, compensation: e.target.value})}
                        className="w-full max-w-sm p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-primary)] focus:border-primary outline-none"
                        placeholder="e.g. $160,000 - $190,000"
                      />
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>

              {/* Priorities & Deal Breakers */}
              <div id="priorities-deal-breakers">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">Priorities & Deal Breakers</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">What matters most in your next role.</p>
                    </div>
                    {editingCard === 'priorities' ? (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingCard(null)} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                        <button onClick={saveCard} className="text-sm font-medium text-primary hover:text-indigo-400">Save</button>
                      </div>
                    ) : (
                      <button onClick={() => startEditing('priorities')} className="flex items-center text-sm font-medium text-primary hover:text-indigo-400">
                        <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                      </button>
                    )}
                  </div>
                  
                  {editingCard === 'priorities' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3 flex items-center">
                          <Star className="w-4 h-4 mr-1.5 text-indigo-400" /> Top Priorities
                        </label>
                        <textarea
                          rows={4}
                          value={editForm.careerPriorities?.join('\n')}
                          onChange={(e) => setEditForm({...editForm, careerPriorities: e.target.value.split('\n').filter(Boolean)})}
                          className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-primary)] focus:border-primary outline-none text-sm leading-relaxed"
                          placeholder="One priority per line..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3 flex items-center">
                          <Slash className="w-4 h-4 mr-1.5 text-red-400" /> Deal Breakers
                        </label>
                        <textarea
                          rows={4}
                          value={editForm.dealBreakers?.join('\n')}
                          onChange={(e) => setEditForm({...editForm, dealBreakers: e.target.value.split('\n').filter(Boolean)})}
                          className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-primary)] focus:border-primary outline-none text-sm leading-relaxed"
                          placeholder="One deal breaker per line..."
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
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
          
      {showAvatarOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAvatarOptions(false)}>
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAvatarOptions(false)} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
               <X className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-[var(--border-color)]">
               <h3 className="text-lg font-bold text-[var(--text-primary)]">Change Avatar</h3>
               <p className="text-xs text-[var(--text-secondary)] mt-1">Choose a sample or upload your own.</p>
            </div>
            <div className="p-6">
               <div className="grid grid-cols-3 gap-4 mb-6 justify-items-center">
                 {SAMPLE_AVATARS.map(url => (
                   <button key={url} onClick={() => selectSampleAvatar(url)} className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all focus:outline-none hover:scale-110">
                     <img src={url} alt="sample" className="w-full h-full object-cover" />
                   </button>
                 ))}
               </div>
               <div className="relative">
                 <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleAvatarUpload} />
                 <div className="w-full py-2.5 rounded-lg border border-dashed border-[var(--border-color)] text-center text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-color)] transition-colors flex items-center justify-center gap-2">
                   <Camera className="w-4 h-4" /> Upload custom picture
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
</DashboardLayout>
  );
}
