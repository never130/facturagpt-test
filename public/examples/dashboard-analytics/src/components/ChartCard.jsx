import React from 'react';

function ChartCard({ title, type, data, theme }) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <div className="chart-line">
            <svg width="100%" height="150" viewBox="0 0 300 150">
              <path
                d="M0,120 L50,100 L100,80 L150,60 L200,40 L250,20 L300,0"
                stroke={theme === 'dark' ? '#667eea' : '#3b82f6'}
                strokeWidth="3"
                fill="none"
              />
              <circle cx="50" cy="100" r="4" fill={theme === 'dark' ? '#667eea' : '#3b82f6'} />
              <circle cx="100" cy="80" r="4" fill={theme === 'dark' ? '#667eea' : '#3b82f6'} />
              <circle cx="150" cy="60" r="4" fill={theme === 'dark' ? '#667eea' : '#3b82f6'} />
              <circle cx="200" cy="40" r="4" fill={theme === 'dark' ? '#667eea' : '#3b82f6'} />
              <circle cx="250" cy="20" r="4" fill={theme === 'dark' ? '#667eea' : '#3b82f6'} />
              <circle cx="300" cy="0" r="4" fill={theme === 'dark' ? '#667eea' : '#3b82f6'} />
            </svg>
          </div>
        );
      
      case 'bar':
        return (
          <div className="chart-bars">
            <div className="bar" style={{ height: '60%', backgroundColor: theme === 'dark' ? '#667eea' : '#3b82f6' }}></div>
            <div className="bar" style={{ height: '80%', backgroundColor: theme === 'dark' ? '#10b981' : '#10b981' }}></div>
            <div className="bar" style={{ height: '40%', backgroundColor: theme === 'dark' ? '#f59e0b' : '#f59e0b' }}></div>
            <div className="bar" style={{ height: '90%', backgroundColor: theme === 'dark' ? '#ef4444' : '#ef4444' }}></div>
            <div className="bar" style={{ height: '70%', backgroundColor: theme === 'dark' ? '#8b5cf6' : '#8b5cf6' }}></div>
            <div className="bar" style={{ height: '50%', backgroundColor: theme === 'dark' ? '#06b6d4' : '#06b6d4' }}></div>
          </div>
        );
      
      case 'pie':
        return (
          <div className="chart-pie">
            <div className="pie-segment" style={{ 
              background: `conic-gradient(
                ${theme === 'dark' ? '#667eea' : '#3b82f6'} 0deg 120deg,
                ${theme === 'dark' ? '#10b981' : '#10b981'} 120deg 240deg,
                ${theme === 'dark' ? '#f59e0b' : '#f59e0b'} 240deg 360deg
              )`
            }}></div>
            <div className="pie-center"></div>
          </div>
        );
      
      case 'area':
        return (
          <div className="chart-area">
            <svg width="100%" height="150" viewBox="0 0 300 150">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={theme === 'dark' ? '#667eea' : '#3b82f6'} stopOpacity="0.8"/>
                  <stop offset="100%" stopColor={theme === 'dark' ? '#667eea' : '#3b82f6'} stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              <path
                d="M0,120 L50,100 L100,80 L150,60 L200,40 L250,20 L300,0 L300,150 L0,150 Z"
                fill="url(#areaGradient)"
              />
            </svg>
          </div>
        );
      
      case 'doughnut':
        return (
          <div className="chart-doughnut">
            <div className="doughnut-ring" style={{ 
              background: `conic-gradient(
                ${theme === 'dark' ? '#667eea' : '#3b82f6'} 0deg 90deg,
                ${theme === 'dark' ? '#10b981' : '#10b981'} 90deg 180deg,
                ${theme === 'dark' ? '#f59e0b' : '#f59e0b'} 180deg 270deg,
                ${theme === 'dark' ? '#ef4444' : '#ef4444'} 270deg 360deg
              )`
            }}></div>
            <div className="doughnut-center"></div>
          </div>
        );
      
      case 'heatmap':
        return (
          <div className="chart-heatmap">
            {Array.from({ length: 24 }, (_, i) => (
              <div 
                key={i} 
                className="heatmap-cell"
                style={{ 
                  backgroundColor: `hsl(${200 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`,
                  opacity: 0.3 + Math.random() * 0.7
                }}
              ></div>
            ))}
          </div>
        );
      
      default:
        return <div className="chart-placeholder">📊 Gráfico</div>;
    }
  };

  return (
    <div className={`chart-card ${theme}`}>
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-actions">
          <button className="chart-action-btn">⚙️</button>
          <button className="chart-action-btn">📊</button>
        </div>
      </div>
      
      <div className="chart-content">
        {renderChart()}
      </div>
      
      <div className="chart-footer">
        <div className="chart-legend">
          {type === 'pie' && (
            <>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: theme === 'dark' ? '#667eea' : '#3b82f6' }}></div>
                <span>Serie A</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: theme === 'dark' ? '#10b981' : '#10b981' }}></div>
                <span>Serie B</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: theme === 'dark' ? '#f59e0b' : '#f59e0b' }}></div>
                <span>Serie C</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChartCard; 