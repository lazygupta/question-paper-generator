const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios')

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://lazyrabbit:lazyrabbit123@cluster0.kjmsh.mongodb.net/question-paper-generator')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(`There has been an error - ${err}`));

// authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// notes routes
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);

// admin-routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// app.use('/api/notes/generate-questions', notesRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});