import React, { useState } from "react";
import axios from "axios";

const AddSubject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [courseOutcome, setCourseOutcome] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/notes/addsubject", { subjectName, subjectCode, courseOutcome });
      alert(`Subject Added: ${response.data.subject}`);
      setSubjectName("");
      setSubjectCode("");
      setCourseOutcome("");
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-white flex items-center justify-center">
      <div className="bg-gray-200 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Add Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Subject Name</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter Subject Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Subject Code</label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter Subject Code"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Course Outcome</label>
            <textarea
              value={courseOutcome}
              onChange={(e) => setCourseOutcome(e.target.value)}
              className="w-full px-4 py-4 mt-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              placeholder="Enter Course Outcome"
              rows={5}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Add Subject
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;
