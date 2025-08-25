// Square API Scheduled Sync - Cost Optimization
// Only syncs at 9am and 12pm to reduce API costs

import { scheduleJob } from 'node-schedule';

let isSchedulerInitialized = false;

export function initializeScheduledSync() {
  if (isSchedulerInitialized) {
    console.log('Square scheduler already initialized');
    return;
  }

  console.log('Initializing Square API scheduled sync (9am, 12pm only)');

  // Schedule sync at 9:00 AM daily
  scheduleJob('0 9 * * *', async () => {
    console.log('Running scheduled Square API sync at 9:00 AM');
    await performScheduledSync('morning');
  });

  // Schedule sync at 12:00 PM daily  
  scheduleJob('0 12 * * *', async () => {
    console.log('Running scheduled Square API sync at 12:00 PM');
    await performScheduledSync('midday');
  });

  isSchedulerInitialized = true;
  console.log('Square API scheduler initialized - syncs at 9am and 12pm only');
}

async function performScheduledSync(timeSlot: 'morning' | 'midday') {
  try {
    console.log(`[${timeSlot}] Starting scheduled Square sync...`);
    
    // Import sync functions dynamically to avoid circular deps
    const { syncMenuWithSquare } = await import('./squareMenuSync');
    
    const result = await syncMenuWithSquare();
    console.log(`[${timeSlot}] Square sync completed:`, result);
    
    return result;
  } catch (error) {
    console.error(`[${timeSlot}] Scheduled Square sync failed:`, error);
    return { success: false, error: error.message };
  }
}

export async function triggerManualSync() {
  console.log('Manual Square API sync triggered');
  return await performScheduledSync('manual');
}