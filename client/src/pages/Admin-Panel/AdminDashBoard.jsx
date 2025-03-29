// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { getUsers, getSubjects, deleteUser, deleteSubject } from './api';
import UserCard from '../../components/UserCard';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorSubjects, setErrorSubjects] = useState(null);
  const token = localStorage.getItem('token'); // Assumes JWT token is saved in localStorage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(token);
        setUsers(response.data.users);
      } catch (err) {
        setErrorUsers('Failed to fetch users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects(token);
        console.log(response.data.subjects);
        
        setSubjects(response.data.subjects);
      } catch (err) {
        setErrorSubjects('Failed to fetch subjects');
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [token]);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId, token);
      setUsers(users.filter((user) => user._id !== userId)); // Update the state after deletion
    } catch (err) {
      setErrorUsers('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 ">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <div className="border-b-2 border-gray-200 w-24 mx-auto"></div>
      </header>

      {/* Users Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            User Management
          </h2>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{users.length} users</span>
        </div>

        {loadingUsers ? (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : errorUsers ? (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center text-red-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errorUsers}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard 
                key={user._id} 
                user={user} 
                onDelete={handleDelete}
                className="transform transition-all hover:scale-105 hover:shadow-lg"
              />
            ))}
          </div>
        )}
      </section>

      {/* Subjects Section */}
      <section>
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Subject Management
          </h2>
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">{subjects.length} subjects</span>
        </div>

        {loadingSubjects ? (
          <div className="flex justify-center items-center h-32">
            {/* Same spinner as users section */}
          </div>
        ) : errorSubjects ? (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center text-red-600">
            {/* Same error style as users section */}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {subjects.map((subject, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700">{subject}</span>
                <button
                  onClick={async () => {
                    try {
                      await deleteSubject(subject, token);
                      setSubjects(subjects.filter((s) => s !== subject));
                    } catch (err) {
                      setErrorSubjects("Failed to delete subject");
                    }
                  }}
                  className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
