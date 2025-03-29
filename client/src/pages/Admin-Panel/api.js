// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all users
export const getUsers = (token) => {
  return api.get('/api/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete a user by ID
export const deleteUser = (userId, token) => {
  return api.delete(`/api/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSubjects = (token) => {
  return api.get('/api/admin/subjects', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteSubject = (subjectName, token) => {
  return api.delete(`/api/admin/subjects/${subjectName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
