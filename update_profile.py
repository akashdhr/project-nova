import re

with open("apps/web/src/app/profile/page.tsx", "r") as f:
    content = f.read()

# Replace import { SkillsEditor } with TagEditor
content = content.replace('import { SkillsEditor } from "@/components/SkillsEditor";', 'import { TagEditor } from "@/components/TagEditor";')

# Inject state variables right after isEditingSkills
state_injection = """  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const startEditing = (card: string) => {
    setEditingCard(card);
    setEditForm({ ...profile });
  };

  const saveCard = async () => {
    try {
      await profileService.update(editForm);
      setProfile({ ...profile, ...editForm });
      setEditingCard(null);
    } catch(err) {
      alert("Failed to update profile");
    }
  };
"""
content = content.replace('  const [isEditingSkills, setIsEditingSkills] = useState(false);', state_injection)

# Replace SkillsEditor usage with TagEditor
content = content.replace('<SkillsEditor', '<TagEditor')
content = content.replace('initialSkills={profile.skills}', 'initialTags={profile.skills}')
content = content.replace('newSkills', 'newTags')

with open("apps/web/src/app/profile/page.tsx", "w") as f:
    f.write(content)

