import React from 'react';
import {
  ShieldCheck,
  Video,
  IdCard,
  Building2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const HandoverGuidelines: React.FC = () => {
  return (
    <section className="scroll-mt-24 mt-12 rounded-3xl bg-gradient-to-br from-stone-100 via-orange-50/40 to-stone-100 dark:from-stone-900 dark:via-orange-950/20 dark:to-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 md:p-7 lg:p-8 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-orange-600 text-white shadow-xs shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-snug">
              Handover Guidelines &amp; Campus Security Desks
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              Essential safety protocol for returning and collecting property at Lovely Professional University
            </p>
          </div>
        </div>

        {/* Daytime Handovers Only: centered on mobile, neatly aligned on tablet & desktop */}
        <div className="flex justify-center md:justify-end w-full md:w-auto shrink-0 pt-1 md:pt-0">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-stone-700 shrink-0 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>Daytime Handovers Only</span>
          </div>
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
        {/* Rule 1: Registration Verification */}
        <div className="flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div>
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
              <IdCard className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
              Verify Registration Number
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Always verify the student or faculty registration number on their official LPU ID card
              or UMS profile while handovering the lost product to confirm legitimate ownership.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-orange-700 dark:text-orange-400">
            Check UMS ID / Photo Match
          </div>
        </div>

        {/* Rule 2: CCTV Daytime Hubs */}
        <div className="flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
              Meet at CCTV-Monitored Hubs
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              To avoid scams or wrongful claims, always meet during daytime hours at CCTV-monitored
              hubs on campus (such as Block 13 Student Centre or Uni-Mall food court).
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            Avoid Isolated Spots or After-Hours
          </div>
        </div>

        {/* Rule 3: Official Security Desks */}
        <div className="flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div>
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
              Official Security Desks
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Prefer depositing or exchanging high-value belongings directly at designated campus security desks:
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
              <span className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 font-medium truncate text-center">Block 14 Admin</span>
              <span className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 font-medium truncate text-center">Block 13 Reception</span>
              <span className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 font-medium truncate text-center">Central Library</span>
              <span className="px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 font-medium truncate text-center">Uni-Mall Desk</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-sky-700 dark:text-sky-400">
            24x7 Guarded Custody
          </div>
        </div>

        {/* Rule 4: Resolve Report */}
        <div className="flex flex-col justify-between p-4.5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
              Resolve After Problem Is Solved
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Resolve the report after the problem is solved! Once the item is safely returned, tap
              &ldquo;Resolve&rdquo; and enter your secret code to close the public listing and update
              the campus database.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
            Requires Secret Resolution PIN
          </div>
        </div>
      </div>

    </section>
  );
};
