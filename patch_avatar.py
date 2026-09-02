import re

with open('apps/web/src/app/profile/page.tsx', 'r') as f:
    content = f.read()

new_avatar_div = """<div className="relative group w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-white bg-primary text-xl flex-shrink-0 cursor-pointer">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <>{profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}</>
                    )}
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                      <Camera className="w-4 h-4 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>"""

pattern = r'<div className="w-12 h-12 rounded-full[^>]+>\s*\{profile\.firstName\?\.charAt\(0\)\}\{profile\.lastName\?\.charAt\(0\)\}\s*<\/div>'

content = re.sub(pattern, new_avatar_div, content)

with open('apps/web/src/app/profile/page.tsx', 'w') as f:
    f.write(content)
