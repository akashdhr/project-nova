const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

const roleUI = `
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
`;

if (!content.includes('Current Role</h4>')) {
    content = content.replace(/(<div>\s*<div className="flex justify-between items-center mb-3">\s*<h3 className="text-xs font-bold text-\[var\(--text-secondary\)\] tracking-wider uppercase">Top Skills<\/h3>)/, `${roleUI}\n                  $1`);
}

fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
console.log("Current role added!");
