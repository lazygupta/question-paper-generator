import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { BackgroundLines } from "../components/ui/background-lines";
import { CardSpotlight } from "../components/ui/card-spotlight";

export default function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isUserNotRegistered, setIsUserNotRegistered] = useState(false); // State for unregistered user prompt
    const [isWrongPassword, setIsWrongPassword] = useState(false); // State for wrong password prompt
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Reset error states on form submission
        setError('');
        setIsUserNotRegistered(false);
        setIsWrongPassword(false);

        try {
            // API request for login
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            // Store token in local storage on successful login
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            // Handle error responses
            if (err.response?.data?.message === "User not found") {
                setIsUserNotRegistered(true); // Show the prompt if user is not found
            } else if (err.response?.data?.message === "Invalid credentials") {
                setIsWrongPassword(true); // Show the prompt for wrong password
            } else {
                setError(err.response?.data?.message || 'An error occurred');
            }
        }
    };

    const handleRegister = () => {
        navigate('/signup');
    };

    return (
        
            <div className="bg-gray-100 min-h-screen flex items-center justify-center z-0">
                {/* <BackgroundBeamsWithCollision className="bg-black min-h-screen"> */}
                <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                    <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900">
                   
                        {/* Display error messages */}
                        {isUserNotRegistered && (
                            <div className="text-red-500 text-center mb-4">
                                User not found.{' '}
                                <button onClick={handleRegister} className="text-blue-500 hover:underline">
                                    Please Register
                                </button>
                            </div>
                        )}
                        {isWrongPassword && (
                            <div className="text-red-500 text-center mb-4">
                                Incorrect password. Please try again.
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 text-center mb-4">
                                {error}
                            </div>
                        )}

                        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                            Welcome to Question Paper Generator
                        </h2>
                        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                            Login to System
                        </p>

                        {/* Login Form */}
                        <form className="my-8" onSubmit={handleSubmit}>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="user">Username</Label>
                                <Input
                                    id="user"
                                    placeholder="Enter your Username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </LabelInputContainer>

                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </LabelInputContainer>

                            <button
                                type="submit"
                                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            >
                                Login &rarr;
                                <BottomGradient />
                            </button>
                        </form>

                        {/* Registration Link */}
                        <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={handleRegister}
                                className="text-blue-500 hover:underline ml-1"
                            >
                                Register
                            </button>
                        </p>
                    </BackgroundGradient>
                </BackgroundLines>
                    
                    
                
                {/* </BackgroundBeamsWithCollision> */}
            </div>
        
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
