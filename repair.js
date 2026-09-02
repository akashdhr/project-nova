const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

// 1. Clean up the corrupted loading statement area and remove any leftover modal pieces
const startLoadingIndex = content.indexOf('if (loading) return <DashboardLayout><div className="flex-1 flex items-center justify-center animate-pulse">Loading profile...</div>');
const startReturnIndex = content.indexOf('  return (\n    <DashboardLayout>');

if (startLoadingIndex !== -1 && startReturnIndex !== -1) {
    content = content.substring(0, startLoadingIndex) + 
              '  if (loading) return <DashboardLayout><div className="flex-1 flex items-center justify-center animate-pulse">Loading profile...</div></DashboardLayout>;\n\n' + 
              content.substring(startReturnIndex);
}

// 2. Remove the corrupted top-half modal at the bottom
const modalStartAtBottom = content.lastIndexOf('{showAvatarOptions && (');
if (modalStartAtBottom !== -1) {
    const dashboardLayoutEnd = content.lastIndexOf('</DashboardLayout>');
    content = content.substring(0, modalStartAtBottom) + content.substring(dashboardLayoutEnd);
}

// 3. Inject the FULL modal at the end, cleanly, just before the last </DashboardLayout>
const fullModal = `
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

const lastDashLayoutIndex = content.lastIndexOf('</DashboardLayout>');
if (lastDashLayoutIndex !== -1) {
    content = content.substring(0, lastDashLayoutIndex) + fullModal + content.substring(lastDashLayoutIndex);
}

fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
console.log("File repaired and modal correctly injected.");
