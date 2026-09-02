import { X } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function LegalModal({ isOpen, onClose, title, children }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--card-bg)] w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-[var(--text-secondary)] text-sm space-y-4">
          {children}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-color)] bg-gray-50 dark:bg-[#121212]/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
        
      </div>
    </div>
  );
}
