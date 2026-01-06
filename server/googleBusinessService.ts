// Google Business Profile API Service
// Fetches operating hours from Google Business Profile

import { DEFAULT_HOURS, type OperatingHoursData, type DayHours } from '../shared/defaultHours';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_BUSINESS_API_BASE = 'https://mybusinessbusinessinformation.googleapis.com/v1';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface GoogleTimePeriod {
  openDay: string;  // "MONDAY", "TUESDAY", etc.
  openTime: { hours: number; minutes?: number };
  closeDay: string;
  closeTime: { hours: number; minutes?: number };
}

interface GoogleRegularHours {
  periods: GoogleTimePeriod[];
}

interface GoogleLocationResponse {
  name: string;
  regularHours?: GoogleRegularHours;
  specialHours?: any;
}

// Cache for access token
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Get a fresh access token using the refresh token
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5 minute buffer)
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 300000) {
    return cachedAccessToken;
  }

  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_BUSINESS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Business Profile API credentials not configured');
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh access token: ${response.status} - ${errorText}`);
  }

  const data: GoogleTokenResponse = await response.json();
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in * 1000);

  console.log('Google Business Profile: Access token refreshed');
  return cachedAccessToken;
}

/**
 * Convert Google's day format to our format
 */
function convertDayName(googleDay: string): string {
  const dayMap: Record<string, string> = {
    'MONDAY': 'Monday',
    'TUESDAY': 'Tuesday',
    'WEDNESDAY': 'Wednesday',
    'THURSDAY': 'Thursday',
    'FRIDAY': 'Friday',
    'SATURDAY': 'Saturday',
    'SUNDAY': 'Sunday',
  };
  return dayMap[googleDay] || googleDay;
}

/**
 * Convert Google's time format to "HH:MM" string
 */
function convertTime(time: { hours: number; minutes?: number }): string {
  const hours = time.hours.toString().padStart(2, '0');
  const minutes = (time.minutes || 0).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parse Google's hours response into our format
 */
function parseGoogleHours(regularHours: GoogleRegularHours | undefined): DayHours[] {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Start with all days closed
  const hoursMap: Record<string, DayHours> = {};
  daysOfWeek.forEach(day => {
    hoursMap[day] = {
      dayOfWeek: day,
      opens: null,
      closes: null,
      isClosed: true,
    };
  });

  if (regularHours?.periods) {
    for (const period of regularHours.periods) {
      const dayName = convertDayName(period.openDay);
      if (hoursMap[dayName]) {
        hoursMap[dayName] = {
          dayOfWeek: dayName,
          opens: convertTime(period.openTime),
          closes: convertTime(period.closeTime),
          isClosed: false,
        };

        // Add note for extended Friday/Saturday hours (burger hours)
        if ((dayName === 'Friday' || dayName === 'Saturday') &&
            period.closeTime.hours >= 21) {
          hoursMap[dayName].note = 'Burgers 3PM-9PM';
        }
      }
    }
  }

  return daysOfWeek.map(day => hoursMap[day]);
}

/**
 * Fetch operating hours from Google Business Profile API
 */
export async function fetchGoogleBusinessHours(): Promise<OperatingHoursData> {
  const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

  if (!locationId) {
    console.log('Google Business Profile: Location ID not configured, using fallback hours');
    return DEFAULT_HOURS;
  }

  try {
    const accessToken = await getAccessToken();

    // The location ID should be in format "locations/123456789" or just the number
    const locationPath = locationId.startsWith('locations/')
      ? locationId
      : `locations/${locationId}`;

    const url = `${GOOGLE_BUSINESS_API_BASE}/${locationPath}?readMask=regularHours,specialHours`;

    console.log('Google Business Profile: Fetching hours from API...');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Business API error: ${response.status} - ${errorText}`);
    }

    const data: GoogleLocationResponse = await response.json();

    const hours: OperatingHoursData = {
      regular: parseGoogleHours(data.regularHours),
      lastSynced: new Date().toISOString(),
      source: 'google_business_profile',
    };

    console.log('Google Business Profile: Hours fetched successfully');
    return hours;

  } catch (error) {
    console.error('Google Business Profile: Failed to fetch hours:', error);
    console.log('Google Business Profile: Using fallback hours');
    return DEFAULT_HOURS;
  }
}

/**
 * Check if Google Business Profile API is configured
 */
export function isGoogleBusinessConfigured(): boolean {
  return !!(
    process.env.GOOGLE_BUSINESS_CLIENT_ID &&
    process.env.GOOGLE_BUSINESS_CLIENT_SECRET &&
    process.env.GOOGLE_BUSINESS_REFRESH_TOKEN &&
    process.env.GOOGLE_BUSINESS_LOCATION_ID
  );
}
