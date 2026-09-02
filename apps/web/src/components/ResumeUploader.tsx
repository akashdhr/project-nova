"use client";
import { useState } from "react";
import { UploadCloud, CheckCircle2, FileText, X } from "lucide-react";
import { resumeService } from "@/services/api";
import { LegalModal } from "./LegalModal";
import { TermsContent } from "./TermsContent";

interface ResumeUploaderProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export function ResumeUploader({ onSuccess, compact = false }: ResumeUploaderProps) {
  const [resumeState, setResumeState] = useState<'idle'|'uploading'|'uploaded'|'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResumeState('idle');
      setShowError(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setTermsAccepted(false);
    setShowError(false);
  };

  const handleResumeProcess = async () => {
    if (!selectedFile) return;
    if (!termsAccepted) {
      setShowError(true);
      return;
    }

    setResumeState('uploading');
    setShowError(false);
    try {
      await resumeService.upload(selectedFile, "1.0", "1.0");
      setResumeState('uploaded');
      if (onSuccess) onSuccess();
    } catch (err) {
      setResumeState('error');
    }
  };

  return (
    <>
      <div className={`border-2 border-dashed border-[var(--border-color)] rounded-lg ${compact ? 'p-4' : 'p-6'} bg-gray-50 dark:bg-gray-800/50`}>
        {!selectedFile ? (
          <div className={`flex flex-col items-center justify-center relative ${compact ? 'min-h-[100px]' : 'min-h-[160px]'}`}>
            <UploadCloud className={`${compact ? 'w-6 h-6 mb-1' : 'w-10 h-10 mb-2'} text-[var(--text-secondary)]`} />
            <p className="text-sm font-medium text-[var(--text-primary)]">Click to upload or drag and drop</p>
            {!compact && <p className="text-xs text-[var(--text-secondary)] mt-1">PDF, DOCX up to 10MB</p>}
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileSelect} 
              accept=".pdf,.doc,.docx" 
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`flex items-center justify-between bg-white dark:bg-gray-900 border border-[var(--border-color)] rounded-lg shadow-sm ${compact ? 'p-3' : 'p-4'}`}>
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-indigo-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[180px] sm:max-w-xs">{selectedFile.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {resumeState !== 'uploading' && resumeState !== 'uploaded' && (
                <button onClick={clearFile} className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 rounded-full transition" aria-label="Remove file">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {resumeState === 'idle' || resumeState === 'error' ? (
              <div className={`space-y-3 bg-white dark:bg-gray-900 border border-[var(--border-color)] rounded-lg ${compact ? 'p-3' : 'p-4'}`}>
                <div className="flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id={`terms-consent-${compact ? 'compact' : 'full'}`}
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        setShowError(false);
                      }}
                    />
                  </div>
                  <label htmlFor={`terms-consent-${compact ? 'compact' : 'full'}`} className="ml-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    I agree to the <button type="button" onClick={() => setActiveModal('terms')} className="text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none">Terms & Conditions</button> and acknowledge the <button type="button" onClick={() => setActiveModal('privacy')} className="text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none">Privacy Policy</button>. I understand that Talvion will process my resume using AI.
                  </label>
                </div>
                
                {showError && (
                  <p className="text-xs font-medium text-red-500">
                    Please accept the legal terms before continuing.
                  </p>
                )}
                {resumeState === 'error' && (
                  <p className="text-xs font-medium text-red-500">
                    Error processing resume. Please try again.
                  </p>
                )}

                <button 
                  type="button" 
                  onClick={handleResumeProcess}
                  disabled={!termsAccepted}
                  className={`w-full py-2 font-medium rounded-lg text-sm transition-colors ${termsAccepted ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
                >
                  Upload & Process
                </button>
              </div>
            ) : resumeState === 'uploading' ? (
              <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-900 border border-[var(--border-color)] rounded-lg">
                 <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">Processing resume...</p>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="font-medium text-green-800 dark:text-green-300 text-sm">Processed successfully!</span>
              </div>
            )}
          </div>
        )}
      </div>

      <LegalModal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)} 
        title="Terms & Conditions"
      >
        <TermsContent />
      </LegalModal>

      <LegalModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        title="Privacy Policy"
      >
        <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-secondary)]">
          <p><strong>Effective Date:</strong> 29 September 2026<br/>
          <strong>Last Updated:</strong> 29 September 2026</p>
          
          <h3 className="text-lg font-bold mt-6 text-[var(--text-primary)]">Privacy Policy Placeholder</h3>
          <p>This privacy policy explains how Talvion collects, processes, stores, uses, and protects personal information.</p>
          <p><em>Full Privacy Policy content will be added here prior to production launch.</em></p>
        </div>
      </LegalModal>
    </>
  );
}
