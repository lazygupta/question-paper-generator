import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiUpload, FiCheck, FiBook } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"]

const AddNotesPage = () => {
    const [semester, setSemester] = useState('');
    const [stream, setStream] = useState('');
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [module, setModule] = useState('');
    const [notesText, setNotesText] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/notes/getallsubjects');
                console.log(response.data.subjects);
                setSubjects(response.data.subjects);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, [])


    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('semester', semester);
        formData.append('stream', stream);
        formData.append('subject', subject);
        formData.append('notesText', notesText);
        if (file) formData.append('file', file);

        try {
            if (notesText) {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/notes/upload', formData, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                alert('Notes uploaded successfully');
                navigate('/generate-question-paper')
            }
            else {
                alert("The notes can't be empty")
            }
        } catch (err) {
            alert('Error uploading notes');
        }
    };

    return (
        <div className="flex h-screen justify-center items-center flex-col p-4 w-screen bg-gray-100 text-gray-200">

            {/* Main Content */}
            <h1 className="text-3xl font-bold mb-8">Add New Notes</h1>
            <div className="max-w-4xl">
                {/* Course Details */}
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-gray-200 mb-2">Semester</label>
                            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full bg-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500">
                                <option value="" disabled>Select Semester</option>
                                {Semesters.map((sem, index) => <option key={index} value={sem}>{sem}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-200 mb-2">Stream</label>
                            <select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full bg-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500">
                                <option value="" disabled>Select Stream</option>
                                <option>Select Stream</option>
                                <option>CSE</option>
                                <option>ECE</option>
                                <option>IT</option>
                                <option>EEE</option>
                                <option>ME</option>
                                <option>CE</option>
                            </select>
                        </div>

                        <div className="">
                            <div></div>
                            <label className="block text-gray-200 mb-2">Subject</label>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select a subject</option>
                                {subjects.map((subjectObj, index) => (
                                    <option key={index} value={subjectObj.subjectfullName}>
                                        {subjectObj.subjectfullName}
                                    </option>
                                ))}
                            </select>


                        </div>
                        {/* Button to navigate to Add Subject */}
                        <button
                            onClick={() => navigate('/addSubject')}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                        >
                            Want to Add a Subject? Click Here
                        </button>

                    </div>

                    {/* Notes Editor */}
                    <div className="mb-8 ">
                        <label className="block text-gray-200 mb-2">Notes Text</label>
                        <textarea value={notesText} onChange={(e) => setNotesText(e.target.value)}
                            placeholder="Enter notes text"
                            className="w-full bg-gray-300 rounded-lg px-4 py-3 h-28
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>



                    {/* File Upload */}
                    <div className="mb-8">
                        <div className='flex justify-center font-bold text-gray-200'>
                            OR
                        </div>
                        <label className="block text-gray-200 mb-2">Upload File</label>
                        <div className="relative">
                            <input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                            />
                            <div className="bg-gray-300 rounded-lg p-4 border-2 border-dashed border-gray-600">
                                <div className="flex flex-col items-center justify-center">
                                    <FiUpload className="text-2xl mb-2 text-blue-400" />
                                    <span className="text-gray-300">Choose File</span>
                                    <span className="text-sm text-gray-500" id="fileName">No file chosen</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-center'>
                        <button className="bg-green-600 h-12 hover:bg-blue-700 text-gray-200 px-8 py-3 rounded-lg
                            flex items-center justify-center transition-colors">
                            <FiCheck className="mr-2" />
                            Upload Notes
                        </button>
                    </div>
                </form>


            </div>

        </div>
    );
};

export default AddNotesPage;