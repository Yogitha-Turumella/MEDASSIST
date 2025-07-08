// Keep Supabase warm to prevent cold starts
import { supabase } from './supabase';

class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 4 * 60 * 1000; // 4 minutes

  start() {
    if (this.intervalId) return;

    // Initial ping
    this.ping();

    // Set up periodic pings
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL);

    console.log('KeepAlive service started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('KeepAlive service stopped');
    }
  }

  private async ping() {
    try {
      // Simple query to keep connection alive
      await supabase
        .from('doctors')
        .select('id')
        .limit(1);
      
      console.log('KeepAlive ping successful');
    } catch (error) {
      console.warn('KeepAlive ping failed:', error);
    }
  }
}

export const keepAliveService = new KeepAliveService();

// Auto-start when module loads
if (typeof window !== 'undefined') {
  keepAliveService.start();
  
  // Stop on page unload
  window.addEventListener('beforeunload', () => {
    keepAliveService.stop();
  });
}