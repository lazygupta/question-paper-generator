
import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { BackgroundLines } from "../components/ui/background-lines";

export default function SignUp() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        // checks for password
        if (!password || !confirmpassword) {
            alert("Please fill out both fields");
            return;
        }
        if (password === confirmpassword) {
            alert("Passwords match. Form submitted!");
        } else {
            alert("Passwords do not match. Please try again.");
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/signin');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleRegister = () => {
        navigate('/signin');
    };

    const validatePasswords = (password, confirmPassword) => {
        if (password && confirmPassword && password !== confirmPassword) {
            setError("Passwords do not match");
        } else {
            setError("");
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen flex items-center">
            {/* <BackgroundBeamsWithCollision className="bg-black min-h-screen"> */}
                <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-gray-100">



                    <h2 className="font-semibold text-xl text-neutral-800 dark:text-neutral-200">
                        Welcome to Question Paper <span className="font-bold text-2xl text-blue-500">Generator</span>
                    </h2>
                    <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                        Register to System
                    </p>

                    {/* Form with onSubmit handler */}
                    <form className="my-8" onSubmit={handleSubmit}>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="user">Username</Label>
                            <Input id="user" placeholder="Set your username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => {
                                setPassword(e.target.value);
                                validatePasswords(e.target.value, confirmpassword);
                            }} />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input id="password" placeholder="••••••••" type="password" value={confirmpassword} onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                validatePasswords(password, e.target.value)
                            }} />
                        </LabelInputContainer>


                        {error && <p style={{ color: "red" }}>{error}</p>}


                        {/* Button to submit the form */}
                        <button
                            type="submit"  // Correct type for submitting the form
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        >
                            Register &rarr;
                            <BottomGradient />
                        </button>
                    </form>
                    {/* Register option */}
                    <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
                        Already have an account?
                        <button
                            type="button"
                            onClick={handleRegister}
                            className="text-blue-500 hover:underline ml-1">
                            Login
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