import React, { useState, useEffect } from 'react';
import styles from './DonutTimer.module.css';

const DonutTimer = ({ 
  size = 120, 
  strokeWidth = 8, 
  color = '#16c098', 
  backgroundColor = '#f0f0f0', 
  showSeconds = true, 
  autoStart = true, 
  isPaused = false, 
  endTime = 45 
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const [isLoading, setIsLoading] = useState(false);
  const [previousEndTime, setPreviousEndTime] = useState(endTime);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = (timeElapsed / endTime) * circumference;
  const strokeDashoffset = circumference - progress;

  const isCompleted = timeElapsed >= endTime;

  useEffect(() => {
    if (endTime !== previousEndTime) {
      if (endTime < previousEndTime && previousEndTime > 0) {
        const ratio = endTime / previousEndTime;
        setTimeElapsed(prev => Math.min(prev * ratio, endTime));
      }
      else if (endTime > previousEndTime) {
        setTimeElapsed(prev => Math.min(prev, endTime));
      }
      setPreviousEndTime(endTime);
    }
  }, [endTime, previousEndTime]);

  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      setIsLoading(true);
      interval = setInterval(() => {
        setTimeElapsed(timeElapsed => {
          const newTime = timeElapsed + 0.1; 
          if (newTime >= endTime) {
            return endTime + 0.2;
          }
          return newTime;
        });
      }, 100); 
    } else {
      setIsLoading(false);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, endTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
    className={`${styles.donutContainer} ${isCompleted ? styles.endTime : ''}`} 
    style={{ width: size, height: size }}>
      <svg
        className={styles.donutSvg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
          className={styles.backgroundCircle}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={`${styles.progressCircle} ${isLoading ? styles.loading : ''}`}
          style={{
            transition: 'stroke-dashoffset 0.3s ease-in-out'
          }}
        />
      </svg>

      {showSeconds && (
        <div className={styles.timerText}>
          <span className={styles.seconds}>{timeElapsed.toFixed(1)}</span>
          <span className={styles.unit}>s</span>
        </div>
      )}
    </div>
  );
};

export default DonutTimer;