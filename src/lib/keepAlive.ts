// Keep Supabase warm to prevent cold starts
import { supabase } from './supabase';
import { isServiceConfigured } from './config';

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
      // Skip ping if Supabase is not properly configured
      if (!isServiceConfigured('supabase')) {
        console.log('KeepAlive ping skipped - Supabase not configured');
        return;
      }

      // Simple query to keep connection alive with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        await Promise.race([
          supabase.from('doctors').select('id').limit(1),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Ping timeout')), 5000)
          )
        ]);
        clearTimeout(timeoutId);
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
      
      console.log('KeepAlive ping successful');
    } catch (error) {
      console.warn('KeepAlive ping failed (this is normal if Supabase is not configured):', error.message);
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