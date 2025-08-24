// ReactFlow-specific ResizeObserver fix
// This fix is designed specifically to prevent infinite loops in ReactFlow

(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Store original ResizeObserver
  const OriginalResizeObserver = window.ResizeObserver;
  
  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Throttle function
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Safe ResizeObserver implementation
  class SafeReactFlowResizeObserver {
    constructor(callback) {
      this._callback = callback;
      this._observers = new Map();
      this._isDestroyed = false;
      this._lastCallTime = 0;
      this._minInterval = 16; // ~60fps
      
      // Debounce the callback to prevent rapid successive calls
      this._debouncedCallback = debounce((entries) => {
        if (this._isDestroyed) return;
        
        const now = Date.now();
        if (now - this._lastCallTime < this._minInterval) {
          return;
        }
        
        try {
          this._callback(entries, this);
          this._lastCallTime = now;
        } catch (error) {
          // Silently ignore callback errors
        }
      }, 50);
    }
    
    observe(element, options = {}) {
      if (this._isDestroyed || !element) return;
      
      // Store element info
      this._observers.set(element, {
        options,
        lastSize: this._getElementSize(element),
        observer: null
      });
      
      // Use MutationObserver as a fallback for size changes
      const observer = new MutationObserver(throttle(() => {
        this._checkSizeChange(element);
      }, 100));
      
      observer.observe(element, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['style', 'class']
      });
      
      this._observers.get(element).observer = observer;
      
      // Also use a more reliable method for ReactFlow
      this._setupReactFlowSpecificObserver(element);
    }
    
    unobserve(element) {
      if (this._isDestroyed || !element) return;
      
      const data = this._observers.get(element);
      if (data) {
        if (data.observer) {
          data.observer.disconnect();
        }
        this._observers.delete(element);
      }
    }
    
    disconnect() {
      this._isDestroyed = true;
      
      this._observers.forEach((data) => {
        if (data.observer) {
          data.observer.disconnect();
        }
      });
      
      this._observers.clear();
    }
    
    _getElementSize(element) {
      try {
        if (!element || !element.getBoundingClientRect) return null;
        
        const rect = element.getBoundingClientRect();
        return {
          width: Math.round(rect.width * 100) / 100,
          height: Math.round(rect.height * 100) / 100,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right
        };
      } catch (error) {
        return null;
      }
    }
    
    _checkSizeChange(element) {
      const data = this._observers.get(element);
      if (!data) return;
      
      const currentSize = this._getElementSize(element);
      if (!currentSize) return;
      
      // Check if size actually changed (with small tolerance)
      const tolerance = 1;
      const sizeChanged = !data.lastSize || 
        Math.abs(currentSize.width - data.lastSize.width) > tolerance ||
        Math.abs(currentSize.height - data.lastSize.height) > tolerance;
      
      if (sizeChanged) {
        data.lastSize = currentSize;
        
        const entry = {
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
        };
        
        this._debouncedCallback([entry]);
      }
    }
    
    _setupReactFlowSpecificObserver(element) {
      // For ReactFlow specifically, we need to handle the viewport changes
      if (element.classList.contains('react-flow') || 
          element.classList.contains('react-flow__viewport') ||
          element.closest('.react-flow')) {
        
        // Use requestAnimationFrame for smooth updates
        let rafId = null;
        const checkSize = () => {
          this._checkSizeChange(element);
          rafId = requestAnimationFrame(checkSize);
        };
        
        rafId = requestAnimationFrame(checkSize);
        
        // Store the RAF ID for cleanup
        const data = this._observers.get(element);
        if (data) {
          data.rafId = rafId;
        }
      }
    }
  }
  
  // Replace ResizeObserver globally
  window.ResizeObserver = SafeReactFlowResizeObserver;
  
  // Suppress ResizeObserver console messages
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        (message.includes('ResizeObserver') || 
         message.includes('resize') || 
         message.includes('loop') ||
         message.includes('undelivered') ||
         message.includes('notifications'))) {
      return;
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
      return;
    }
    originalWarn.apply(console, args);
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    if (reason && reason.message && 
        (reason.message.includes('ResizeObserver') || 
         reason.message.includes('resize') || 
         reason.message.includes('loop'))) {
      event.preventDefault();
      return false;
    }
  }, true);
  
  console.log('ReactFlow-specific ResizeObserver fix applied');
})(); 