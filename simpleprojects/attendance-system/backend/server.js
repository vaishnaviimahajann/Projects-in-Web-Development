const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB se connect
mongoose.connect('mongodb://mongodb:27017/attendancedb')
    .then(() => console.log('MongoDB Connected! ✅'))
    .catch((err) => console.log('Connection Error:', err));

// Schema banayo
const studentSchema = new mongoose.Schema({
    name: String,
    presentOn: { type: Date, default: Date.now }
});
const Student = mongoose.model('Student', studentSchema);

// Route 1 — Naya student mark karo present
app.post('/mark-present', async (req, res) => {
    const student = await Student.create({ name: req.body.name });
    res.json(student);
});

// Route 2 — Saari attendance list dikhao
app.get('/attendance', async (req, res) => {
    const allRecords = await Student.find().sort({ presentOn: -1 });
    res.json(allRecords);
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});