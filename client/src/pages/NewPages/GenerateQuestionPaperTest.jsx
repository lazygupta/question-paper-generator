import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiCopy, FiCheckSquare, FiDownload, FiChevronDown, FiX } from 'react-icons/fi';
import jsPDF from "jspdf";

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
  const [isFetching, setIsFetching] = useState(false);
  const [isNotesPopupOpen, setIsNotesPopupOpen] = useState(false);
const maxLimits = {
    easy: 6,
    medium: 8,
    hard: 10
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
    const currentMax = Math.min(maxLimits[difficulty], questions[difficulty].length);
    setQuestionCounts(prev => ({
      ...prev,
      [difficulty]: Math.max(0, Math.min(newValue, currentMax))
    }));
  };
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Question Paper", 105, 20, { align: "center" });

    let yPosition = 30;
    Array.from(selectedQuestions).forEach((questionId, index) => {
      const question = questions.easy
        .concat(questions.medium, questions.hard)
        .find((q) => q.id === questionId);

      if (question) {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${question.text}`, 10, yPosition, { maxWidth: 190 });
        yPosition += 10;
      }

      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("Question_Paper.pdf");
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
                easy: 6,
                medium: 8,
                hard: 10
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
    <div className="flex h-screen bg-gray-100 text-gray-200">
      {/* Left Sidebar */}
      <div className="w-72 bg-gray-100 p-6 border-r border-gray-700 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-blue-400">Question Filters</h2>

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
              className="w-full bg-green-600 hover:scale-105 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
              onClick={generateQuestions}
            >
              {isGenerating ? 'Generating...' : 'Generate Questions'}
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
                {isGenerating ? 'Generating questions...' : 'No questions found. Generate some questions!'}
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
            onClick={exportToPDF}
          >
            <FiDownload className="mr-2" /> Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperGenerator;