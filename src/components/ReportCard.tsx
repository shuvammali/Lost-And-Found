import React from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  ArrowRight,
  User,
  ShieldCheck,
} from 'lucide-react';
import { MatchResult, Report } from '../types.ts';

interface ReportCardProps {
  report: Report;
  matches?: MatchResult[];
  onOpenDetails: (report: Report) => void;
  onOpenResolve: (report: Report) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  matches = [],
  onOpenDetails,
  onOpenResolve,
}) => {
  const isLost = report.type === 'lost';
  const isResolved = report.status === 'resolved';
  const hasMatches = matches.length > 0 && !isResolved;

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-stone-900 border transition-all duration-200 hover:shadow-md ${
        isResolved
          ? 'border-stone-200 dark:border-stone-800 opacity-85'
          : isLost
          ? 'border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-800/70'
          : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800/70'
      }`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {isResolved ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Case Resolved
              </span>
            ) : isLost ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60">
                <AlertCircle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                LOST ITEM
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                FOUND ITEM
              </span>
            )}

            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
              {report.category}
            </span>
          </div>

          {/* Smart Match Pill */}
          {hasMatches && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(report);
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 cursor-pointer hover:bg-indigo-100 transition-colors"
              title={`${matches.length} potential matching item(s) detected`}
            >
              <Sparkles className="w-3 h-3 text-indigo-500 animate-spin" />
              <span>{matches.length} Match{matches.length > 1 ? 'es' : ''}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetails(report)}
          className={`text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 line-clamp-2 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${
            isResolved ? 'line-through text-stone-500 dark:text-stone-400' : ''
          }`}
        >
          {report.title}
        </h3>

        {/* Campus Location & Incident Time */}
        <div className="mt-2.5 space-y-1 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="font-medium truncate">{report.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>{report.dateTime || 'Recently reported'}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {report.description}
        </p>

        {/* Resolved Note if applicable */}
        {isResolved && report.resolvedByNote && (
          <div className="mt-3 p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
            <span className="font-semibold text-stone-800 dark:text-stone-200">Resolution Note:</span>{' '}
            {report.resolvedByNote}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 truncate">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate max-w-[120px] font-medium">{report.reporterName || 'LPU Student'}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Resolve Button (Requires Secret Code) */}
          {!isResolved && (
            <button
              type="button"
              onClick={() => onOpenResolve(report)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
              title="Resolve item with secret code"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Resolve</span>
            </button>
          )}

          {/* Details / Connect Button */}
          <button
            type="button"
            onClick={() => onOpenDetails(report)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-colors"
          >
            <span>Connect</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
