// src/components/UserCard.js
import React from 'react';

const UserCard = ({ user, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-start space-y-3">
      <div className="text-xl font-semibold text-gray-800">{user.username}</div>
      <div className="text-gray-500">{user.email}</div>
      <button
        onClick={() => onDelete(user._id)}
        className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Delete
      </button>
    </div>
  );
};

export default UserCard;
