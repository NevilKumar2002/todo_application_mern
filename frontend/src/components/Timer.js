import React, { useState, useEffect, useRef } from 'react';
import axios from '../axiosConfig';

const Timer = ({ activity, elapsedTime, onTimeUpdate }) => {
  const [currentElapsedTime, setCurrentElapsedTime] = useState(elapsedTime || 0);
  const [isRunning, setIsRunning] = useState(activity.status === 'Ongoing');
  const intervalRef = useRef(null);
  const pausedTimeRef = useRef(null);

  useEffect(() => {
    if (activity.status === 'Ongoing') {
      const pausedDurationSeconds = activity.pausedDuration || 0;
      const pausedTime = activity.pausedTime ? new Date(activity.pausedTime).getTime() : null;
      const now = new Date().getTime();
      const initialElapsedTime = elapsedTime + Math.floor((now - pausedTime - pausedDurationSeconds * 1000) / 1000);
      setCurrentElapsedTime(initialElapsedTime);

      intervalRef.current = setInterval(() => {
        setCurrentElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [activity, elapsedTime]);

  const handlePause = async () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    pausedTimeRef.current = new Date();
    await handleAction(activity._id, 'pause', currentElapsedTime);
  };

  const handleResume = async () => {
    setIsRunning(true);
    await handleAction(activity._id, 'resume', currentElapsedTime);
  };

  const handleAction = async (id, action, elapsedTime) => {
    try {
      if (action === 'pause') {
        const response = await axios.put(`/activities/${id}/pause`, { elapsedTime });
        if (response.status === 200) {
          onTimeUpdate(); // Refresh activities after action
        }
      } else if (action === 'resume') {
        const response = await axios.put(`/activities/${id}/resume`, { elapsedTime });
        if (response.status === 200) {
          onTimeUpdate(); // Refresh activities after action
        }
      }
    } catch (error) {
      console.error(`Error ${action} activity:`, error);
    }
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <span>{formatTime(currentElapsedTime)}</span>
      {activity.status === 'Ongoing' && (
        <>
          <button onClick={handlePause}>Pause</button>
          <button onClick={() => handleAction(activity._id, 'end')}>End</button>
        </>
      )}
      {activity.status === 'Paused' && (
        <button onClick={handleResume}>Resume</button>
      )}
    </div>
  );
};

export default Timer;
