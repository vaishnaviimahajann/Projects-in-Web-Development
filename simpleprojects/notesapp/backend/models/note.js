const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title:String,
    desc:String
});

module.exports = mongoose.model('Note', notesSchema);