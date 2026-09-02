const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

// The corrupted part is from `                  ))};` up to `                        setIsEditingSkills(false);`
// Let's replace the corrupted block.
const fixedBlock = `                  ))}
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
                      }}`;

// Replace from `                  ))};` to `                        setIsEditingSkills(false);\n                      }}`
content = content.replace(/                  \)\)\};\n                        setIsEditingSkills\(false\);\n                      \}\}/s, fixedBlock);

fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
