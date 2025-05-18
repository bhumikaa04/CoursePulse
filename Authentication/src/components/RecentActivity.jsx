import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiClock, FiBookOpen } from 'react-icons/fi';
import '../styles/RecentActivity.css'; // Assuming you have a CSS file for styling

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch recent activities
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with an actual API call
        // await fetch('/api/activities')...
        
        // Simulated data
        const mockActivities = [
          {
            id: 1,
            type: 'course_progress',
            title: 'Advanced React Patterns',
            description: 'Completed Module 3: Context API',
            timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
            icon: 'book'
          },
          {
            id: 2,
            type: 'quiz_completed',
            title: 'JavaScript Fundamentals',
            description: 'Scored 90% on Week 2 Quiz',
            timestamp: new Date(Date.now() - 3600000 * 8), // 8 hours ago
            icon: 'award'
          },
          {
            id: 3,
            type: 'comment_received',
            title: 'Discussion: Modern CSS',
            description: 'Sarah replied to your comment',
            timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
            icon: 'message'
          },
          {
            id: 4,
            type: 'course_enrollment',
            title: 'Node.js Masterclass',
            description: 'You enrolled in a new course',
            timestamp: new Date(Date.now() - 3600000 * 48), // 2 days ago
            icon: 'plus-circle'
          }
        ];
        
        setTimeout(() => {
          setActivities(mockActivities);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // difference in seconds
    
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const getActivityIcon = (iconType) => {
    switch(iconType) {
      case 'book':
        return <FiBookOpen className="activity-icon book" />;
      case 'award':
        return <FiClock className="activity-icon award" />;
      default:
        return <FiClock className="activity-icon default" />;
    }
  };

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      
      {loading ? (
        <div className="activity-loading">
          <div className="activity-skeleton"></div>
          <div className="activity-skeleton"></div>
          <div className="activity-skeleton"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="no-activity">
          <p>No recent activity to show</p>
        </div>
      ) : (
        <>
          <ul className="activity-list">
            {activities.map((activity) => (
              <li key={activity.id} className="activity-item">
                <div className="activity-icon-container">
                  {getActivityIcon(activity.icon)}
                </div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
          
          <button className="view-all-activity">
            View All Activity <FiArrowRight />
          </button>
        </>
      )}
    </div>
  );
};

export default RecentActivity;