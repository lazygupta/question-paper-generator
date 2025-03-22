import { FiArrowRight, FiLock, FiZap, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const WelcomePage = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 text-gray-100">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 p-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Facing Confusions Making Question Papers?
          </h1>
          <p className="text-2xl text-gray-400 mb-8">
            Try our AI-powered Question Paper Generator
          </p>
          
          {/* CTA Button */}
          <button onClick={() => {
            navigate("/signup")
          }} className="bg-gray-300 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-medium flex items-center space-x-3 mx-auto transition-all transform hover:scale-105">
            <span>Register</span>
            <FiArrowRight className="text-xl" />
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-gray-300 p-6 rounded-xl border border-gray-700 hover:border-blue-400 transition-all">
            <FiZap className="text-4xl text-blue-400 mb-4" />
            <h3 className="text-xl text-white font-semibold mb-2">Instant Generation</h3>
            <p className="text-gray-400">Create question papers in minutes using advanced algorithms</p>
          </div>

          <div className="bg-gray-300 p-6 rounded-xl border border-gray-700 hover:border-purple-400 transition-all">
            <FiFileText className="text-4xl text-purple-400 mb-4" />
            <h3 className="text-xl text-gray-200 font-semibold mb-2">Smart Templates</h3>
            <p className="text-gray-400">Pre-built templates for various exam patterns and difficulty levels</p>
          </div>

          <div className="bg-gray-300 p-6 rounded-xl border border-gray-700 hover:border-green-400 transition-all">
            <FiLock className="text-4xl text-green-400 mb-4" />
            <h3 className="text-xl text-gray-200 font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-gray-400">Enterprise-grade security for all your question papers</p>
          </div>
        </div>

        {/* Admin Panel Section */}
        <div className="mt-24 text-center border-t border-gray-800 pt-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-200">Admin Panel Features</h2>
          <div className="max-w-2xl mx-auto text-gray-400">
            <p className="text-lg">
              Full control over question banks, user management, and automated paper generation with real-time collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;