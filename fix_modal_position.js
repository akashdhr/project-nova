const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

// 1. Extract the modal code
const modalRegex = / {6}\{showAvatarOptions && \([\s\S]*?\)\}\n/;
const match = content.match(modalRegex);

if (match) {
    const modalHTML = match[0];
    // 2. Remove it from its current bad location
    content = content.replace(modalRegex, '');
    
    // 3. Inject it at the end of the file, right before the LAST </DashboardLayout>
    // We can do this by using lastIndexOf
    const lastIndex = content.lastIndexOf('</DashboardLayout>');
    if (lastIndex !== -1) {
        content = content.substring(0, lastIndex) + modalHTML + content.substring(lastIndex);
    }
    
    fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
    console.log("Modal position fixed!");
} else {
    console.log("Modal not found in the wrong place.");
}
