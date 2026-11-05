import React, { useState } from 'react';
import {
  AlertTriangle,
  Copy,
  Check,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Report } from '../types.ts';

interface CodeWarningModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CodeWarningModal: React.FC<CodeWarningModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report.secretCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTicket = () => {
    const textContent = `================================================
LOVELY PROFESSIONAL UNIVERSITY - LOST AND FOUND
RESOLUTION PASS & SECURITY RECEIPT
================================================
Report ID       : ${report.id}
Item Title      : ${report.title}
Report Type     : ${report.type.toUpperCase()}
Category        : ${report.category}
Campus Location : ${report.location}
Date/Time       : ${report.dateTime || 'N/A'}
Reported By     : ${report.reporterName}
Contact Info    : ${report.reporterContact}

------------------------------------------------
YOUR SECRET RESOLUTION CODE:
${report.secretCode}
------------------------------------------------

⚠️ CRITICAL INSTRUCTION:
Keep this code strictly confidential until your item
is returned and verified! Anyone with this code can
mark the report as resolved in the campus system.

Issued: ${new Date().toLocaleString()}
================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LPU-LostFound-${report.id}-ResolutionCode.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
        {/* Top Warning Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

        {/* Warning Header */}
        <div className="flex items-start gap-4 mb-4 pt-1">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              Security Notice Required
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
              Save Your Resolution Code!
            </h2>
          </div>
        </div>

        {/* Warning Description Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm leading-relaxed mb-5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Important Warning:</strong> You must store this secret code now.
              Once your lost item is recovered or found item returned, you will be
              required to enter this exact code to mark the report as resolved.
              <strong> Random users cannot resolve or close your report without it.</strong>
            </p>
          </div>
        </div>

        {/* Code Display Area */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-center mb-5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1.5">
            <KeyRound className="w-3.5 h-3.5 text-orange-500" />
            <span>Your Secret Resolution Code</span>
          </div>

          <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-orange-600 dark:text-orange-400 py-1 select-all">
            {report.secretCode}
          </div>

          <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
            Associated with report for &ldquo;{report.title}&rdquo;
          </p>

          {/* Quick Copy & Download Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-2xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Code Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Copy Resolution Code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadTicket}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-2xs transition-colors"
            >
              <Download className="w-4 h-4 text-stone-500" />
              <span>Save as Text Pass</span>
            </button>
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all active:scale-95"
          >
            <span>I Have Saved My Code, Proceed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
