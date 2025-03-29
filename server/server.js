const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios')
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL)
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

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});