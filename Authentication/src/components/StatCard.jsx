import React from 'react';
import { FiClock } from "react-icons/fi";
import '../styles/StatCard.css'; // Import CSS for styling

const StatCard = ({
  icon,
  value,
  label,
  color,
  trend,
  trendValue,
  progress,
  streakBadge,
  onClick,
}) => {
  return (
    <div
      className={`stat-card ${onClick ? "clickable" : ""}`}
      style={{ "--card-accent": color }}
      onClick={onClick}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label">{label}</p>
      </div>
      {trend && (
        <div className={`stat-trend ${trend}`}>
          {trend === "up" ? "↑" : "↓"} {trendValue}
        </div>
      )}
      {progress !== undefined && (
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {streakBadge && (
        <div className="streak-badge">
          <FiClock /> Streak
        </div>
      )}
    </div>
  );
};

export default StatCard;