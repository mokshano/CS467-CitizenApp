const mongoose = require('mongoose');

// Stores a submission (input set) for a given Project
// data: dynamic key/value pairs based on Project.fields definitions
const projectInputSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  data: { type: Object, default: {} },
  submittedBy: { type: String, trim: true } // could later reference User
}, { timestamps: true });

module.exports = mongoose.model('ProjectInput', projectInputSchema);
