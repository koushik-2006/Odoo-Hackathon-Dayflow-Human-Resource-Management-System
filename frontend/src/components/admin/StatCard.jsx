import React from 'react';

export default function StatCard({ title, value, icon: Icon, description, trend, trendType }) {
  // trendType: 'up' (green), 'down' (red), 'info' (blue/yellow)
  const getTrendClass = () => {
    if (trendType === 'up') return 'trend-up';
    if (trendType === 'down') return 'trend-down';
    return 'trend-info';
  };

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <span className="stat-card-value">{value}</span>
        </div>
        <div className="stat-card-icon-container">
          <Icon size={24} className="stat-icon" />
        </div>
      </div>
      <div className="stat-card-footer">
        {trend && <span className={`stat-trend ${getTrendClass()}`}>{trend}</span>}
        <span className="stat-description">{description}</span>
      </div>
    </div>
  );
}
