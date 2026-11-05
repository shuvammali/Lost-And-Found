import React from 'react';
import {
  X,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Shield,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { MatchResult, Report } from '../types.ts';

interface ReportDetailModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenResolve: (report: Report) => void;
  matches: MatchResult[];
  onSelectReport: (report: Report) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen,
  onClose,
  onOpenResolve,
  matches,
  onSelectReport,
}) => {
  if (!isOpen || !report) return null;

  const isLost = report.type === 'lost';
  const isResolved = report.status === 'resolved';

  // Extract contact links
  const contactText = report.reporterContact || '';
  const phoneMatch = contactText.match(/(\+?\d[\d\s-]{8,})/);
  const phoneNumber = phoneMatch ? phoneMatch[0].replace(/[\s-]/g, '') : null;
  const emailMatch = contactText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {isResolved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Case Resolved & Returned
              </span>
            ) : isLost ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                Lost Item Report
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Found Item Report
              </span>
            )}
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {report.category}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
              {report.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-medium text-stone-800 dark:text-stone-200">{report.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{report.dateTime || 'Recently reported'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Reported by {report.reporterName || 'LPU Student/Staff'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Item Details & Identifying Characteristics
            </h4>
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-sm leading-relaxed whitespace-pre-wrap">
              {report.description}
            </div>
          </div>

          {/* Resolved Note if applicable */}
          {isResolved && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resolution Record
              </div>
              <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                {report.resolvedByNote || 'Item was successfully returned and verified with secret code.'}
              </p>
              {report.resolvedAt && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  Closed on {new Date(report.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Connect & Contact Options Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5 flex items-center justify-between">
              <span>Direct Student Contact & Retrieval</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" /> Campus Verified
              </span>
            </h4>

            <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3 bg-stone-100 dark:bg-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800">
              {report.reporterContact}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {phoneNumber && (
                <>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Reporter</span>
                  </a>
                  <a
                    href={`https://wa.me/${phoneNumber.replace(/^\+/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </>
              )}

              {email && (
                <a
                  href={`mailto:${email}?subject=Regarding LPU Lost and Found Report: ${encodeURIComponent(
                    report.title
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send University Email</span>
                </a>
              )}
            </div>

            {/* Campus Handover Safety Guidelines */}
            <div className="mt-4 p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/70 dark:border-orange-800/40 text-[11px] text-stone-700 dark:text-stone-300 space-y-1.5">
              <div className="font-bold text-orange-700 dark:text-orange-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Shield className="w-3.5 h-3.5" />
                Handover Guidelines & Security Protocol
              </div>
              <ul className="space-y-1 list-disc list-inside text-stone-600 dark:text-stone-300">
                <li>
                  <strong>Verify registration number:</strong> Always verify the student or faculty
                  registration number on their official ID card while handovering the lost product.
                </li>
                <li>
                  <strong>Daytime CCTV hubs:</strong> To avoid scams or wrongful claims, always meet
                  during daytime at CCTV-monitored hubs on campus (Block 14 Security Desk, Block 13,
                  Central Library, or Uni-Mall).
                </li>
                <li>
                  <strong>Resolve after solved:</strong> Resolve the report promptly after the
                  problem is solved by providing the secret resolution code.
                </li>
              </ul>
            </div>
          </div>

          {/* Smart Matchmaker Section */}
          {!isResolved && matches.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                    Smart Campus Matches ({matches.length})
                  </h4>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  Detected from opposite {isLost ? 'found' : 'lost'} records
                </span>
              </div>

              <div className="space-y-2.5">
                {matches.slice(0, 3).map(({ report: matchItem, score, reasons }) => (
                  <div
                    key={matchItem.id}
                    onClick={() => onSelectReport(matchItem)}
                    className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-800/40 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {matchItem.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                          {score}% Match
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-2">
                        <span>{matchItem.location}</span>
                        <span>•</span>
                        <span>{reasons.slice(0, 2).join(' • ')}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 text-stone-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 shadow-2xs shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Report ID: <span className="font-mono">{report.id}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {!isResolved && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenResolve(report);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
              >
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Resolve This Report</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
