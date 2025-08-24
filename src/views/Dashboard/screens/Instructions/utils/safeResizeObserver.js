// Safe ResizeObserver implementation that completely avoids the loop error

class SafeResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observers = new Map();
    this.timeoutId = null;
    this.lastCall = 0;
    this.isProcessing = false;
    
    // Debounce and throttle settings
    this.debounceDelay = 100;
    this.throttleDelay = 200;
  }

  observe(element, options = {}) {
    if (!element || this.observers.has(element)) {
      return;
    }

    // Create a safe observer that won't cause loops
    const safeObserver = {
      element,
      options,
      rect: element.getBoundingClientRect(),
      lastWidth: element.offsetWidth,
      lastHeight: element.offsetHeight
    };

    this.observers.set(element, safeObserver);

    // Use simple polling instead of complex observers
    this.startPolling(element);
  }

  unobserve(element) {
    const observer = this.observers.get(element);
    if (!observer) {
      return;
    }

    // Stop polling
    if (observer.pollId) {
      clearInterval(observer.pollId);
      observer.pollId = null;
    }

    this.observers.delete(element);
  }

  disconnect() {
    // Stop all polling
    for (const [element, observer] of this.observers) {
      this.unobserve(element);
    }
    this.observers.clear();

    // Clear any pending timeouts
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  scheduleCallback() {
    if (this.isProcessing) {
      return;
    }

    const now = Date.now();
    if (now - this.lastCall < this.throttleDelay) {
      return;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.processCallbacks();
    }, this.debounceDelay);
  }

  processCallbacks() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.lastCall = Date.now();

    try {
      const entries = [];
      
      for (const [element, observer] of this.observers) {
        if (element && element.isConnected) {
          const rect = element.getBoundingClientRect();
          const currentWidth = element.offsetWidth;
          const currentHeight = element.offsetHeight;

          // Only trigger if size actually changed
          if (currentWidth !== observer.lastWidth || currentHeight !== observer.lastHeight) {
            observer.lastWidth = currentWidth;
            observer.lastHeight = currentHeight;
            observer.rect = rect;

            entries.push({
              target: element,
              contentRect: rect,
              borderBoxSize: [{ inlineSize: currentWidth, blockSize: currentHeight }],
              contentBoxSize: [{ inlineSize: currentWidth, blockSize: currentHeight }],
              devicePixelContentBoxSize: [{ inlineSize: currentWidth, blockSize: currentHeight }]
            });
          }
        }
      }

      if (entries.length > 0 && this.callback) {
        // Use requestAnimationFrame to prevent loops
        requestAnimationFrame(() => {
          try {
            this.callback(entries, this);
          } catch (error) {
            // Silently handle callback errors
            if (!error.message.includes('ResizeObserver')) {
              console.warn('SafeResizeObserver callback error:', error);
            }
          }
        });
      }
    } catch (error) {
      // Silently handle processing errors
      if (!error.message.includes('ResizeObserver')) {
        console.warn('SafeResizeObserver processing error:', error);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Simple polling mechanism
  startPolling(element) {
    const pollInterval = 2000; // Poll every 2 seconds
    const pollId = setInterval(() => {
      if (element && element.isConnected) {
        this.scheduleCallback();
      } else {
        clearInterval(pollId);
      }
    }, pollInterval);

    // Store poll ID for cleanup
    const observer = this.observers.get(element);
    if (observer) {
      observer.pollId = pollId;
    }
  }
}

// Replace the global ResizeObserver with our safe version
export const installSafeResizeObserver = () => {
  if (typeof window !== 'undefined') {
    // Store original if it exists
    if (window.ResizeObserver) {
      window.OriginalResizeObserver = window.ResizeObserver;
    }
    
    // Replace with safe version
    window.ResizeObserver = SafeResizeObserver;
    
    return () => {
      // Restore original if it existed
      if (window.OriginalResizeObserver) {
        window.ResizeObserver = window.OriginalResizeObserver;
        delete window.OriginalResizeObserver;
      }
    };
  }
  
  return () => {};
};

// Export the safe observer class
export { SafeResizeObserver }; 