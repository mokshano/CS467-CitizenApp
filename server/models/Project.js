const mongoose = require('mongoose');

const projectFieldSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['text','textarea','date','checkbox','radio'] },
  label: { type: String, trim: true },
  required: { type: Boolean, default: false },
  options: [{ type: String, trim: true }],
  defaultValue: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  instructions: { type: String, trim: true },
  classCode: { type: String, required: true, unique: true, trim: true },
  fields: [projectFieldSchema]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
