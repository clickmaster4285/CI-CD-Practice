// lib/monitoring.js
class ProductionMonitor {
   constructor() {
      this.errors = [];
      this.startTime = Date.now();
   }

   init() {
      if (typeof window === 'undefined') return;

      // Catch unhandled errors
      window.addEventListener('error', (event) => {
         this.logError('uncaught-error', {
            message: event.error?.message,
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno
         });
      });

      // Catch unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
         this.logError('unhandled-rejection', {
            reason: event.reason?.toString(),
            stack: event.reason?.stack
         });
      });

      // Monitor memory usage
      this.startMemoryMonitoring();

      // Monitor page responsiveness
      this.startResponsivenessMonitoring();
   }

   logError(type, details) {
      const error = {
         type,
         timestamp: new Date().toISOString(),
         url: window.location.href,
         userAgent: navigator.userAgent,
         ...details
      };

      this.errors.push(error);

      // Send to your backend
      this.sendToServer(error);

      // Store in localStorage for debugging
      this.storeLocally(error);
   }

   startMemoryMonitoring() {
      if (!performance.memory) return;

      setInterval(() => {
         const memory = performance.memory;
         if (memory.usedJSHeapSize > 500 * 1024 * 1024) { // 500MB threshold
            this.logError('memory-warning', {
               usedHeap: memory.usedJSHeapSize,
               totalHeap: memory.totalJSHeapSize,
               heapLimit: memory.jsHeapSizeLimit
            });
         }
      }, 30000); // Check every 30 seconds
   }

   startResponsivenessMonitoring() {
      let lastClickTime = Date.now();

      document.addEventListener('click', () => {
         const now = Date.now();
         const timeSinceLastClick = now - lastClickTime;

         // If clicks are too fast, might indicate infinite loop
         if (timeSinceLastClick < 50) {
            this.logError('rapid-clicks', {
               interval: timeSinceLastClick,
               timestamp: now
            });
         }

         lastClickTime = now;
      });
   }

   async sendToServer(error) {
      try {
         await fetch('/api/monitoring', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
         });
      } catch (e) {
         // Fail silently - don't crash the app
         console.error('Failed to send monitoring data', e);
      }
   }

   storeLocally(error) {
      try {
         const stored = localStorage.getItem('production-errors');
         const errors = stored ? JSON.parse(stored) : [];
         errors.push(error);

         // Keep only last 50 errors
         if (errors.length > 50) errors.shift();

         localStorage.setItem('production-errors', JSON.stringify(errors));
      } catch (e) {
         // localStorage might be full
      }
   }
}

export const monitor = new ProductionMonitor();