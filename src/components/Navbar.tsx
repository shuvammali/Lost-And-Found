import React from 'react';
import { Sun, Moon, PlusCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { ReportType } from '../types.ts';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenReportModal: (type: ReportType) => void;
  isSyncing: boolean;
  onQuickSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenReportModal,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-stone-50/95 dark:bg-stone-950/95 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-18 gap-1.5 sm:gap-3">
          {/* Logo & Brand: perfectly aligned and proportional on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
            <div className="relative shrink-0">
              <img
                src="/assets/aistudio/lpu_logo_7fbee4ea.png"
                alt="Lovely Professional University Logo"
                className="w-8 h-8 sm:w-11 sm:h-11 object-contain rounded-full shadow-2xs ring-2 ring-orange-500/30"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span
                  className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"
                  title="Connected to campus network"
                ></span>
              </span>
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-sm sm:text-xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 whitespace-nowrap">
                  Lost <span className="text-orange-600 dark:text-orange-500">&</span> Found
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60">
                  <ShieldCheck className="w-3 h-3" />
                  PIN Verified
                </span>
              </div>
              <p className="text-[9px] sm:text-xs font-semibold text-stone-700 dark:text-stone-300 tracking-tight whitespace-nowrap">
                Lovely Professional University
              </p>
            </div>
          </div>

          {/* Right Action Controls: clean and compact, never clips */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 sm:p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-2xs transition-all active:scale-95 shrink-0"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
              )}
            </button>

            {/* Post Found Item button */}
            <button
              type="button"
              onClick={() => onOpenReportModal('found')}
              aria-label="Report found item"
              className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all active:scale-95 shrink-0"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="hidden sm:inline">Found Item</span>
              <span className="sm:hidden">Found</span>
            </button>

            {/* Post Lost Item button */}
            <button
              type="button"
              onClick={() => onOpenReportModal('lost')}
              aria-label="Report lost item"
              className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-2xs transition-all active:scale-95 shrink-0"
            >
              <PlusCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="hidden sm:inline">Lost Something</span>
              <span className="sm:hidden">Lost</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
