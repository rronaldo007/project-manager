import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import UserAvatar from '../ui/UserAvatar';

const ActivityTimeline = ({ projectId }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/activities/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
        setError('');
      } else {
        setError('Failed to fetch activities');
      }
    } catch (err) {
      setError('Network error while fetching activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchActivities();
    }
  }, [projectId]);

  // Add comment
  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setAddingComment(true);
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/activities/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_type: 'comment_added',
          description: newComment.trim(),
          metadata: { comment_type: 'user_comment' }
        }),
      });

      if (response.ok) {
        const newActivity = await response.json();
        setActivities([newActivity, ...activities]);
        setNewComment('');
      } else {
        setError('Failed to add comment');
      }
    } catch (err) {
      setError('Network error while adding comment');
    } finally {
      setAddingComment(false);
    }
  };

  // Get activity icon based on type
  const getActivityIcon = (activityType) => {
    const iconMap = {
      'created': '🎉',
      'updated': '✏️',
      'status_changed': '🔄',
      'progress_updated': '📊',
      'member_added': '👥',
      'member_removed': '👤',
      'comment_added': '💬',
      'file_uploaded': '📎',
      'deadline_changed': '⏰',
    };
    return iconMap[activityType] || '📝';
  };

  // Get activity color based on type
  const getActivityColor = (activityType) => {
    const colorMap = {
      'created': 'text-green-400 bg-green-400/20 border-green-500/30',
      'updated': 'text-blue-400 bg-blue-400/20 border-blue-500/30',
      'status_changed': 'text-purple-400 bg-purple-400/20 border-purple-500/30',
      'progress_updated': 'text-orange-400 bg-orange-400/20 border-orange-500/30',
      'member_added': 'text-cyan-400 bg-cyan-400/20 border-cyan-500/30',
      'member_removed': 'text-red-400 bg-red-400/20 border-red-500/30',
      'comment_added': 'text-yellow-400 bg-yellow-400/20 border-yellow-500/30',
      'file_uploaded': 'text-indigo-400 bg-indigo-400/20 border-indigo-500/30',
      'deadline_changed': 'text-pink-400 bg-pink-400/20 border-pink-500/30',
    };
    return colorMap[activityType] || 'text-gray-400 bg-gray-400/20 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Comment Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Add Comment
        </h3>
        <div className="flex space-x-3">
          <UserAvatar user={user} />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment to this project..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={addComment}
                disabled={!newComment.trim() || addingComment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center"
              >
                {addingComment ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Comment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Activity Timeline
        </h3>
        
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-300 mb-2">No activity yet</h4>
            <p className="text-gray-400">Project activities and updates will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex space-x-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm ${getActivityColor(activity.activity_type)}`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 h-6 bg-gray-600/50 mt-2"></div>
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <UserAvatar user={activity.user} />
                        <div>
                          <p className="text-white font-medium">
                            {activity.user.first_name} {activity.user.last_name}
                          </p>
                          <p className="text-xs text-gray-400">{activity.time_ago}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                        {activity.activity_type_display}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {activity.description}
                    </p>

                    {/* Show metadata for certain activity types */}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-600/30">
                        {activity.activity_type === 'status_changed' && activity.metadata.old_status && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-400">Changed from:</span>
                            <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                              {activity.metadata.old_status}
                            </span>
                            <span className="text-gray-400">to</span>
                            <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                              {activity.metadata.new_status}
                            </span>
                          </div>
                        )}
                        {activity.activity_type === 'progress_updated' && activity.metadata.old_progress !== undefined && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-400">Progress:</span>
                            <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                              {activity.metadata.old_progress}%
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                              {activity.metadata.new_progress}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
