import re

with open("apps/web/src/app/profile/page.tsx", "r") as f:
    content = f.read()

# Replace Target Roles Card
target_roles_card = """              {/* Target Roles Card */}
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
                    initialTags={editForm.targetRoles} 
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
              </div>"""

# Replace Locations & Work Mode Card
locations_card = """              {/* Locations & Work Mode Card */}
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
                        initialTags={editForm.locations} 
                        onSave={(tags) => setEditForm({...editForm, locations: tags})}
                        onCancel={() => {}}
                        placeholder="Add a location..."
                        emptyMessage="No locations added."
                      />
                      <p className="text-xs text-[var(--text-secondary)] mt-2">Click 'Save' at the top to apply all changes.</p>
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
              </div>"""

# Replace Compensation Card
compensation_card = """              {/* Compensation Expectations */}
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
              </div>"""

# Replace Priorities & Deal Breakers Card
priorities_card = """              {/* Priorities & Deal Breakers */}
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
                        value={editForm.careerPriorities?.join('\\n')}
                        onChange={(e) => setEditForm({...editForm, careerPriorities: e.target.value.split('\\n').filter(Boolean)})}
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
                        value={editForm.dealBreakers?.join('\\n')}
                        onChange={(e) => setEditForm({...editForm, dealBreakers: e.target.value.split('\\n').filter(Boolean)})}
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
              </div>"""

content = re.sub(r'\{\/\* Target Roles Card \*\/}.*?(?=\{\/\* Locations & Work Mode Card \*\/})', target_roles_card + '\n\n', content, flags=re.DOTALL)
content = re.sub(r'\{\/\* Locations & Work Mode Card \*\/}.*?(?=\{\/\* Compensation Expectations \*\/})', locations_card + '\n\n', content, flags=re.DOTALL)
content = re.sub(r'\{\/\* Compensation Expectations \*\/}.*?(?=\{\/\* Priorities & Deal Breakers \*\/})', compensation_card + '\n\n', content, flags=re.DOTALL)
content = re.sub(r'\{\/\* Priorities & Deal Breakers \*\/}.*?(?=\<\/div\>\n          \<\/div\>\n        \<\/div\>\n        \n        \{\/\* Footer \*\/})', priorities_card + '\n\n            ', content, flags=re.DOTALL)

with open("apps/web/src/app/profile/page.tsx", "w") as f:
    f.write(content)
