// IP-based visitor tracking to minimize Square API calls
// Only pull fresh data for new IPs after 1-hour cooldown + store hours check

interface IPVisit {
  firstVisit: number;
  lastApiCall: number;
  visitCount: number;
}

class IPTracker {
  private visitors = new Map<string, IPVisit>();
  private readonly COOLDOWN_HOURS = 1;
  private readonly CLEANUP_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours

  constructor() {
    // Clean up old entries periodically
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  // Check if we should make a fresh API call for this IP
  shouldPullFreshData(clientIP: string): boolean {
    const now = Date.now();
    
    // Check if store is closed first - never pull when closed
    if (!this.isStoreOpen()) {
      console.log('Store is closed - no Square API calls needed');
      return false;
    }

    const visitor = this.visitors.get(clientIP);
    
    if (!visitor) {
      // New visitor - mark visit and pull fresh data
      this.visitors.set(clientIP, {
        firstVisit: now,
        lastApiCall: now,
        visitCount: 1
      });
      console.log(`New IP ${this.maskIP(clientIP)} - pulling fresh Square data`);
      return true;
    }

    // Existing visitor - check cooldown
    const hoursSinceLastCall = (now - visitor.lastApiCall) / (1000 * 60 * 60);
    
    if (hoursSinceLastCall >= this.COOLDOWN_HOURS) {
      // Cooldown expired - pull fresh data
      visitor.lastApiCall = now;
      visitor.visitCount++;
      console.log(`IP ${this.maskIP(clientIP)} cooldown expired (${hoursSinceLastCall.toFixed(1)}h) - pulling fresh data`);
      return true;
    }

    // Within cooldown - serve cached data
    visitor.visitCount++;
    console.log(`IP ${this.maskIP(clientIP)} within cooldown (${hoursSinceLastCall.toFixed(1)}h < 1h) - serving cached data`);
    return false;
  }

  // Check if restaurant is currently open (public for admin access)
  isStoreOpen(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour * 60 + minutes; // Convert to minutes since midnight

    // Store hours:
    // Jealous Fork (day menu): Tue-Sun 9AM-3PM
    // Jealous Burger (evening menu): Fri-Sat 3PM-9PM (pancakes still available!)
    // Closed Mondays

    // Monday (day 1) - Closed
    if (day === 1) {
      return false;
    }

    // Tuesday-Thursday, Sunday - Day menu only (9AM-3PM)
    if (day >= 2 && day <= 4 || day === 0) { // Tue-Thu, Sun
      const dayMenuStart = 9 * 60; // 9AM
      const dayMenuEnd = 15 * 60; // 3PM
      if (currentTime >= dayMenuStart && currentTime < dayMenuEnd) {
        return true;
      }
    }

    // Friday-Saturday - Full hours (9AM-9PM, burgers from 3PM)
    if (day === 5 || day === 6) { // Fri-Sat
      const openTime = 9 * 60; // 9AM
      const closeTime = 21 * 60; // 9PM
      if (currentTime >= openTime && currentTime < closeTime) {
        return true;
      }
    }

    return false;
  }

  // Get visitor statistics
  getStats(): { totalVisitors: number; activeVisitors: number; recentApiCalls: number } {
    const now = Date.now();
    const oneHourAgo = now - (this.COOLDOWN_HOURS * 60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    let activeVisitors = 0;
    let recentApiCalls = 0;

    for (const visitor of Array.from(this.visitors.values())) {
      if (visitor.firstVisit > oneDayAgo) {
        activeVisitors++;
      }
      if (visitor.lastApiCall > oneHourAgo) {
        recentApiCalls++;
      }
    }

    return {
      totalVisitors: this.visitors.size,
      activeVisitors,
      recentApiCalls
    };
  }

  // Clean up old visitor records (older than 7 days)
  private cleanup(): void {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    let cleaned = 0;

    for (const [ip, visitor] of Array.from(this.visitors.entries())) {
      if (visitor.firstVisit < sevenDaysAgo) {
        this.visitors.delete(ip);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} old visitor records`);
    }
  }

  // Mask IP for privacy in logs
  private maskIP(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.***`;
    }
    // For IPv6 or other formats, just show first few characters
    return ip.substring(0, 8) + '***';
  }
}

export const ipTracker = new IPTracker();