const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/page.tsx', 'utf8');

// Update Primary Button styling to add the violet outer glow on hover
content = content.replace(
  'text-white bg-primary px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg',
  'text-white bg-primary px-8 py-3 rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]'
);

// Update Sign In button to shift to border-color on hover
content = content.replace(
  'bg-transparent border border-[var(--border-color)] px-8 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm hover:shadow-md',
  'bg-transparent border border-[var(--border-color)] px-8 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-[var(--border-color)] transition-colors shadow-sm'
);

// Update all floating badge backgrounds and shadows to use Nocturne logic Level 2 shadows and Level 1 background
content = content.replace(/bg-white\/90 dark:bg-\[\#111111\]\/90/g, 'bg-white/90 dark:bg-[var(--card-bg)]/90');
content = content.replace(/dark:shadow-\[0_8px_32px_0_rgba\(0,0,0,0\.5\)\]/g, 'dark:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.15)]');

fs.writeFileSync('apps/web/src/app/page.tsx', content);
