const fs = require('fs');

let content = fs.readFileSync('apps/web/src/app/profile/page.tsx', 'utf8');

const observerLogic = `
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const matchingLink = sidebarLinks.find(link => link.id === entry.target.id);
          if (matchingLink) {
            setActiveTab(matchingLink.name);
          }
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });

    sidebarLinks.forEach(link => {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [loading]);
`;

content = content.replace('const sidebarLinks = [', observerLogic + '\n  const sidebarLinks = [');

fs.writeFileSync('apps/web/src/app/profile/page.tsx', content);
