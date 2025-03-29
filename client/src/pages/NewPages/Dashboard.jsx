import { useEffect } from 'react';
import { useState } from 'react';
import { FiHome, FiPlus, FiFileText, FiPrinter, FiBook } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AddSubject from './AddSubject';

const DashboardPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      setUsername(response.data.username)
    }

    getProfile();
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-200">


      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100 p-8">
        {/* Welcome Header */}
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-200">Welcome <span className="capitalize">{username}</span></h1>
            <p className="text-gray-400 mt-2">Manage your question papers and notes</p>
          </div>

          <button
            onClick={handleLogout}
            variant="destructive"
            className="z-40 px-6 py-3 mb-10 text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div onClick={() =>{
          navigate('/addSubject')
        }} className="bg-gray-800 rounded-xl p-6 hover:ring-1 hover:cursor-pointer hover:ring-blue-500 transition-all">
            <FiBook className="text-4xl text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Add Subject</h3>
            <p className="text-gray-400 text-sm">Add the Subject Details here</p>
          </div>

          <div onClick={() =>{
            navigate("/upload-notes")
          }} className="bg-gray-800 rounded-xl p-6 hover:ring-1 hover:cursor-pointer hover:ring-blue-500 transition-all">
            <FiPlus className="text-4xl text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Add Notes</h3>
            <p className="text-gray-400 text-sm">Upload new course materials</p>
          </div>

          <div onClick={() =>{
            navigate("/generate-question-paper")
          }} className="bg-gray-800 rounded-xl p-6 hover:ring-1 hover:cursor-pointer hover:ring-blue-500 transition-all">
            <FiFileText className="text-4xl text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Generate Paper</h3>
            <p className="text-gray-400 text-sm">Create new question papers</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 hover:ring-1 hover:cursor-pointer hover:ring-blue-500 transition-all">
            <FiPrinter className="text-4xl text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Print Papers</h3>
            <p className="text-gray-400 text-sm">Manage printing operations</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-gray-300 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-gray-400 text-sm">
            <p>No recent activity yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;