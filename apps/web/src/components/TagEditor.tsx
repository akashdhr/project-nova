"use client";
import { useState } from "react";
import { X, Plus, Check } from "lucide-react";

interface TagEditorProps {
  initialTags: string[];
  onSave: (newTags: string[]) => void;
  onCancel: () => void;
  placeholder?: string;
  emptyMessage?: string;
}

export function TagEditor({ initialTags, onSave, onCancel, placeholder = "Type and press Enter...", emptyMessage = "None added yet." }: TagEditorProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (tagToRemove: string) => {
    setTags(tags.filter(s => s !== tagToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(tags);
    setIsSaving(false);
  };

  return (
    <div className="space-y-4 bg-[var(--bg-color)] p-4 rounded-lg border border-[var(--border-color)]">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-xs font-medium rounded-full">
            {tag}
            <button 
              onClick={() => handleRemove(tag)}
              className="ml-2 hover:text-red-500 focus:outline-none transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-xs text-[var(--text-secondary)] py-1.5">{emptyMessage}</span>}
      </div>
      
      <div className="flex items-center gap-2">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 text-sm p-2 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:border-primary outline-none transition-colors"
        />
        <button 
          onClick={handleAdd}
          className="p-2 bg-gray-100 dark:bg-neutral-900 text-[var(--text-primary)] rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button 
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-indigo-600 transition-colors"
        >
          {isSaving ? "Saving..." : <><Check className="w-3 h-3 mr-1.5" /> Save</>}
        </button>
      </div>
    </div>
  );
}
