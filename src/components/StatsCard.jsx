// src/components/StatsCard.js
import './StatsCard.css';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  iconBgColor = "blue",
  iconColor = "blue"
}) {
  const changeColorClass = {
    positive: 'positive',
    negative: 'negative',
    neutral: 'neutral'
  }[changeType];

  return (
    <div className="stats-card">
      <div className="card-content">
        <div>
          <p className="card-title">{title}</p>
          <p className="card-value">{value}</p>
        </div>
        <div className={`icon-container ${iconBgColor}`}>
          <Icon className={`icon ${iconColor}`} />
        </div>
      </div>
      {change && (
        <div className="change">
          <span className={`change-text ${changeColorClass}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}