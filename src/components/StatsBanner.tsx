import React from 'react';
import { Search, Shield, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';
import { Report } from '../types.ts';

interface StatsBannerProps {
  reports: Report[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ reports }) => {
  const lostCount = reports.filter((r) => r.type === 'lost' && r.status === 'open').length;
  const foundCount = reports.filter((r) => r.type === 'found' && r.status === 'open').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="pt-6 pb-4">
      {/* Hero Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          Official Campus Community Hub
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
              Reconnecting Belongings Across LPU Campus
            </h1>
            <p className="mt-2 text-xs sm:text-base text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed">
              Publicly report lost or found property. Receive a unique verification code to keep your item secure and resolve cases smoothly.
            </p>
          </div>

          {/* Security Warning Notice - aligned with h1 top and matching height, tightly hugging text */}
          <div className="sm:w-72 md:w-80 lg:w-96 p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm shrink-0 shadow-2xs self-start">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="leading-relaxed">
                <strong className="font-extrabold text-amber-950 dark:text-amber-100 block sm:inline">
                  Protected Handover:
                </strong>{' '}
                <span>Only the report holder with the secret code can resolve items.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Reported</span>
            <Search className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {reports.length}
          </div>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Total campus entries</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <span>Lost Items</span>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400">
            {lostCount}
          </div>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Looking for recovery</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <span>Found Items</span>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {foundCount}
          </div>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Awaiting owner claim</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <span>Resolved & Returned</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400">
            {resolvedCount}
          </div>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Verified and closed</p>
        </div>
      </div>
    </div>
  );
};
