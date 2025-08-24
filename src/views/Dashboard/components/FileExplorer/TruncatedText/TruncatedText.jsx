import React, { useRef, useEffect, useState } from 'react';
import styles from './TruncatedText.module.css'; 

const TruncatedText = ({ text }) => {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [truncatedText, setTruncatedText] = useState(text);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;

    if (!container || !measure) return;

    let animationFrameId = null;

    const truncateToFit = () => {
      if (!container || !measure) return;

      measure.textContent = text;
      if (measure.scrollWidth <= container.clientWidth) {
        setTruncatedText(text);
        return;
      }

      for (let i = text.length; i > 0; i--) {
        const attempt = text.slice(0, i) + '..';
        measure.textContent = attempt;

        if (measure.scrollWidth <= container.clientWidth) {
          setTruncatedText(attempt);
          return;
        }
      }

      setTruncatedText('..');
    };

    const observer = new ResizeObserver(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(truncateToFit);
    });

    observer.observe(container);
    truncateToFit();

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return (
    <>
      <div ref={containerRef} className={styles.visibleText}>
        {truncatedText}
      </div>
      <div ref={measureRef} className={styles.measureText} />
    </>
  );
};

export default TruncatedText;

