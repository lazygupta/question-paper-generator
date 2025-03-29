const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
    }
})

module.exports = mongoose.model('Admin', AdminSchema);