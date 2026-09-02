const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

// 1. Add X import
if (!content.includes('X,')) {
    content = content.replace(/import {([^}]+)} from "lucide-react";/, (match, p1) => {
        return `import { X, ${p1.trim()} } from "lucide-react";`;
    });
}

// 2. Add sample avatars array and state
const sampleAvatars = `
  const SAMPLE_AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor&backgroundColor=d1d4f9",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan&backgroundColor=c9f2b8",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey&backgroundColor=ffd5dc"
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
`;

if (!content.includes('showAvatarOptions')) {
    content = content.replace(/(const \[editForm, setEditForm\] = useState<any>\(\{\}\);)/, `$1\n${sampleAvatars}`);
}

// 3. Update the avatar div to trigger modal instead of direct upload
const oldAvatarDivRegex = /<div className="relative group w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-white bg-primary text-xl flex-shrink-0 cursor-pointer">[\s\S]*?<\/div>/;

const newAvatarDiv = `<div className="relative group w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-white bg-primary text-xl flex-shrink-0 cursor-pointer" onClick={() => setShowAvatarOptions(true)}>
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <>{profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}</>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>`;

content = content.replace(oldAvatarDivRegex, newAvatarDiv);

// 4. Update the handleAvatarUpload to close modal
content = content.replace(/setProfile\(\{ \.\.\.profile, avatarUrl: base64String \}\);/, 'setProfile({ ...profile, avatarUrl: base64String });\n        setShowAvatarOptions(false);');

// 5. Add Modal to the bottom before closing DashboardLayout
const modalHTML = `
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
`;

if (!content.includes('Change Avatar')) {
    content = content.replace(/(\s*)(<\/DashboardLayout>)/, `$1  ${modalHTML}$1$2`);
}

fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
console.log("Sample avatars feature added!");
