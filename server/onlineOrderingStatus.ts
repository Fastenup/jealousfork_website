import { serverCache } from './cache';

export interface OnlineOrderingStatus {
  acceptingOrders: boolean;
  reason?: string;
  source: 'manual_override' | 'pause_until' | 'square_online_site' | 'square_online_page' | 'square_location' | 'default' | 'error';
  checkedAt: string;
  pausedUntil?: string;
}

const CACHE_KEY = 'online_ordering_status';
const MOTHERS_DAY_2026_CLOSURE_MESSAGE = 'Online ordering is closed today for Mother’s Day so our team can focus on serving all guests in the restaurant. Please call us if you need help.';
const DEFAULT_CLOSURE_MESSAGE = 'Online ordering is temporarily paused. Please call the restaurant for help.';
const DISABLED_TEXT_PATTERNS = [
  /online\s+ordering\s+(is\s+)?(temporarily\s+)?(unavailable|disabled|paused|closed)/i,
  /(temporarily\s+)?not\s+accepting\s+(online\s+)?orders/i,
  /currently\s+not\s+accepting\s+orders/i,
  /ordering\s+(is\s+)?unavailable/i,
  /store\s+(is\s+)?closed/i,
  /accepting\s+orders\s+again/i,
];

function isTruthy(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on', 'disabled', 'paused', 'closed'].includes((value || '').trim().toLowerCase());
}

function enabledStatus(source: OnlineOrderingStatus['source'] = 'default'): OnlineOrderingStatus {
  return {
    acceptingOrders: true,
    source,
    checkedAt: new Date().toISOString(),
  };
}

function disabledStatus(source: OnlineOrderingStatus['source'], reason: string, pausedUntil?: string): OnlineOrderingStatus {
  return {
    acceptingOrders: false,
    reason,
    source,
    checkedAt: new Date().toISOString(),
    ...(pausedUntil ? { pausedUntil } : {}),
  };
}

function currentMiamiDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function customerClosureReason(): string {
  if (process.env.ONLINE_ORDERING_DISABLED_REASON) {
    return process.env.ONLINE_ORDERING_DISABLED_REASON;
  }

  return currentMiamiDate() === '2026-05-10'
    ? MOTHERS_DAY_2026_CLOSURE_MESSAGE
    : DEFAULT_CLOSURE_MESSAGE;
}

function squareBaseUrl(accessToken?: string): string {
  return accessToken?.startsWith('sandbox')
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';
}

async function fetchSquareJson(path: string): Promise<any> {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Square access token not configured');
  }

  const response = await fetch(`${squareBaseUrl(accessToken)}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Square-Version': '2024-06-04',
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();
  let data: any = {};
  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text.slice(0, 500) };
    }
  }

  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.detail || data?.message || `Square API ${response.status}`);
  }

  return data;
}

async function getSquareOnlineSiteUrls(): Promise<string[]> {
  const configured = (process.env.SQUARE_ONLINE_STATUS_URL || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  try {
    const data = await fetchSquareJson('/v2/sites');
    const domains = (data.sites || [])
      .filter((site: any) => site?.domain)
      .filter((site: any) => {
        const wantedDomain = process.env.SQUARE_ONLINE_SITE_DOMAIN?.trim().toLowerCase();
        if (!wantedDomain) return true;
        return String(site.domain).toLowerCase().includes(wantedDomain);
      })
      .map((site: any) => ({ domain: String(site.domain), isPublished: site.is_published ?? site.isPublished }));

    const unpublished = domains.find((site: any) => site.isPublished === false);
    if (unpublished) {
      throw disabledStatus('square_online_site', customerClosureReason());
    }

    const fromSites = domains.map((site: any) => `https://${site.domain}`);
    return Array.from(new Set([...configured, ...fromSites]));
  } catch (error: any) {
    if (error?.acceptingOrders === false) {
      throw error;
    }
    return configured;
  }
}

async function checkSquareOnlinePage(): Promise<OnlineOrderingStatus | null> {
  const urls = await getSquareOnlineSiteUrls();
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'JealousForkOrderingStatus/1.0' },
        redirect: 'follow',
      });
      const html = await response.text();
      const normalized = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
      const matched = DISABLED_TEXT_PATTERNS.find((pattern) => pattern.test(normalized));
      if (matched) {
        return disabledStatus('square_online_page', customerClosureReason());
      }
    } catch (error) {
      console.warn('Square Online status page check failed:', url, error);
    }
  }
  return null;
}

async function checkSquareLocation(): Promise<OnlineOrderingStatus | null> {
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!locationId || !process.env.SQUARE_ACCESS_TOKEN) return null;

  const data = await fetchSquareJson(`/v2/locations/${encodeURIComponent(locationId)}`);
  const location = data.location;
  const status = location?.status;
  if (status && status !== 'ACTIVE') {
    return disabledStatus('square_location', `Square location status is ${status}`);
  }
  return null;
}

export async function getOnlineOrderingStatus(options: { forceRefresh?: boolean } = {}): Promise<OnlineOrderingStatus> {
  if (!options.forceRefresh) {
    const cached = serverCache.get<OnlineOrderingStatus>(CACHE_KEY);
    if (cached) return cached;
  }

  let status: OnlineOrderingStatus;

  if (isTruthy(process.env.ONLINE_ORDERING_DISABLED) || isTruthy(process.env.SQUARE_ONLINE_ORDERING_DISABLED)) {
    status = disabledStatus('manual_override', customerClosureReason());
  } else if (process.env.ONLINE_ORDERING_PAUSED_UNTIL) {
    const pausedUntil = new Date(process.env.ONLINE_ORDERING_PAUSED_UNTIL);
    if (!Number.isNaN(pausedUntil.valueOf()) && pausedUntil > new Date()) {
      status = disabledStatus('pause_until', customerClosureReason(), pausedUntil.toISOString());
    } else {
      status = enabledStatus('default');
    }
  } else {
    try {
      status =
        (await checkSquareOnlinePage()) ||
        (await checkSquareLocation()) ||
        enabledStatus('default');
    } catch (error: any) {
      if (error?.acceptingOrders === false) {
        status = error as OnlineOrderingStatus;
      } else if (isTruthy(process.env.ONLINE_ORDERING_FAIL_CLOSED)) {
        status = disabledStatus('error', 'Unable to confirm Square online ordering status. Ordering is paused as a safety precaution.');
      } else {
        console.warn('Online ordering status check failed open:', error);
        status = enabledStatus('error');
      }
    }
  }

  serverCache.set(CACHE_KEY, status, 0.5);
  return status;
}

export async function assertOnlineOrderingOpen(): Promise<OnlineOrderingStatus> {
  const status = await getOnlineOrderingStatus({ forceRefresh: true });
  if (!status.acceptingOrders) {
    const error: any = new Error(status.reason || 'Online ordering is temporarily paused.');
    error.statusCode = 503;
    error.onlineOrderingStatus = status;
    throw error;
  }
  return status;
}
