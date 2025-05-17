import React from 'react';

const StatCard = ({ icon, value, label, color, trend, trendValue, streakBadge }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`stat-trend ${trend}`}>
          {trendValue}
        </div>
      )}
      {streakBadge && (
        <div className="streak-badge">
          <FiClock size={14} /> Current streak
        </div>
      )}
      <style jsx>{`
        .stat-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }
        .stat-icon {
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-size: 2rem;
          margin: 0.5rem 0;
          font-weight: 700;
        }
        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
        }
        .stat-trend {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          border-radius: 2rem;
        }
        .stat-trend.up {
          background: #e3f9e5;
          color: #2ecc71;
        }
        .stat-trend.down {
          background: #fdecea;
          color: #e74c3c;
        }
        .streak-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.5rem;
          font-size: 0.7rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 2rem;
        }
      `}</style>
    </div>
  );
};

export default StatCard;