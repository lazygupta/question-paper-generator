import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Boxes } from '../components/ui/background-boxes';

const GenerateQuestionPaper = () => {
    const [semester, setSemester] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [stream, setStream] = useState('');
    const [streams, setStreams] = useState([]);
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [module, setModule] = useState('');
    const [notes, setNotes] = useState([]);
    const [questions, setQuestions] = useState([]);


    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/notes/semesters'); // Adjust the URL as necessary
                setSemesters(response.data);
            } catch (error) {
                console.error('Error fetching semesters:', error);
            }
        };

        fetchSemesters();
    }, []);

    useEffect(() => {
        const fetchStreams = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/notes/streams'); // Adjust the URL as necessary
                setStreams(response.data);
            } catch (error) {
                console.error('Error fetching streams:', error);
            }
        };

        fetchStreams();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/notes/subjects'); // Adjust the URL as necessary
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/notes`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { semester, stream, subject }
            });

            setNotes(response.data.notes);
        } catch (error) {
            console.error("Error fetching notes", error);
        }
    };

    const generateQuestions = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!notes || !notes[0] || !notes[0].notesText) {
                console.error("No valid notes found.");
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/notes/generate-questions',
                { notesText: notes[0].notesText, module: module },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setQuestions(response.data.questions);
        } catch (error) {
            console.error("Error generating questions:", error.message);
        }
    };

    return (
        <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center ">
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

            <Boxes className="z-0" />

            <div className="w-96 mx-auto p-6 bg-gray-100 rounded-lg shadow-md z-40">
                <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Generate Question Paper</h2>
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                        <select
                            id="semester"
                            name="semester"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select Semester</option>
                            {semesters.map((sem, index) => (
                                <option key={index} value={sem}>
                                    {sem}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            id="stream"
                            name="stream"
                            value={stream}
                            onChange={(e) => setStream(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select Streams</option>
                            {streams.map((str, index) => (
                                <option key={index} value={str}>
                                    {str}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            id="subject"
                            name="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select Subjects</option>
                            {subjects.map((str, index) => (
                                <option key={index} value={str}>
                                    {str}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        type="text"
                        placeholder="Module"
                        value={module}
                        onChange={(e) => setModule(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <div className='flex justify-center'>
                        <button onClick={fetchNotes}
                            type="submit"
                            className="w-32 bg-gradient-to-br from-black to-gray-600 text-white p-2 rounded-md hover:opacity-80 transition"
                        >
                            Fetch Notes &rarr;
                        </button>
                    </div>


                </div>
                <div className='flex justify-between flex-col'>
                    <button
                        onClick={generateQuestions}
                        className="px-6 py-2 mb-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                    >
                        Generate Questions
                    </button>
                    <div>
                        {/* <h1 className="text-xl font-bold text-gray-800 mb-4">Module {module}</h1> */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Easy Questions</h3>
                            <ul className="list-disc pl-6 mb-4">
                                {questions.easy && questions.easy.map((q, idx) => (
                                    <li key={idx} className="text-gray-600 mb-1">{q}</li>
                                ))}
                            </ul>

                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Medium Questions</h3>
                            <ul className="list-disc pl-6 mb-4">
                                {questions.medium && questions.medium.map((q, idx) => (
                                    <li key={idx} className="text-gray-600 mb-1">{q}</li>
                                ))}
                            </ul>

                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Hard Questions</h3>
                            <ul className="list-disc pl-6 mb-4">
                                {questions.hard && questions.hard.map((q, idx) => (
                                    <li key={idx} className="text-gray-600 mb-1">{q}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>


    );
};

const BottomGradient = () => {
    return (<>
        <span
            className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span
            className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>);
};


export default GenerateQuestionPaper;
