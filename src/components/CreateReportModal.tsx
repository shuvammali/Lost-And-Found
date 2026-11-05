import React, { useState, useEffect } from 'react';
import {
  X,
  AlertCircle,
  Sparkles,
  MapPin,
  Tag,
  Clock,
  User,
  Phone,
  FileText,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { ITEM_CATEGORIES, LPU_LOCATIONS, Report, ReportType } from '../types.ts';
import { generateResolutionCode } from '../utils/codeGenerator.ts';
import { ReportService } from '../services/reportService.ts';

interface CreateReportModalProps {
  initialType: ReportType;
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (newReport: Report) => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  initialType,
  isOpen,
  onClose,
  onReportCreated,
}) => {
  const [type, setType] = useState<ReportType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ITEM_CATEGORIES[1]); // Default to 'Electronics & Gadgets'
  const [location, setLocation] = useState(LPU_LOCATIONS[1]); // Default to 'Block 13 (Student Centre)'
  const [customLocation, setCustomLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !reporterContact.trim()) {
      setErrorMsg('Please fill in all mandatory fields (Title, Description, and Contact info).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const finalLocation =
        location === 'Other LPU Campus Spot' && customLocation.trim()
          ? customLocation.trim()
          : location;

      const secretCode = generateResolutionCode();
      const reportId = `lpu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

      const newReport: Report = {
        id: reportId,
        type,
        title: title.trim(),
        category,
        location: finalLocation,
        dateTime: dateTime.trim() || 'Recently reported',
        description: description.trim(),
        reporterName: reporterName.trim() || 'LPU Student',
        reporterContact: reporterContact.trim(),
        secretCode,
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      await ReportService.createReport(newReport);
      onReportCreated(newReport);
      onClose();

      // Reset form
      setTitle('');
      setDescription('');
      setReporterName('');
      setReporterContact('');
      setDateTime('');
    } catch (err: unknown) {
      console.error('Error creating report:', err);
      setErrorMsg('Failed to post report. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl text-white ${
                type === 'lost' ? 'bg-orange-600' : 'bg-emerald-600'
              }`}
            >
              {type === 'lost' ? <AlertCircle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-50">
                {type === 'lost' ? 'Report a Lost Property Item' : 'Report a Found Property Item'}
              </h2>
              <p className="text-xs text-stone-700 dark:text-stone-300">
                Lovely Professional University Campus Registry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Type Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Incident Type <span className="text-orange-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  type === 'lost'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  type === 'found'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                I Found Something
              </button>
            </div>
          </div>

          {/* Item Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Item Name / Short Title <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'lost'
                  ? 'e.g. Casio fx-991EX Scientific Calculator'
                  : 'e.g. Student ID Card found near Uni-Mall'
              }
              required
              maxLength={100}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Category <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-9 pr-7 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
                >
                  {ITEM_CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Campus Location <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-7 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
                >
                  {LPU_LOCATIONS.filter((l) => l !== 'All Locations').map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {location === 'Other LPU Campus Spot' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Specify Exact Location Spot
              </label>
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="e.g. Near Food Kiosk #4, opposite Block 33"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
              />
            </div>
          )}

          {/* Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Date & Approximate Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                placeholder="e.g. Yesterday afternoon around 3:30 PM"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Detailed Description & Distinguishing Marks <span className="text-orange-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe distinguishing marks, model/serial, stickers, color, case details, or specific room/hallway..."
              rows={3}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs resize-none"
            />
          </div>

          {/* Reporter Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Your Name / Student ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Rohit Kumar (1210892)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Contact Info (Phone / Email) <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="e.g. 9876543210 or rohit@lpu.in"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Security PIN Warning Preview Banner */}
          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 flex items-start gap-2.5 text-xs text-orange-800 dark:text-orange-300">
            <KeyRound className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <strong>Resolution Code will be generated:</strong> On submission, you will receive a
              secret PIN. You must save it to close and resolve this case after recovery.
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
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
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-95 disabled:opacity-50 ${
                type === 'lost'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isSubmitting ? (
                <span>Publishing Report...</span>
              ) : (
                <span>Publish Report & Get Secret Code</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
