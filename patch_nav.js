const fs = require('fs');

let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

// 1. Update sidebar links to have IDs and implement scroll
const scrollLogic = `  const sidebarLinks = [
    { name: "Resume & Skills", id: "resume-skills" },
    { name: "Target Roles", id: "target-roles" },
    { name: "Locations & Mode", id: "locations-mode" },
    { name: "Compensation", id: "compensation" },
    { name: "Priorities & Deal Breakers", id: "priorities-deal-breakers" }
  ];

  const scrollToSection = (id: string, name: string) => {
    setActiveTab(name);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };`;

content = content.replace(/const sidebarLinks = \[\s*"Resume & Skills",\s*"Target Roles",\s*"Industries & Companies",\s*"Locations & Mode",\s*"Compensation",\s*"Priorities & Deal Breakers"\s*\];/s, scrollLogic);

// 2. Update the sidebar map
content = content.replace(/\{sidebarLinks\.map\(link => \([\s\S]*?\}\)/, `{sidebarLinks.map(link => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id, link.name)}
                      className={\`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition \${
                        activeTab === link.name
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-primary"
                          : "text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800"
                      }\`}
                    >
                      {link.name}
                    </button>
                  ))}`);

// 3. Add IDs to the cards
content = content.replace('{/* Resume & Core Details Card */}', '{/* Resume & Core Details Card */}\n              <div id="resume-skills">');
content = content.replace('{/* Target Roles Card */}', '</div>\n\n              {/* Target Roles Card */}\n              <div id="target-roles">');
content = content.replace('{/* Locations & Work Mode Card */}', '</div>\n\n              {/* Locations & Work Mode Card */}\n              <div id="locations-mode">');
content = content.replace('{/* Compensation Expectations */}', '</div>\n\n              {/* Compensation Expectations */}\n              <div id="compensation">');
content = content.replace('{/* Priorities & Deal Breakers */}', '</div>\n\n              {/* Priorities & Deal Breakers */}\n              <div id="priorities-deal-breakers">');

// We need to close the last card wrapper. It ends right before {/* Footer */}
content = content.replace(/(\s*)(?=\{\/\* Footer \*\/})/, '$1</div>$1');

fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
