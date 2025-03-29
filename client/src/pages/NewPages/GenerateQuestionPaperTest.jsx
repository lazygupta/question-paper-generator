import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiCopy, FiCheckSquare, FiDownload, FiChevronDown, FiX } from 'react-icons/fi';
import jsPDF from "jspdf";
import { IconsManifest } from 'react-icons/lib';

const QuestionPaperGenerator = () => {
  const [semester, setSemester] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [stream, setStream] = useState('');
  const [streams, setStreams] = useState([]);
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState({
    easy: [],
    medium: [],
    hard: []
  });
  const [questionCounts, setQuestionCounts] = useState({
    easy: 4,
    medium: 4,
    hard: 6
  });
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [activeTab, setActiveTab] = useState('easy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerating1, setIsGenerating1] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isNotesPopupOpen, setIsNotesPopupOpen] = useState(false);
  const maxLimits = {
    easy: 12,
    medium: 13,
    hard: 13
  };
  const adjustCount = (difficulty, delta) => {
    setQuestionCounts(prev => {
      const currentMax = Math.min(maxLimits[difficulty], questions[difficulty].length);
      const newValue = prev[difficulty] + delta;
      return {
        ...prev,
        [difficulty]: Math.max(0, Math.min(newValue, currentMax))
      };
    });
  };

  const handleCountChange = (difficulty, value) => {
    const newValue = parseInt(value) || 0;
    const currentMax = Math.max(maxLimits[difficulty], questions[difficulty].length);
    setQuestionCounts(prev => ({
      ...prev,
      [difficulty]: Math.max(0, Math.max(newValue, currentMax))
    }));
  };


  const exportToPDF = async (subject, semester, stream) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bolditalic");

    const [subjectName, subjectCode] = subject.split("_");

    // Fetch course outcomes
    const response = await axios.get(
      `http://localhost:5000/api/notes/getCourseOutcome?subjectName=${encodeURIComponent(subjectName)}`
    );
    const data = response.data.courseOutcomes;
    console.log(data);

    const outcomesAtOddIndices = data;



    // Header Information
    doc.setFontSize(10);
    doc.text("Reg. No.", 10, 10);
    doc.setFontSize(16);
    doc.text(`B.Tech. Degree ${semester} Regular/Supplementary Examination June 2023`, 105, 30, { align: "center" });
    doc.setFontSize(12);
    doc.text(`${stream} ${subjectCode} ${subjectName} (2019 Scheme)`, 105, 40, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text("Time: 3 Hours", 10, 50);
    doc.text("Maximum Marks: 60", 160, 50);

    // Bloom's Taxonomy Levels and Programme Outcome
    doc.setFontSize(10); // Adjust font size for these lines

    doc.text(`Course Outcomes:  On completion of this course the student will be able to: `, 10, 60);

    // Do your work here
    let y = 65; // Starting position for course outcomes
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    outcomesAtOddIndices.forEach((outcome, index) => {
      const coText = `CO${index + 1}: ${outcome}`;
      const splitCoText = doc.splitTextToSize(coText, 190); 

      doc.text(splitCoText, 10, y);
      y += splitCoText.length * 5; 

      if (y > 280) { 
        doc.addPage();
        y = 20; 
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      }
    });
    console.log(y);

    doc.text(`Bloom's Taxonomy Levels (BL): L1 - Remember, L2 - Understand, L3 - Apply, L4 - Analyze, L5 - Evaluate, L6 - Create`, 10, y);
    y+=5;
    doc.text(`PO - Programme Outcome`, 10, y);
y+=10

    // Horizontal Line
    doc.setLineWidth(0.5);

    let yPosition = y+5; // Start position after header

    // Add labels and additional fields to questions
    const formatQuestions = (questions, difficulty) => {
      let alphabetIndex = 0; // Reset alphabetical counter for each difficulty
      return questions.map(question => ({
        label: String.fromCharCode(97 + alphabetIndex++), // 'a', 'b', etc.
        text: question.text,
        marks: difficulty === "easy" ? 3 : difficulty === "medium" ? 6 : 12,
        BL: `L${Math.floor(Math.random() * 6) + 1}`, // Random BL for example
        CO: `${Math.floor(Math.random() * 4) + 1}`, // Random CO for example
        PO: "1,2,3,5", // Example PO value
      }));
    };

    const easyQuestions = formatQuestions(
      questions.easy.filter(q => selectedQuestions.has(q.id)),
      "easy"
    );
    const mediumQuestions = formatQuestions(
      questions.medium.filter(q => selectedQuestions.has(q.id)),
      "medium"
    );
    const hardQuestions = formatQuestions(
      questions.hard.filter(q => selectedQuestions.has(q.id)),
      "hard"
    );

    // Function to add a section with dynamic page breaks and formatted questions
    const addSection = (title, questions, yPos, totalMarks, multiplier) => {
      if (questions.length === 0) return yPos;

      // Section title with details
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, 105, yPos, { align: "center" }); // Center the title

      yPos += 10;

      // Add subtitle with marks and column headers
      const subtitle = `(Answer ALL question ${questions.length} × ${multiplier} = ${totalMarks} )`;
      doc.text(subtitle, 105, yPos, { align: "center" });
      yPos += 5;

      // Add column headers with proper spacing
      doc.setFont("helvetica", "bold");
      doc.text("Marks", 155, yPos);
      doc.text("BL", 170, yPos);
      doc.text("CO", 185, yPos);
      doc.text("PO", 200, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10; // Add spacing below the headers

      // Loop through questions and add them
      questions.forEach(question => {
        const questionText = `(${question.label}) ${question.text}`;
        const splitText = doc.splitTextToSize(questionText, 140); // Wrap text to fit within page width

        // Question text and metadata
        doc.text(splitText, 10, yPos);
        doc.text(question.marks.toString(), 160, yPos); // Marks
        doc.text(question.BL, 170, yPos); // BL
        doc.text(question.CO, 180, yPos); // CO
        doc.text(question.PO, 190, yPos); // PO
        yPos += (splitText.length * 7) + 5;

        // Page break logic
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
          doc.setFontSize(10);
          doc.text("Contd...", 10, 10);
          doc.setFontSize(12);
        }
      });

      return yPos + 10; // Add spacing after section
    };

    const addPartBSection = (mediumQuestions, hardQuestions, startYPosition, totalMarks, multiplier) => {
      let yPosition = startYPosition;
      let questionNumber = 2; // Start question numbering from II

      const addQuestion = (type, question, yPos, questionNum, subNum = null) => {
        const marks = type === "medium" ? 6 : 12;
        const textPrefix = subNum ? `${questionNum}. (${subNum})` : `${questionNum}.`;
        const questionText = `${textPrefix} ${question.text}`;
        const splitText = doc.splitTextToSize(questionText, 140);

        doc.text(splitText, 10, yPos);
        doc.text(marks.toString(), 160, yPos);
        doc.text(question.BL, 170, yPos);
        doc.text(question.CO, 180, yPos);
        doc.text(question.PO, 190, yPos);

        yPos += (splitText.length * 7) + 5;

        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
          doc.setFontSize(10);
          doc.text("Contd...", 10, 10);
          doc.setFontSize(12);
        }

        return yPos;
      };

      // Add Part B title
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PART B", 105, yPosition, { align: "center" });
      yPosition += 10;

      // Add subtitle with marks and column headers
      const subtitle = `(Answer ANY ONE question from each module: 12 × ${multiplier} = ${totalMarks})`;
      doc.text(subtitle, 105, yPosition, { align: "center" });
      yPosition += 10;

      doc.text("Marks", 155, yPosition);
      doc.text("BL", 170, yPosition);
      doc.text("CO", 185, yPosition);
      doc.text("PO", 200, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;

      // Add Hard and Medium Questions to Part B
      for (let i = 0; i < hardQuestions.length; i++) {
        if (hardQuestions[i]) {
          yPosition = addQuestion("hard", hardQuestions[i], yPosition, questionNumber);
        }

        if (mediumQuestions.length >= 2) {
          doc.setFont("helvetica", "bold");
          doc.text("OR", 105, yPosition, { align: "center" });
          doc.setFont("helvetica", "normal");
          yPosition += 10;

          const mediumQ1 = mediumQuestions.shift();
          const mediumQ2 = mediumQuestions.shift();

          if (mediumQ1 && mediumQ2) {
            yPosition = addQuestion("medium", mediumQ1, yPosition, questionNumber, "i");
            yPosition = addQuestion("medium", mediumQ2, yPosition, questionNumber, "ii");
          }
        }

        questionNumber++;
      }

      return yPosition;
    };


    // Add sections to PDF
    yPosition = addSection("PART A ", easyQuestions, yPosition, 24, 3);
    yPosition = addPartBSection(mediumQuestions, hardQuestions, yPosition, 48, 4);

    doc.save(`${subject}.pdf`);
  };


  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notes/semesters');
        setSemesters(response.data);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };
    fetchSemesters();
  }, []);

  const fetchStreams = async (selectedSemester) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/notes/streams-by-semester?semester=${encodeURIComponent(selectedSemester)}`,
      );
      setStreams(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchSubjects = async (selectedStream) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/notes/subject-by-streams?stream=${encodeURIComponent(selectedStream)}`
      );
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };



  const fetchNotes = async () => {
    try {
      setIsFetching(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { semester, stream, subject },
      });
      setNotes(response.data.notes);
      setIsNotesPopupOpen(true);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const generateQuestionsT5 = async () => {
    try {
      setIsGenerating1(true);
      
      if (!notes?.[0]?.notesText) {
        console.error("No valid notes found.");
        return;
      }
  
      // Split sentences and group into chunks of 10 words
      const sentences = notes[0].notesText.split('.').flatMap(sentence => 
        sentence.trim().split(/\s+/).reduce((result, word, index) => {
          const chunkIndex = Math.floor(index / 10);
          result[chunkIndex] = result[chunkIndex] || [];
          result[chunkIndex].push(word);
          return result;
        }, []).map(chunk => chunk.join(' '))
      ).filter(chunk => chunk.length);
  
      // Create 10 parts of roughly equal size
      const noteParts = Array.from({ length: 20 }, (_, i) => 
        sentences.slice(i * Math.ceil(sentences.length / 16), (i + 1) * Math.ceil(sentences.length / 16)).join('. ')
      );
  
      const allQuestions = [];
      
      // Fetch questions for each part
      for (const part of noteParts) {
        const response = await axios.post(
          'http://127.0.0.1:8000/generate-question',
          { notes: part }
        );
        console.log("Python hai ye" + response.data.question);
        
        allQuestions.push(response.data.question);
      }
  
      // Shuffle and distribute questions
      let transformedQuestions = { easy: [], medium: [], hard: [] };
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
  
      transformedQuestions.easy = shuffledQuestions.slice(0, 4).map((text, index) => ({
        id: `easy-${index}`,
        text,
      }));
      transformedQuestions.medium = shuffledQuestions.slice(4, 8).map((text, index) => ({
        id: `medium-${index}`,
        text,
      }));
      transformedQuestions.hard = shuffledQuestions.slice(8, 10).map((text, index) => ({
        id: `hard-${index}`,
        text,
      }));

      const token = localStorage.getItem('token');
  
      if (!notes?.[0]?.notesText) {
        console.error("No valid notes found.");
        return;
      }
  
      // Call the API to generate the second set of questions
      const response = await axios.post(
        'http://localhost:5000/api/notes/generate-questions',
        { notesText: notes[0].notesText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("AI hai ye" + response.data.questions)
  
      // Extract the second set of questions
      const additionalQuestions = {
        easy: response.data.questions.easy.slice(0, 8).map((text, index) => ({
          id: `easy-${transformedQuestions.easy.length + index}`,
          text,
        })),
        medium: response.data.questions.medium.slice(0, 8).map((text, index) => ({
          id: `medium-${transformedQuestions.medium.length + index}`,
          text,
        })),
        hard: response.data.questions.hard.slice(0, 6).map((text, index) => ({
          id: `hard-${transformedQuestions.hard.length + index}`,
          text,
        })),
      };
  
      // Merge the new questions with the existing ones
      transformedQuestions = {
        easy: [...transformedQuestions.easy, ...additionalQuestions.easy],
        medium: [...transformedQuestions.medium, ...additionalQuestions.medium],
        hard: [...transformedQuestions.hard, ...additionalQuestions.hard],
      };
  
      // Update state with transformed questions
      setQuestions(transformedQuestions);
    } catch (err) {
      console.error(`Error generating questions: ${err.message}`);
    } finally {
      setIsGenerating1(false);
    }
  };
  
  

  const generateQuestions = async () => {
    try {
      setIsGenerating(true);
      const token = localStorage.getItem('token');

      if (!notes?.[0]?.notesText) {
        console.error("No valid notes found.");
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/notes/generate-questions',
        { notesText: notes[0].notesText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const transformedQuestions = {
        easy: response.data.questions.easy.map((text, index) => ({
          id: `easy-${index}`,
          text,
        })),
        medium: response.data.questions.medium.map((text, index) => ({
          id: `medium-${index}`,
          text,
        })),
        hard: response.data.questions.hard.map((text, index) => ({
          id: `hard-${index}`,
          text,
        }))
      };

      setQuestions(transformedQuestions);
    } catch (error) {
      console.error("Error generating questions:", error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleQuestion = (questionId) => {
    const newSelection = new Set(selectedQuestions);
    newSelection.has(questionId) ? newSelection.delete(questionId) : newSelection.add(questionId);
    setSelectedQuestions(newSelection);
  };

  const renderDifficultyController = (difficulty) => {
    const colors = {
      easy: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      medium: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      hard: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };

    return (
      <div className={`${colors[difficulty].bg} p-3 rounded-lg border ${colors[difficulty].border} mb-3`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${colors[difficulty].text}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustCount(difficulty, -1)}
              className={`${colors[difficulty].text} bg-white px-2 rounded hover:opacity-80`}
            >
              -
            </button>
            <input
              type="number"
              value={questionCounts[difficulty]}
              onChange={(e) => handleCountChange(difficulty, e.target.value)}
              className="w-12 text-center text-black bg-white rounded py-1"
              max={{
                easy: 10,
                medium: 12,
                hard: 12,
              }[difficulty]}
            />
            <button
              onClick={() => adjustCount(difficulty, 1)}
              className={`${colors[difficulty].text} bg-white px-2 rounded hover:opacity-80`}
            >
              +
            </button>
          </div>
        </div>
        <div className={`text-xs ${colors[difficulty].text}`}>
          Available: {questions[difficulty]?.length || 0} / {maxLimits[difficulty]}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-200">
      {/* Left Sidebar */}
      <div className="w-72 bg-gray-100 p-6 border-r border-gray-700 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-blue-400">Generate Question</h2>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm mb-2">Semester</label>
            <div className="relative">
              <select
                value={semester}
                onChange={async (e) => {
                  const selectedSemester = e.target.value;
                  setSemester(selectedSemester);
                  await fetchStreams(selectedSemester);
                }}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 pr-8 appearance-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem, index) => (
                  <option key={index} value={sem}>{sem}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Stream</label>
            <div className="relative">
              <select
                value={stream}
                onChange={async (e) => {
                  const selectedStream = e.target.value;
                  setStream(selectedStream);
                  await fetchSubjects(selectedStream);
                }}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 pr-8 appearance-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Stream</option>
                {streams.map((str, index) => (
                  <option key={index} value={str}>{str}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Subject</label>
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 pr-8 appearance-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject</option>
                {subjects.map((sub, index) => (
                  <option key={index} value={sub}>{sub}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="mt-8">
            {renderDifficultyController('easy')}
            {renderDifficultyController('medium')}
            {renderDifficultyController('hard')}

            <button
              className="w-auto p-3 mb-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
              onClick={fetchNotes}
            >
              {isFetching ? 'Fetching...' : 'Fetch Notes'}
            </button>
            <button
              className="w-full bg-yellow-400 hover:scale-105 text-black py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
              onClick={generateQuestions}
            >
              {isGenerating ? 'Generating...' : `Generate Questions (AI)`}
            </button>
            <button
              className="w-full mt-2 bg-blue-600 hover:scale-105 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
              onClick={generateQuestionsT5}
            >
              {isGenerating1 ? 'Generating...' : 'Generate Questions (Model)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex border-b border-gray-700">
          {['easy', 'medium', 'hard'].map((difficulty) => (
            <button
              key={difficulty}
              className={`px-6 py-3 text-sm font-medium capitalize ${activeTab === difficulty
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:bg-gray-800'
                }`}
              onClick={() => setActiveTab(difficulty)}
            >
              {difficulty}
            </button>
          ))}
        </div>

        {isNotesPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={() => setIsNotesPopupOpen(false)}
              >
                <FiX size={20} />
              </button>
              <h3 className="text-lg font-bold mb-4 text-black">Notes</h3>
              <div className="overflow-y-auto max-h-96">
                {notes.map((note, index) => (
                  <p key={index} className="mb-2 text-gray-700">{note.notesText}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[activeTab]?.slice(0, questionCounts[activeTab]).length > 0 ? (
              questions[activeTab].slice(0, questionCounts[activeTab]).map((question) => (
                <div
                  key={question.id}
                  className="relative bg-gray-200 rounded-lg p-4 hover:ring-1 hover:ring-blue-500 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedQuestions.has(question.id)}
                    onChange={() => toggleQuestion(question.id)}
                    className="absolute top-3 left-3 w-5 h-5 accent-blue-500"
                  />
                  <div className="ml-8">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${activeTab === 'easy' ? 'bg-green-900 text-green-300' :
                      activeTab === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                      {activeTab}
                    </span>
                    <p className="mt-2 text-gray-700">{question.text}</p>
                    <button
                      className="mt-3 text-gray-500 hover:text-blue-400 flex items-center"
                      onClick={() => navigator.clipboard.writeText(question.text)}
                    >
                      <FiCopy className="mr-2" /> Copy
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-8">
                {isGenerating1 || isGenerating ? 'Generating questions...' : 'No questions found. Generate some questions!'}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-between items-center">
          <div className="text-gray-400">
            Selected: {selectedQuestions.size} questions
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedQuestions.size === 0}
            onClick={() => {
              exportToPDF(subject, semester, stream);

            }}
          >
            <FiDownload className="mr-2" /> Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperGenerator;