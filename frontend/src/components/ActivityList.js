import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './ActivityStyle.css'; // Import the CSS file for styling

const ActivityList = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleAction = async (id, action, elapsedTime) => {
    try {
      if (action === 'pause') {
        // Pause action: store current elapsed time
        const activityToUpdate = activities.find(activity => activity._id === id);
        const updatedActivities = activities.map(activity => {
          if (activity._id === id) {
            return { ...activityToUpdate, status: 'Paused', pausedTime: new Date(), elapsedTime: elapsedTime };
          }
          return activity;
        });
        setActivities(updatedActivities);
      } else if (action === 'resume') {
        // Resume action: calculate elapsed time since pause
        const activityToUpdate = activities.find(activity => activity._id === id);
        const pausedTime = new Date(activityToUpdate.pausedTime);
        const now = new Date();
        const elapsedPausedSeconds = Math.floor((now - pausedTime) / 1000);
        const updatedElapsedTime = activityToUpdate.elapsedTime + elapsedPausedSeconds;

        const updatedActivities = activities.map(activity => {
          if (activity._id === id) {
            return { ...activityToUpdate, status: 'Ongoing', pausedTime: null, elapsedTime: updatedElapsedTime };
          }
          return activity;
        });
        setActivities(updatedActivities);
      } else {
        // Other actions (start, end, etc.)
        await axios.put(`/activities/${id}/${action}`);
        fetchActivities(); // Refresh activities after action
      }
    } catch (error) {
      console.error(`Error ${action} activity:`, error);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) {
      return "00:00:00"; // Return default value if timeInSeconds is not a number
    }

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const Timer = ({ activity, elapsedTime }) => {
    const [currentElapsedTime, setCurrentElapsedTime] = useState(elapsedTime || 0);
    const [timerInterval, setTimerInterval] = useState(null);

    useEffect(() => {
      if (activity.status === 'Ongoing') {
        const now = new Date();
        const start = new Date(activity.startTime);

        const initialElapsed = Math.floor((now - start) / 1000);
        setCurrentElapsedTime(initialElapsed);

        const interval = setInterval(() => {
          setCurrentElapsedTime(prevTime => prevTime + 1);
        }, 1000);

        setTimerInterval(interval); // Store interval ID

        return () => clearInterval(interval);
      } else {
        clearInterval(timerInterval); // Clear interval when not ongoing
      }
    }, [activity]);

    const handlePause = () => {
      clearInterval(timerInterval); // Stop the interval
      handleAction(activity._id, 'pause', currentElapsedTime);
    };

    const handleResume = () => {
      handleAction(activity._id, 'resume', currentElapsedTime);
    };

    return (
      <div>
        {activity.status === 'Ongoing' && (
          <>
            <button onClick={handlePause}>Pause</button>
            <button onClick={() => handleAction(activity._id, 'end')}>End</button>
          </>
        )}
        {activity.status === 'Paused' && (
          <button onClick={handleResume}>Resume</button>
        )}
        <span>{formatTime(currentElapsedTime)}</span>
      </div>
    );
  };

  return (
    <div className="activity-list-container">
      <h2>Activity List</h2>
      <table className="activity-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Activity Name</th>
            <th>Actions</th>
            <th>Status</th>
            <th>Time Duration</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={activity._id}>
              <td>{index + 1}</td>
              <td>{activity.name}</td>
              <td>
                {activity.status === 'Pending' && (
                  <button onClick={() => handleAction(activity._id, 'start')}>Start</button>
                )}
                {activity.status === 'Ongoing' && (
                  <Timer activity={activity} elapsedTime={activity.elapsedTime} />
                )}
                {activity.status === 'Paused' && (
                  <Timer activity={activity} elapsedTime={activity.elapsedTime} />
                )}
                {activity.status === 'Completed' && (
                  <button disabled>End</button>
                )}
              </td>
             
              <td>{activity.status}</td>
              <td>
                {activity.status !== 'Ongoing' && activity.status !== 'Paused' && (
                  <span>{formatTime(Math.floor((new Date(activity.endTime) - new Date(activity.startTime)) / 1000))}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityList;

