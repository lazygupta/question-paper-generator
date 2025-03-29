import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button"
import { Boxes } from "../components/ui/background-boxes";



const Dashboard = () => {
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
    <div>
      
      <div className="flex flex-col items-center bg-gradient-to-b from-zinc-900 to-black min-h-screen text-gray-300">
        <div className="min-h-screen relative w-screen overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
          <div className="absolute inset-0 w-screen min-h-screen bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

          <Boxes className="z-0" />

          <div className="z-40 w-2/6 flex flex-col justify-center items-center p-10 rounded-xl bg-white text-black">
            <div className="mb-8 z-40">
              <div className="text-lg font-semibold text-teal-400">
                Welcome, <span className="capitalize">{username}</span>
              </div>
            </div>

            {/* Dashboard Header */}
            <h2 className=" z-40 text-4xl font-extrabold mb-6 tracking-wide">
              Dashboard
            </h2>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="z-40 px-6 py-3 mb-10 text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
            >
              Logout
            </Button>

            {/* Navigation Links */}
            <ul className="w-full max-w-sm z-40">
              {[
                { path: "/upload-notes", label: "Add Notes" },
                { path: "/add-subject", label: "Add Subject" },
                { path: "/generate-question-paper", label: "Generate Question Paper" },
                { path: "/print-question-paper", label: "Print Question Paper" },
              ].map((item, index) => (
                <li key={index} className="mb-4 flex flex-col justify-center items-center">
                  <Button variant="outline" className=" transition-all duration-500 delay-50 hover:bg-blue-950 w-full border-2 hover:text-white border-slate-950" ><Link
                    to={item.path}
                  >
                    {item.label}
                  </Link></Button>

                </li>
              ))}
            </ul>
          </div>
          {/* Welcome Section */}

        </div>
      </div>

    </div>

  );
}

export default Dashboard
