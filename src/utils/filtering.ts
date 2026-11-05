import { FilterState, Report } from '../types.ts';

export function filterReports(reports: Report[], filters: FilterState): Report[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return reports.filter((report) => {
    // 1. Type filter
    if (filters.type !== 'all' && report.type !== filters.type) {
      return false;
    }

    // 2. Status filter
    if (filters.status !== 'all' && report.status !== filters.status) {
      return false;
    }

    // 3. Category filter
    if (filters.category && filters.category !== 'All Categories' && report.category !== filters.category) {
      return false;
    }

    // 4. Location filter
    if (filters.location && filters.location !== 'All Locations' && report.location !== filters.location) {
      return false;
    }

    // 5. Search query (matches title, description, location, category, reporterName)
    if (query) {
      const titleMatch = report.title.toLowerCase().includes(query);
      const descMatch = report.description.toLowerCase().includes(query);
      const locMatch = report.location.toLowerCase().includes(query);
      const catMatch = report.category.toLowerCase().includes(query);
      const reporterMatch = report.reporterName.toLowerCase().includes(query);

      if (!titleMatch && !descMatch && !locMatch && !catMatch && !reporterMatch) {
        return false;
      }
    }

    return true;
  });
}
