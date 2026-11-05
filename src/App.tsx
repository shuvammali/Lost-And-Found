import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  PlusCircle,
  Shield,
  HelpCircle,
  FileQuestion,
  PhoneCall,
  Lock,
  Building2,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { FilterState, MatchResult, Report, ReportType } from './types.ts';
import { ReportService } from './services/reportService.ts';
import { filterReports } from './utils/filtering.ts';
import { findPotentialMatches } from './utils/matchmaker.ts';
import { Navbar } from './components/Navbar.tsx';
import { StatsBanner } from './components/StatsBanner.tsx';
import { FilterToolbar } from './components/FilterToolbar.tsx';
import { ReportCard } from './components/ReportCard.tsx';
import { CreateReportModal } from './components/CreateReportModal.tsx';
import { CodeWarningModal } from './components/CodeWarningModal.tsx';
import { ResolveModal } from './components/ResolveModal.tsx';
import { ReportDetailModal } from './components/ReportDetailModal.tsx';
import { HandoverGuidelines } from './components/HandoverGuidelines.tsx';

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lpu_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lpu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lpu_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Reports Data & Realtime Sync State
  const [reports, setReports] = useState<Report[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    ReportService.initialize();
    const unsubscribe = ReportService.subscribe((updatedReports, connected) => {
      setReports(updatedReports);
      setIsSyncing(connected);
    });
    return unsubscribe;
  }, []);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    type: 'all',
    status: 'all',
    category: 'All Categories',
    location: 'All Locations',
  });

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return filterReports(reports, filters);
  }, [reports, filters]);

  // Precomputed Smart Matches for each report
  const matchesMap = useMemo(() => {
    const map = new Map<string, MatchResult[]>();
    for (const report of reports) {
      if (report.status === 'open') {
        const matches = findPotentialMatches(report, reports, 35);
        if (matches.length > 0) {
          map.set(report.id, matches);
        }
      }
    }
    return map;
  }, [reports]);

  // Modals Management
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<ReportType>('lost');

  const [codeWarningReport, setCodeWarningReport] = useState<Report | null>(null);
  const [codeWarningModalOpen, setCodeWarningModalOpen] = useState(false);

  const [resolveTargetReport, setResolveTargetReport] = useState<Report | null>(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenCreate = (type: ReportType) => {
    setCreateModalType(type);
    setCreateModalOpen(true);
  };

  const handleReportCreated = (newReport: Report) => {
    // Show the Code Warning Modal immediately
    setCodeWarningReport(newReport);
    setCodeWarningModalOpen(true);
  };

  const handleOpenResolve = (report: Report) => {
    setResolveTargetReport(report);
    setResolveModalOpen(true);
  };

  const handleOpenDetails = (report: Report) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
  };

  const handleSelectFromMatch = (matchReport: Report) => {
    setSelectedReport(matchReport);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenReportModal={handleOpenCreate}
        isSyncing={isSyncing}
        onQuickSearchClick={() => {
          const el = document.querySelector('input[type="text"]') as HTMLInputElement;
          el?.focus();
        }}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Stats & Campus Welcome */}
        <StatsBanner reports={reports} />

        {/* Filter Toolbar */}
        <FilterToolbar
          filters={filters}
          onChangeFilters={setFilters}
          totalFilteredCount={filteredReports.length}
        />

        {/* Reports Feed Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                matches={matchesMap.get(report.id) || []}
                onOpenDetails={handleOpenDetails}
                onOpenResolve={handleOpenResolve}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="py-16 px-4 text-center rounded-3xl bg-white dark:bg-stone-900/60 border border-dashed border-stone-300 dark:border-stone-800 my-4">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center">
              <FileQuestion className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              No Matching Reports Found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              We couldn&apos;t find any lost or found items matching your search criteria. Try
              adjusting filters or be the first to report this item.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    type: 'all',
                    status: 'all',
                    category: 'All Categories',
                    location: 'All Locations',
                  })
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                Clear All Filters
              </button>
              <button
                type="button"
                onClick={() => handleOpenCreate('lost')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post New Report</span>
              </button>
            </div>
          </div>
        )}

        {/* Handover Guidelines & Campus Security Desks */}
        <HandoverGuidelines />

        {/* Security & Resolution Code Reminder Banner */}
        <div className="mt-8 p-5 sm:p-6 lg:p-7 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-emerald-500/10 border border-orange-200/60 dark:border-orange-900/30">
          {/* Laptop Mode Layout (lg: and above) - matches user screenshot exactly */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div className="flex items-center gap-4 min-w-0 max-w-3xl">
              <div className="p-3.5 rounded-2xl bg-orange-600 text-white shrink-0 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
                  How Case Resolution &amp; Security PINs Work
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1 max-w-2xl leading-relaxed">
                  Every reported item receives a unique resolution code. Once you hand over or
                  recover your property, tap &ldquo;Resolve&rdquo; on the card and enter this secret
                  PIN. This ensures malicious users cannot falsely mark your lost items as returned.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenCreate('lost')}
                className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-xs"
              >
                Report Lost Item
              </button>
              <button
                type="button"
                onClick={() => handleOpenCreate('found')}
                className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              >
                Report Found Item
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Mode Layout (< lg) - kept as is */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-3 sm:gap-y-2.5 items-center lg:hidden">
            {/* Left Heading with icon */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-orange-600 text-white shrink-0 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
                How Case Resolution &amp; Security PINs Work
              </h4>
            </div>

            {/* Right Buttons: aligned on the same row as the heading in tablet */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 order-last sm:order-none">
              <button
                type="button"
                onClick={() => handleOpenCreate('lost')}
                className="whitespace-nowrap inline-flex items-center justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-xs"
              >
                Report Lost Item
              </button>
              <button
                type="button"
                onClick={() => handleOpenCreate('found')}
                className="whitespace-nowrap inline-flex items-center justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              >
                Report Found Item
              </button>
            </div>

            {/* Description Text: aligned from heading start across to Report Found Item button */}
            <div className="sm:col-span-2 sm:pl-[52px]">
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                Every reported item receives a unique resolution code. Once you hand over or
                recover your property, tap &ldquo;Resolve&rdquo; on the card and enter this secret
                PIN. This ensures malicious users cannot falsely mark your lost items as returned.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-950/70 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/lpu_logo_7fbee4ea.png"
              alt="LPU Logo"
              className="w-8 h-8 object-contain rounded-full ring-1 ring-orange-500/20"
            />
            <div>
              <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                Lost <span className="text-orange-600 dark:text-orange-500">&</span> Found
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 block sm:inline sm:ml-2">
                Lovely Professional University, Phagwara, Punjab
              </span>
            </div>
          </div>

          {/* Description (between logo and campus security text) */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-4xl">
            A dedicated campus portal for Lovely Professional University students and faculty to publicly report lost belongings, post found items, connect safely, and facilitate the seamless return and resolution of lost property across university premises.
          </p>

          {/* Campus Security Text */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800/80 pt-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-stone-400" />
              Campus Security: Block 14 Desk
            </span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-stone-400" />
              LPU Security Control: 01824-517000
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateReportModal
        initialType={createModalType}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onReportCreated={handleReportCreated}
      />

      <CodeWarningModal
        report={codeWarningReport}
        isOpen={codeWarningModalOpen}
        onClose={() => setCodeWarningModalOpen(false)}
      />

      <ResolveModal
        report={resolveTargetReport}
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        onResolvedSuccess={(updatedId) => {
          // If the currently open detail modal is this report, update it
          if (selectedReport && selectedReport.id === updatedId) {
            setSelectedReport((prev) => (prev ? { ...prev, status: 'resolved' } : null));
          }
        }}
      />

      <ReportDetailModal
        report={selectedReport}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onOpenResolve={handleOpenResolve}
        matches={selectedReport ? matchesMap.get(selectedReport.id) || [] : []}
        onSelectReport={handleSelectFromMatch}
      />
    </div>
  );
}
