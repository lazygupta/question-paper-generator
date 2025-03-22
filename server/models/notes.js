const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    semester: String,
    stream: String,
    subject: String,
    notesText: String,
    filePath: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notes', NotesSchema);
