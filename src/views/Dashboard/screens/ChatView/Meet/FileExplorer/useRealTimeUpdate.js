import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAppFileContent } from '../../../../../../slices/docsSlices';

export const useRealTimeUpdate = (filePath, content, onUpdate) => {
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  const lastContentRef = useRef('');

  const debouncedUpdate = useCallback((newContent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (newContent !== lastContentRef.current) {
      lastContentRef.current = newContent;
      
      dispatch(setAppFileContent({ path: filePath, content: newContent }));
      
      timeoutRef.current = setTimeout(() => {
        if (onUpdate) {
          onUpdate(newContent);
        }
      }, 1000); 
    }
  }, [filePath, dispatch, onUpdate]);

  useEffect(() => {
    if (content !== undefined && filePath) {
      debouncedUpdate(content);
    }
  }, [content, filePath]); 

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedUpdate;
}; 