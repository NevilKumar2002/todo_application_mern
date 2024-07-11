import React, { useState } from 'react';
import axios from '../axiosConfig';
import "./ActivityStyle.css";

const ActivityForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/activities', { name, userId });
      onAdd(response.data);
      setName(''); 
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter activity name"
        required
      />
      <button type="submit">Add Activity</button>
    </form>
  );
};

export default ActivityForm;
