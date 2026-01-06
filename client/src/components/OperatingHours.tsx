import { useOperatingHours, getGroupedHours, formatTodayHours, isCurrentlyOpen } from '@/hooks/useOperatingHours';
import type { OperatingHoursData } from '../../../shared/defaultHours';

interface OperatingHoursProps {
  variant?: 'full' | 'compact' | 'footer';
  className?: string;
}

/**
 * Display operating hours with different variants
 */
export default function OperatingHours({ variant = 'full', className = '' }: OperatingHoursProps) {
  const { data: hours, isLoading } = useOperatingHours();

  if (isLoading || !hours) {
    return <div className={className}>Loading hours...</div>;
  }

  switch (variant) {
    case 'compact':
      return <CompactHours hours={hours} className={className} />;
    case 'footer':
      return <FooterHours hours={hours} className={className} />;
    case 'full':
    default:
      return <FullHours hours={hours} className={className} />;
  }
}

/**
 * Full hours display (for Contact page)
 */
function FullHours({ hours, className }: { hours: OperatingHoursData; className?: string }) {
  const grouped = getGroupedHours(hours);
  const open = isCurrentlyOpen(hours);

  return (
    <div className={className}>
      {/* Open/Closed indicator */}
      <div className={`text-sm font-medium mb-2 ${open ? 'text-green-600' : 'text-red-600'}`}>
        {open ? 'Open Now' : 'Currently Closed'}
      </div>

      <div className="space-y-1">
        {grouped.map((group, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-700">{group.days}:</span>
            <span className={group.hours === 'Closed' ? 'text-red-600' : 'text-gray-600'}>
              {group.hours}
              {group.note && <span className="text-xs text-gray-500 ml-1">({group.note})</span>}
            </span>
          </div>
        ))}
      </div>

      {hours.source === 'google_business_profile' && hours.lastSynced && (
        <p className="text-xs text-gray-400 mt-2">
          Hours synced from Google
        </p>
      )}
    </div>
  );
}

/**
 * Compact hours display (single line)
 */
function CompactHours({ hours, className }: { hours: OperatingHoursData; className?: string }) {
  const todayText = formatTodayHours(hours);
  const open = isCurrentlyOpen(hours);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`w-2 h-2 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}></span>
      <span>{todayText}</span>
    </div>
  );
}

/**
 * Footer hours display
 */
function FooterHours({ hours, className }: { hours: OperatingHoursData; className?: string }) {
  // Group into simple display for footer
  const tueThu = hours.regular.find(d => d.dayOfWeek === 'Tuesday');
  const friSat = hours.regular.find(d => d.dayOfWeek === 'Friday');
  const sunday = hours.regular.find(d => d.dayOfWeek === 'Sunday');

  return (
    <div className={`space-y-1 text-sm ${className}`}>
      <p>Tue-Thu, Sun: {tueThu && !tueThu.isClosed
        ? `${formatTime12h(tueThu.opens)} - ${formatTime12h(tueThu.closes)}`
        : 'Closed'
      }</p>
      <p>Fri-Sat: {friSat && !friSat.isClosed
        ? `${formatTime12h(friSat.opens)} - ${formatTime12h(friSat.closes)}`
        : 'Closed'
      }</p>
      {friSat?.note && (
        <p className="text-xs text-gray-500">({friSat.note})</p>
      )}
      <p className="text-red-500">Closed Mondays</p>
    </div>
  );
}

// Helper to format time as "9:00 AM"
function formatTime12h(time: string | null): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return minutes === 0 ? `${displayHours}:00 ${ampm}` : `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}
