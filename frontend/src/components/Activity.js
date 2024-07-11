import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList';

const Activity = () => {
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

  const handleAddActivity = (newActivity) => {
    setActivities([...activities, newActivity]);
  };

  return (
    <div>
      <ActivityForm onAdd={handleAddActivity} />
      <ActivityList activities={activities} fetchActivities={fetchActivities} />
    </div>
  );
};

export default Activity;
