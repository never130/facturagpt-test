import React from 'react';

function MetricCard({ title, value, change, changeType, icon, theme }) {
  return (
    <div className={`metric-card ${theme}`}>
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <div className="metric-change">
          <span className={`change-indicator ${changeType}`}>
            {changeType === 'positive' ? '↗️' : '↘️'} {change}
          </span>
        </div>
      </div>
      
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <div className="metric-value">{value}</div>
      </div>
      
      <div className="metric-footer">
        <div className="metric-trend">
          <div className={`trend-line ${changeType}`}></div>
        </div>
      </div>
    </div>
  );
}

export default MetricCard; 