// testing frontend build job
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { isValidName } = require('./utils');   // ← NAYI LINE

const app = express();
app.use(cors());
app.use(express.json());
// testing job outputs and docker tagging

// testing docker build job

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB Connected! ✅'))
    .catch((err) => console.log('Connection Error:', err));

const studentSchema = new mongoose.Schema({
    // testing caching and timeout optimization
    name: String,
    presentOn: { type: Date, default: Date.now }
});
const Student = mongoose.model('Student', studentSchema);

app.post('/mark-present', async (req, res) => {
    if (!isValidName(req.body.name)) {                    // ← NAYI LINE
        return res.status(400).json({ error: 'Name is required' });  // ← NAYI LINE
    }
    const student = await Student.create({ name: req.body.name });
    res.json(student);
});

app.get('/attendance', async (req, res) => {
    const allRecords = await Student.find().sort({ presentOn: -1 });
    res.json(allRecords);
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});