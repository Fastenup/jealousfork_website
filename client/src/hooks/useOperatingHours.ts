import { useQuery } from '@tanstack/react-query';
import type { OperatingHoursData, DayHours } from '../../../shared/defaultHours';
import { DEFAULT_HOURS, formatTime, formatDayHours } from '../../../shared/defaultHours';

/**
 * Fetch operating hours from the API
 */
export function useOperatingHours() {
  return useQuery<OperatingHoursData>({
    queryKey: ['/api/hours'],
    queryFn: async () => {
      const response = await fetch('/api/hours');
      if (!response.ok) {
        throw new Error('Failed to fetch hours');
      }
      return response.json();
    },
    staleTime: 60 * 60 * 1000, // 1 hour - hours rarely change mid-day
    gcTime: 24 * 60 * 60 * 1000, // 24 hours cache
    retry: 2,
    // Fallback to default hours on error
    placeholderData: DEFAULT_HOURS,
  });
}

/**
 * Check if the restaurant is currently open
 */
export function isCurrentlyOpen(hours: OperatingHoursData): boolean {
  const now = new Date();
  const dayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[dayIndex];

  const todayHours = hours.regular.find(d => d.dayOfWeek === todayName);
  if (!todayHours || todayHours.isClosed) return false;

  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseTimeToNumber(todayHours.opens);
  const closeTime = parseTimeToNumber(todayHours.closes);

  return currentTime >= openTime && currentTime < closeTime;
}

/**
 * Parse "09:00" to 900, "21:00" to 2100
 */
function parseTimeToNumber(time: string | null): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 100 + minutes;
}

/**
 * Get today's hours for display
 */
export function getTodayHours(hours: OperatingHoursData): DayHours | null {
  const now = new Date();
  const dayIndex = now.getDay();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[dayIndex];

  return hours.regular.find(d => d.dayOfWeek === todayName) || null;
}

/**
 * Format hours for compact display (e.g., "Open Today: 9 AM - 3 PM")
 */
export function formatTodayHours(hours: OperatingHoursData): string {
  const today = getTodayHours(hours);
  if (!today) return 'Hours unavailable';
  if (today.isClosed) return 'Closed Today';
  return `Open Today: ${formatTime(today.opens)} - ${formatTime(today.closes)}`;
}

/**
 * Group hours for display (e.g., "Tue-Thu: 9 AM - 3 PM")
 */
export function getGroupedHours(hours: OperatingHoursData): { days: string; hours: string; note?: string }[] {
  const result: { days: string; hours: string; note?: string }[] = [];
  const dayAbbrev: Record<string, string> = {
    'Monday': 'Mon',
    'Tuesday': 'Tue',
    'Wednesday': 'Wed',
    'Thursday': 'Thu',
    'Friday': 'Fri',
    'Saturday': 'Sat',
    'Sunday': 'Sun',
  };

  // Find Monday first (closed)
  const monday = hours.regular.find(d => d.dayOfWeek === 'Monday');
  if (monday?.isClosed) {
    result.push({ days: 'Monday', hours: 'Closed' });
  }

  // Group Tuesday-Thursday (same hours)
  const tueThu = hours.regular.filter(d =>
    ['Tuesday', 'Wednesday', 'Thursday'].includes(d.dayOfWeek) && !d.isClosed
  );
  if (tueThu.length === 3 && tueThu.every(d => d.opens === tueThu[0].opens && d.closes === tueThu[0].closes)) {
    result.push({
      days: 'Tue - Thu',
      hours: formatDayHours(tueThu[0])
    });
  } else {
    tueThu.forEach(d => result.push({ days: dayAbbrev[d.dayOfWeek], hours: formatDayHours(d) }));
  }

  // Friday & Saturday (extended hours)
  const friSat = hours.regular.filter(d =>
    ['Friday', 'Saturday'].includes(d.dayOfWeek) && !d.isClosed
  );
  if (friSat.length === 2 && friSat.every(d => d.opens === friSat[0].opens && d.closes === friSat[0].closes)) {
    result.push({
      days: 'Fri & Sat',
      hours: formatDayHours(friSat[0]),
      note: friSat[0].note
    });
  } else {
    friSat.forEach(d => result.push({ days: dayAbbrev[d.dayOfWeek], hours: formatDayHours(d), note: d.note }));
  }

  // Sunday
  const sunday = hours.regular.find(d => d.dayOfWeek === 'Sunday');
  if (sunday && !sunday.isClosed) {
    result.push({ days: 'Sunday', hours: formatDayHours(sunday) });
  } else if (sunday?.isClosed) {
    result.push({ days: 'Sunday', hours: 'Closed' });
  }

  return result;
}

// Re-export utility functions from shared
export { formatTime, formatDayHours, getSchemaOrgHours, getOpeningHoursSpecification } from '../../../shared/defaultHours';
