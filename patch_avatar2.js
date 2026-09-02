const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

const regex = /<div className="w-12 h-12 rounded-full[^>]+>\s*\{profile\.firstName\?\.charAt\(0\)\}\{profile\.lastName\?\.charAt\(0\)\}\s*<\/div>/g;

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

content = content.replace(regex, newAvatarDiv);
fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
