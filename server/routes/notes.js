const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Notes = require('../models/notes');
const multer = require('multer');
const axios = require('axios');
const OpenAI = require("openai")
const Subject = require('../models/Subject'); 

const natural = require('natural');
const tokenizer = new natural.SentenceTokenizer();

router.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Add Subject
router.post('/addsubject', async (req, res) => {
    try {
        const { subjectName, subjectCode, courseOutcome } = req.body;
        

        // Validate request data
        if (!subjectName || !subjectCode || !courseOutcome) {
            return res.status(400).json({ error: 'Subject name and code are required.' });
        }

        // Check if the subject already exists
        const existingSubject = await Subject.findOne({ subjectCode });
        if (existingSubject) {
            return res.status(409).json({ error: 'Subject with this code already exists.' });
        }

        const subjectfullName = subjectName + "_" + subjectCode;
        console.log(subjectfullName);

        // Create a new subject
        const newSubject = new Subject({
            subjectName,
            subjectCode,
            subjectfullName,
            courseOutcome
        });

        // Save the subject to the database
        await newSubject.save();

        res.status(201).json({
            message: 'Subject added successfully!',
            subject: subjectfullName,
            courseOutcome
        });
    } catch (error) {
        console.error('Error adding subject:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//fetch subject

// Get all subjects
router.get('/getallsubjects', async (req, res) => {
    
        const subjects = await Subject.find({});

        // If no subjects are found
        if (subjects.length === 0) {
            return res.status(404).json({ error: 'No subjects found.' });
        }

        // Respond with all subjects
        res.status(200).json({
            subjects: subjects
        });
});

// Get course outcomes
router.get('/getCourseOutcome', async (req, res) => {
    const { subjectName } = req.query;

    if (!subjectName) {
        return res.status(400).json({ error: 'Subject name is required.' });
    }

    try {
        const subject = await Subject.findOne({ subjectName });

        if (!subject) {
            return res.status(404).json({ error: 'Subject not found.' });
        }

        // Split courseOutcome into an array based on line breaks or periods
        const courseOutcomesArray = subject.courseOutcome
            ? subject.courseOutcome.split(/\n\d*\.\s*/).filter(outcome => outcome.trim() !== "")
            : [];

        res.status(200).json({ 
            courseOutcomes: courseOutcomesArray // Return as an array
        });
    } catch (error) {
        console.error('Error fetching course outcome:', error);
        res.status(500).json({ error: 'An error occurred while fetching the course outcome.' });
    }
});


// Upload notes route
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    const { semester, stream, subject, notesText } = req.body;
    const filePath = req.file ? req.file.path : null;

    try {
        const newNotes = new Notes({
            semester,
            stream,
            subject,
            notesText,
            filePath
        });
        await newNotes.save();
        res.status(201).json({ message: "Notes uploaded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// fetch semseter

// Assuming you have a Notes model where the semester field exists
router.get('/semesters', async (req, res) => {
    try {
      // Fetch all distinct semesters from the Notes model
      const semesters = await Notes.distinct('semester');
      res.status(200).json(semesters);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/streams-by-semester', async (req, res) => {
    const { semester } = req.query;

    if (!semester) {
        return res.status(400).json({ message: "Semester is required" });
    }

    try {
        // Fetch distinct streams for the given semester
        const streams = await Notes.distinct('stream', { semester: { $regex: `^${semester}$`, $options: 'i' } });

        res.status(200).json(streams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/subject-by-streams', async (req,res) => {
    const { stream } = req.query;
    
    if(!stream) {
        return res.status(400).json({ message: "Streams is required" });
    }
    try {
        // Fetch distinct streams for the given semester
        const subject = await Notes.distinct('subject', { stream: { $regex: `^${stream}$`, $options: 'i' } });

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
  
// Fetch notes based on semester, stream, and subject
router.get('/', authMiddleware, async (req, res) => {
    const { semester, stream, subject } = req.query;

    try {
        const notes = await Notes.find({ semester, stream, subject });
        res.status(200).json({ notes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Writing gemini logic from here


const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    googleApiKey: apiKey,
});

async function converse(query) {
    const prompt = `Generate 15 easy, 15 medium and 15 hard questions anyhow from the following notes. 
  Return questions categorized under 'easy', 'medium', and 'hard' keys. 
  Notes: ${query}
  
  Rules:-
  1. No brackets questions allowed
  2. Questions should not repeat
  3. Only questions should be repeated, no answers`;

    try {
        // Invoke the LLM with the prompt
        const result = await llm.invoke(prompt);
        const response = result.content;

        // Structured response
        const structuredResponse = {
            easy: [],
            medium: [],
            hard: []
        };

        // Example: Extracting easy, medium, and hard questions from the response text
        const lines = response.split('\n');
        let currentCategory = null;

        for (let line of lines) {
            if (line.toLowerCase().includes('easy')) {
                currentCategory = 'easy';
            } else if (line.toLowerCase().includes('medium')) {
                currentCategory = 'medium';
            } else if (line.toLowerCase().includes('hard')) {
                currentCategory = 'hard';
            } else if (currentCategory) {
                // Clean up the line and remove unwanted characters
                const cleanedLine = line.trim().replace(/["',]/g, ''); // Remove quotes and commas
                if (cleanedLine) {
                    structuredResponse[currentCategory].push(cleanedLine);
                }
            }
        }

        console.log("Structured Response:", structuredResponse);
        return structuredResponse;
    } catch (error) {
        console.error("Error yahi hai kya:", error.message);
        return "An error occurred while processing your request.";
    }
}


router.post('/generate-questions', authMiddleware, async (req, res) => {
    try {
        const { notesText } = req.body;

        const questions = await converse(notesText); // Await the async function
        res.status(200).json({ questions });
    } catch (error) {
        console.error("Error generating questions:", error.message);
        res.status(500).json({ error: "An error occurred while generating questions." });
    }
});


module.exports = router;