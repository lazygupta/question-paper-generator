import React, { useState } from 'react';
import axios from 'axios';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Boxes } from '../components/ui/background-boxes';

const UploadNotes = () => {
    const [semester, setSemester] = useState('');
    const [stream, setStream] = useState('');
    const [subject, setSubject] = useState('');
    const [notesText, setNotesText] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('semester', semester);
        formData.append('stream', stream);
        formData.append('subject', subject);
        formData.append('notesText', notesText);
        if (file) formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/notes/upload', formData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert('Notes uploaded successfully');
            navigate('/generate-question-paper')
        } catch (err) {
            alert('Error uploading notes');
        }
    };


    return (
        <div>
            <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center ">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
 
      <Boxes className="z-0"/>

      <div className="z-40 flex flex-col justify-center items-center p-10 rounded-xl bg-white text-black">
                <h2 className="text-2xl font-bold mb-4">Add Notes</h2>
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    {/* Semester Input */}
                    <div className='text-black'>
                    <LabelInputContainer >
                        <div>Semester</div>
                        <Input
                            id="semester"
                            placeholder="Semester"
                            type="text"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            required
                        />
                    </LabelInputContainer>
                    </div>
                    

                    {/* Stream Input */}
                    <LabelInputContainer>
                        <div htmlFor="stream">Stream</div>
                        <Input
                            id="stream"
                            placeholder="Stream"
                            type="text"
                            value={stream}
                            onChange={(e) => setStream(e.target.value)}
                            required
                        />
                    </LabelInputContainer>

                    {/* Subject Input */}
                    <LabelInputContainer>
                        <div htmlFor="subject">Subject</div>
                        <Input
                            id="subject"
                            placeholder="Subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </LabelInputContainer>

                    {/* Notes Text Input */}
                    <LabelInputContainer className="col-span-1 md:col-span-2">
                        <div htmlFor="notesText">Notes Text</div>
                        <textarea
                            id="notesText"
                            placeholder="Enter notes text"
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            className="border bg-zinc-800 text-white border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        ></textarea>
                    </LabelInputContainer>
                    
                    

                    {/* File Input */}
                    <div className="flex flex-col space-y-2">
                        <strong className='flex justify-center'>OR</strong>
                        <Label htmlFor="file">Upload File</Label>
                        <input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            className="file:mr-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        >
                            Upload Notes &rarr;
                        </button>
                        <BottomGradient />
                    </div>
                </form>
            </div>

    </div>
            
        </div>

    );
};

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({ children, className }) => {
    return <div className={cn('flex flex-col space-y-2', className)}>{children}</div>;
};

export default UploadNotes;
