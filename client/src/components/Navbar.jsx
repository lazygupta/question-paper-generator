import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiLock, FiZap, FiFileText } from 'react-icons/fi';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="relative bg-gray-100 p-6 border-b border-gray-700 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div onClick={() => {
                    navigate("/")
                }} className="hover:cursor-pointer flex items-center space-x-2">
                    <FiFileText className="text-2xl text-gray-200" />
                    <span className="text-xl text-gray-200 font-bold">QGen</span>
                </div>
                <div className='flex'>
                    <button onClick={() => {
                    navigate("/admin/signin")
                }} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <FiLock className="text-lg text-gray-200" />
                    <span className='text-gray-200'>Admin</span>
                </button>
                <button onClick={() => {
                    navigate("/signin")
                }} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <FiLock className="text-lg text-gray-200" />
                    <span className='text-gray-200'>Sign In</span>
                </button>
                </div>
                
            </div>
        </nav>
    )
}

export default Navbar