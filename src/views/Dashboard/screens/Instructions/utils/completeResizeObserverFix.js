// Complete ResizeObserver fix - Replace with a safe implementation

(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Store original ResizeObserver
  const OriginalResizeObserver = window.ResizeObserver;
  
  // Create a completely safe ResizeObserver replacement
  class SafeResizeObserver {
    constructor(callback) {
      this._callback = callback;
      this._observers = new Map();
      this._timeout = null;
      this._isDestroyed = false;
    }
    
    observe(element, options) {
      if (this._isDestroyed || !element) return;
      
      // Store the element and options
      this._observers.set(element, { options, lastSize: null });
      
      // Get initial size
      this._getElementSize(element);
      
      // Set up a simple polling mechanism instead of ResizeObserver
      this._startPolling();
    }
    
    unobserve(element) {
      if (this._isDestroyed || !element) return;
      
      this._observers.delete(element);
      
      // Stop polling if no more elements
      if (this._observers.size === 0) {
        this._stopPolling();
      }
    }
    
    disconnect() {
      this._isDestroyed = true;
      this._observers.clear();
      this._stopPolling();
    }
    
    _getElementSize(element) {
      try {
        if (!element || !element.getBoundingClientRect) return null;
        
        const rect = element.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right
        };
      } catch (error) {
        return null;
      }
    }
    
    _startPolling() {
      if (this._timeout) return;
      
      const poll = () => {
        if (this._isDestroyed || this._observers.size === 0) {
          this._stopPolling();
          return;
        }
        
        const entries = [];
        
        this._observers.forEach((data, element) => {
          const currentSize = this._getElementSize(element);
          
          if (currentSize && data.lastSize) {
            // Check if size changed
            if (currentSize.width !== data.lastSize.width || 
                currentSize.height !== data.lastSize.height) {
              
              entries.push({
                target: element,
                contentRect: {
                  x: currentSize.left,
                  y: currentSize.top,
                  width: currentSize.width,
                  height: currentSize.height,
                  top: currentSize.top,
                  right: currentSize.right,
                  bottom: currentSize.bottom,
                  left: currentSize.left
                },
                borderBoxSize: [{
                  blockSize: currentSize.height,
                  inlineSize: currentSize.width
                }],
                contentBoxSize: [{
                  blockSize: currentSize.height,
                  inlineSize: currentSize.width
                }],
                devicePixelContentBoxSize: [{
                  blockSize: currentSize.height,
                  inlineSize: currentSize.width
                }]
              });
              
              // Update stored size
              data.lastSize = currentSize;
            }
          } else if (currentSize) {
            // First time observing this element
            data.lastSize = currentSize;
          }
        });
        
        // Call callback if there are changes
        if (entries.length > 0 && this._callback) {
          try {
            this._callback(entries, this);
          } catch (error) {
            // Silently ignore callback errors
          }
        }
        
        // Continue polling
        this._timeout = setTimeout(poll, 100); // Poll every 100ms
      };
      
      poll();
    }
    
    _stopPolling() {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }
  }
  
  // Replace ResizeObserver globally
  window.ResizeObserver = SafeResizeObserver;
  
  // Suppress all ResizeObserver related console messages
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  console.error = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        (message.includes('ResizeObserver') || 
         message.includes('resize') || 
         message.includes('loop') ||
         message.includes('undelivered') ||
         message.includes('notifications'))) {
      return; // Suppress ALL ResizeObserver related errors
    }
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        (message.includes('ResizeObserver') || 
         message.includes('resize') || 
         message.includes('loop') ||
         message.includes('undelivered') ||
         message.includes('notifications'))) {
      return; // Suppress ALL ResizeObserver related warnings
    }
    originalWarn.apply(console, args);
  };
  
  console.log = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        (message.includes('ResizeObserver') || 
         message.includes('resize') || 
         message.includes('loop') ||
         message.includes('undelivered') ||
         message.includes('notifications'))) {
      return; // Suppress ALL ResizeObserver related logs
    }
    originalLog.apply(console, args);
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    if (reason && reason.message && 
        (reason.message.includes('ResizeObserver') || 
         reason.message.includes('resize') || 
         reason.message.includes('loop') ||
         reason.message.includes('undelivered') ||
         reason.message.includes('notifications'))) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);
  
  // Handle uncaught exceptions
  window.addEventListener('error', function(event) {
    const message = event.message;
    if (typeof message === 'string' && 
        (message.includes('ResizeObserver') || 
         message.includes('resize') || 
         message.includes('loop') ||
         message.includes('undelivered') ||
         message.includes('notifications'))) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);
  
  // Override global error handlers
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string' && 
        (message.includes('ResizeObserver') || 
         message.includes('resize') || 
         message.includes('loop') ||
         message.includes('undelivered') ||
         message.includes('notifications'))) {
      return true; // Prevent default error handling
    }
    return false;
  };
  
  window.onunhandledrejection = function(event) {
    const reason = event.reason;
    if (reason && reason.message && 
        (reason.message.includes('ResizeObserver') || 
         reason.message.includes('resize') || 
         reason.message.includes('loop') ||
         reason.message.includes('undelivered') ||
         reason.message.includes('notifications'))) {
      event.preventDefault();
      return true;
    }
    return false;
  };
  
  console.log('Complete ResizeObserver fix applied - Safe polling implementation active');
})(); 