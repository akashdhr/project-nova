const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

// Restore Industries & Companies to sidebar links
content = content.replace(
  '{ name: "Target Roles", id: "target-roles" },',
  '{ name: "Target Roles", id: "target-roles" },\n    { name: "Industries & Companies", id: "industries" },'
);

// Create the Industries & Companies card HTML
const industriesCard = `</div>

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
                        <span key={idx} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] text-xs font-medium rounded-full">
                          {industry}
                        </span>
                      ))}
                      {(!profile.industries || profile.industries.length === 0) && (
                        <span className="text-xs text-[var(--text-secondary)]">No industries added yet.</span>
                      )}
                    </div>
                  )}
                </div>
              `;

// Inject right after Target Roles Card finishes
content = content.replace('</div>\n\n              {/* Locations & Work Mode Card */}', industriesCard + '\n              {/* Locations & Work Mode Card */}');

fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
