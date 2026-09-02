const fs = require('fs');

let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

// Add Camera to lucide-react imports
if (!content.includes('Camera,')) {
    content = content.replace(/import {([^}]+)} from "lucide-react";/, (match, p1) => {
        return `import { Camera, ${p1.trim()} } from "lucide-react";`;
    });
}

// Add handleAvatarUpload function right after saveCard function
const functionToAdd = `
  const handleAvatarUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await profileService.update({ avatarUrl: base64String });
        setProfile({ ...profile, avatarUrl: base64String });
      } catch(err) {
        alert("Failed to upload avatar");
      }
    };
    reader.readAsDataURL(file);
  };
`;

if (!content.includes('handleAvatarUpload')) {
    content = content.replace(/(const saveCard = async \(\) => \{[\s\S]*?setEditingCard\(null\);\n    \} catch\(err\) \{\n      alert\("Failed to update profile"\);\n    \}\n  \};)/, `$1\n${functionToAdd}`);
}

// Replace the Avatar div
const oldAvatarDiv = `<div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center font-bold text-white bg-primary text-xl">
                    {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                  </div>`;

const newAvatarDiv = `<div className="relative group w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-white bg-primary text-xl flex-shrink-0 cursor-pointer">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <>{profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}</>
                    )}
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>`;

content = content.replace(oldAvatarDiv, newAvatarDiv);

fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
console.log("Avatar feature added!");
