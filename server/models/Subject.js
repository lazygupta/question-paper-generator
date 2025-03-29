const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subjectName: String,
    subjectCode: String,
    subjectfullName: String,
    courseOutcome: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', SubjectSchema);