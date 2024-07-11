import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const register = (formData) => API.post('/users/register', formData);
export const login = (formData) => API.post('/users/login', formData);
export const fetchActivities = () => API.get('/activities');
export const updateActivity = (id, action) => API.put(`/activities/${id}`, { action });
