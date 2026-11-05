import React from 'react';
import { Search, X, MapPin, Tag, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState, ITEM_CATEGORIES, LPU_LOCATIONS } from '../types.ts';

interface FilterToolbarProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  totalFilteredCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onChangeFilters,
  totalFilteredCount,
}) => {
  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.type !== 'all' ||
    filters.status !== 'all' ||
    filters.category !== 'All Categories' ||
    filters.location !== 'All Locations';

  const resetFilters = () => {
    onChangeFilters({
      searchQuery: '',
      type: 'all',
      status: 'all',
      category: 'All Categories',
      location: 'All Locations',
    });
  };

  return (
    <div className="space-y-3.5 mb-6">
      {/* Search Bar + Primary Type Tabs */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by item name, description, brand, or registration #..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs transition-colors"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-200/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold overflow-x-auto no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, type: 'all', status: 'all' })}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
              filters.type === 'all' && filters.status === 'all'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            All Reports
          </button>

          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, type: 'lost', status: 'open' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
              filters.type === 'lost' && filters.status === 'open'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            Lost Items
          </button>

          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, type: 'found', status: 'open' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
              filters.type === 'found' && filters.status === 'open'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Found Items
          </button>

          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, status: 'resolved' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
              filters.status === 'resolved'
                ? 'bg-stone-800 dark:bg-stone-700 text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Resolved Cases
          </button>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Location Dropdown */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <select
              value={filters.location}
              onChange={(e) => onChangeFilters({ ...filters, location: e.target.value })}
              className="w-full sm:w-auto pl-8 pr-7 py-2 sm:py-1.5 rounded-xl sm:rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer shadow-2xs transition-colors"
            >
              {LPU_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <select
              value={filters.category}
              onChange={(e) => onChangeFilters({ ...filters, category: e.target.value })}
              className="w-full sm:w-auto pl-8 pr-7 py-2 sm:py-1.5 rounded-xl sm:rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer shadow-2xs transition-colors"
            >
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors w-full sm:w-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Total Results Count */}
        <div className="text-xs font-medium text-stone-500 dark:text-stone-400 text-right sm:text-left">
          Showing <span className="font-bold text-stone-800 dark:text-stone-200">{totalFilteredCount}</span> items
        </div>
      </div>
    </div>
  );
};
