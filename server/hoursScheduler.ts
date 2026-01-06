// Hours Scheduler - Syncs operating hours from Google Business Profile
// Runs daily at 6 AM to fetch latest hours

import { scheduleJob } from 'node-schedule';

let isSchedulerInitialized = false;

export function initializeHoursSync() {
  if (isSchedulerInitialized) {
    console.log('Hours scheduler already initialized');
    return;
  }

  console.log('Initializing Google Business Profile hours sync (6 AM daily)');

  // Schedule sync at 6:00 AM daily
  scheduleJob('0 6 * * *', async () => {
    console.log('Running scheduled Google Business Profile hours sync at 6:00 AM');
    await performHoursSync('scheduled');
  });

  // Also sync on server startup (with delay to let other services initialize)
  setTimeout(async () => {
    console.log('Running initial hours sync on server startup...');
    await performHoursSync('startup');
  }, 5000);

  isSchedulerInitialized = true;
  console.log('Hours scheduler initialized - syncs at 6 AM daily');
}

async function performHoursSync(trigger: 'scheduled' | 'startup' | 'manual') {
  try {
    console.log(`[hours-sync:${trigger}] Starting Google Business Profile sync...`);

    // Import dependencies dynamically to avoid circular deps
    const { fetchGoogleBusinessHours, isGoogleBusinessConfigured } = await import('./googleBusinessService');
    const { serverCache, CACHE_KEYS } = await import('./cache');
    const { DEFAULT_HOURS } = await import('../shared/defaultHours');

    // Check if Google Business Profile is configured
    if (!isGoogleBusinessConfigured()) {
      console.log(`[hours-sync:${trigger}] Google Business Profile not configured, using default hours`);
      // Cache default hours for 24 hours
      serverCache.set(CACHE_KEYS.OPERATING_HOURS, DEFAULT_HOURS, 24 * 60);
      return {
        success: true,
        source: 'fallback',
        message: 'Using default hours (Google Business Profile not configured)'
      };
    }

    // Fetch hours from Google Business Profile
    const hours = await fetchGoogleBusinessHours();

    // Cache for 24 hours (until next sync)
    serverCache.set(CACHE_KEYS.OPERATING_HOURS, hours, 24 * 60);

    console.log(`[hours-sync:${trigger}] Hours synced successfully from ${hours.source}`);

    return {
      success: true,
      source: hours.source,
      lastSynced: hours.lastSynced,
      message: 'Hours synced successfully'
    };

  } catch (error: any) {
    console.error(`[hours-sync:${trigger}] Failed to sync hours:`, error);

    // On error, cache default hours so the site still works
    try {
      const { serverCache, CACHE_KEYS } = await import('./cache');
      const { DEFAULT_HOURS } = await import('../shared/defaultHours');
      serverCache.set(CACHE_KEYS.OPERATING_HOURS, DEFAULT_HOURS, 24 * 60);
    } catch (cacheError) {
      console.error(`[hours-sync:${trigger}] Failed to cache fallback hours:`, cacheError);
    }

    return {
      success: false,
      source: 'fallback',
      error: error.message,
      message: 'Sync failed, using fallback hours'
    };
  }
}

/**
 * Manually trigger hours sync (for admin panel)
 */
export async function triggerHoursSync() {
  console.log('Manual hours sync triggered');
  return await performHoursSync('manual');
}
