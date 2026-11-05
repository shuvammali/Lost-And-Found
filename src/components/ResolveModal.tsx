import React, { useState } from 'react';
import {
  X,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Report } from '../types.ts';
import { ReportService } from '../services/reportService.ts';

interface ResolveModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onResolvedSuccess: (updatedReportId: string) => void;
}

export const ResolveModal: React.FC<ResolveModalProps> = ({
  report,
  isOpen,
  onClose,
  onResolvedSuccess,
}) => {
  const [code, setCode] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !report) return null;

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMessage('Please enter the secret resolution code.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await ReportService.resolveReport(report.id, code, note);
      if (result.success) {
        setIsSuccess(true);
        // Trigger celebratory confetti
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#10b981', '#3b82f6', '#f59e0b'],
        });

        setTimeout(() => {
          setIsSuccess(false);
          setCode('');
          setNote('');
          onResolvedSuccess(report.id);
          onClose();
        }, 1800);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err: unknown) {
      setErrorMessage('An unexpected error occurred while resolving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting || isSuccess}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-300 dark:border-emerald-700">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-50">
              Report Successfully Resolved!
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xs mx-auto">
              The item has been officially marked as returned and closed in the campus network.
            </p>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Secure Case Closure
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-50">
                  Resolve & Close Report
                </h2>
              </div>
            </div>

            {/* Target Item Brief */}
            <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 mb-5">
              <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Item to be resolved
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 line-clamp-1">
                {report.title}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Location: {report.location}
              </div>
            </div>

            {/* Security Notice */}
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
              To prevent unauthorized users from prematurely closing cases, please enter the
              <strong> Secret Resolution Code</strong> received when this report was created.
            </p>

            {/* Form */}
            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Secret Resolution Code <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setErrorMessage('');
                    }}
                    placeholder="e.g. LPU-8H1ZY4"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono text-sm tracking-wider uppercase focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Resolution Remarks / Handover Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Received back from security desk in Block 34, student verified ID."
                  rows={2}
                  maxLength={250}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs resize-none"
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Close Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
