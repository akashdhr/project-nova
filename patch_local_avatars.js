const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

const dicebearRegex = /const SAMPLE_AVATARS = \[\s*"https:\/\/api\.dicebear\.com[^\]]+\];/m;
const localAvatars = `const SAMPLE_AVATARS = [
    "/avatars/avatar1.svg",
    "/avatars/avatar2.svg",
    "/avatars/avatar3.svg",
    "/avatars/avatar4.svg",
    "/avatars/avatar5.svg",
    "/avatars/avatar6.svg"
  ];`;

if (dicebearRegex.test(content)) {
    content = content.replace(dicebearRegex, localAvatars);
    fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
    console.log("Local avatars updated!");
} else {
    console.log("Could not find Dicebear array.");
}
