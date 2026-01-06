// Default operating hours for Jealous Fork
// Used as fallback when Google Business Profile API is unavailable

export interface DayHours {
  dayOfWeek: string;
  opens: string | null;  // "09:00" format, null if closed
  closes: string | null; // "21:00" format, null if closed
  isClosed: boolean;
  note?: string;  // e.g., "Burgers 3PM-9PM"
}

export interface OperatingHoursData {
  regular: DayHours[];
  lastSynced: string | null;
  source: 'google_business_profile' | 'fallback';
}

export const DEFAULT_HOURS: OperatingHoursData = {
  regular: [
    { dayOfWeek: "Monday", opens: null, closes: null, isClosed: true },
    { dayOfWeek: "Tuesday", opens: "09:00", closes: "14:00", isClosed: false },
    { dayOfWeek: "Wednesday", opens: "09:00", closes: "14:00", isClosed: false },
    { dayOfWeek: "Thursday", opens: "09:00", closes: "14:00", isClosed: false },
    { dayOfWeek: "Friday", opens: "09:00", closes: "21:00", isClosed: false, note: "Burgers 3PM-9PM" },
    { dayOfWeek: "Saturday", opens: "09:00", closes: "21:00", isClosed: false, note: "Burgers 3PM-9PM" },
    { dayOfWeek: "Sunday", opens: "09:00", closes: "15:00", isClosed: false },
  ],
  lastSynced: null,
  source: 'fallback'
};

// Helper to format time from "09:00" to "9:00 AM"
export function formatTime(time: string | null): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return minutes === 0 ? `${displayHours} ${ampm}` : `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Helper to format a day's hours for display
export function formatDayHours(day: DayHours): string {
  if (day.isClosed) return 'Closed';
  return `${formatTime(day.opens)} - ${formatTime(day.closes)}`;
}

// Helper to get hours for Schema.org format
export function getSchemaOrgHours(hours: OperatingHoursData): string[] {
  return hours.regular
    .filter(day => !day.isClosed)
    .map(day => {
      const dayAbbrev = day.dayOfWeek.substring(0, 2);
      return `${dayAbbrev} ${day.opens}-${day.closes}`;
    });
}

// Helper to generate OpeningHoursSpecification for JSON-LD
export function getOpeningHoursSpecification(hours: OperatingHoursData) {
  return hours.regular
    .filter(day => !day.isClosed)
    .map(day => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": day.dayOfWeek,
      "opens": day.opens,
      "closes": day.closes
    }));
}
