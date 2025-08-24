// Comprehensive script to suppress ResizeObserver errors without breaking functionality

// Execute immediately when this file is imported
(function() {
  'use strict';
  
  // Store original methods
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  // Create a more robust error suppression
  const shouldSuppress = (message) => {
    if (typeof message !== 'string') return false;
    
    const suppressPatterns = [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop',
      'ResizeObserver: loop'
    ];
    
    return suppressPatterns.some(pattern => message.includes(pattern));
  };
  
  // Override console.error
  console.error = function(...args) {
    if (shouldSuppress(args[0])) {
      return; // Suppress ResizeObserver errors
    }
    originalError.apply(console, args);
  };
  
  // Override console.warn
  console.warn = function(...args) {
    if (shouldSuppress(args[0])) {
      return; // Suppress ResizeObserver warnings
    }
    originalWarn.apply(console, args);
  };
  
  // Override console.log (sometimes ResizeObserver errors appear as logs)
  console.log = function(...args) {
    if (shouldSuppress(args[0])) {
      return; // Suppress ResizeObserver logs
    }
    originalLog.apply(console, args);
  };
  
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    const originalOnError = window.onerror;
    const originalOnUnhandledRejection = window.onunhandledrejection;
    
    window.onerror = function(message, source, lineno, colno, error) {
      if (shouldSuppress(message)) {
        return true; // Prevent default error handling
      }
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };
    
    window.onunhandledrejection = function(event) {
      const reason = event.reason;
      if (reason && reason.message && shouldSuppress(reason.message)) {
        event.preventDefault();
        return true;
      }
      if (originalOnUnhandledRejection) {
        return originalOnUnhandledRejection(event);
      }
      return false;
    };
    
    // Add event listeners for additional error catching
    window.addEventListener('error', function(event) {
      if (shouldSuppress(event.message)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }, true);
    
    window.addEventListener('unhandledrejection', function(event) {
      const reason = event.reason;
      if (reason && reason.message && shouldSuppress(reason.message)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }, true);
  }
})();

 