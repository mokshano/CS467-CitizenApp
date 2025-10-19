const Project = require('../models/Project');
const ProjectInput = require('../models/ProjectInput');

// List all inputs for a project
exports.listInputs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const inputs = await ProjectInput.find({ project: projectId }).sort({ createdAt: -1 });
    res.json(inputs);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch project inputs' });
  }
};

// Create new input set based on project fields
exports.createInput = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const submitted = req.body.data || {}; // expecting { data: { fieldName: value }, submittedBy }
    const submittedBy = req.body.submittedBy || 'anonymous';

    // Basic validation: ensure required fields present
    const missing = project.fields.filter(f => f.required && (submitted[f.name] === undefined || submitted[f.name] === ''));
    if (missing.length) return res.status(400).json({ error: 'Missing required fields', fields: missing.map(m => m.name) });

    const input = await ProjectInput.create({ project: project._id, data: submitted, submittedBy });
    res.status(201).json(input);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create project input' });
  }
};

// Get single input
exports.getInput = async (req, res) => {
  try {
    const input = await ProjectInput.findById(req.params.inputId);
    if (!input) return res.status(404).json({ error: 'Input not found' });
    res.json(input);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch input' });
  }
};

// Update input
exports.updateInput = async (req, res) => {
  try {
    const input = await ProjectInput.findById(req.params.inputId);
    if (!input) return res.status(404).json({ error: 'Input not found' });

    const project = await Project.findById(input.project);
    if (!project) return res.status(404).json({ error: 'Parent project missing' });

    const submitted = req.body.data || {};
    const submittedBy = req.body.submittedBy || input.submittedBy || 'anonymous';
    const missing = project.fields.filter(f => f.required && (submitted[f.name] === undefined || submitted[f.name] === ''));
    if (missing.length) return res.status(400).json({ error: 'Missing required fields', fields: missing.map(m => m.name) });

    input.data = submitted;
    input.submittedBy = submittedBy;
    await input.save();
    res.json(input);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update input' });
  }
};

// Delete input
exports.deleteInput = async (req, res) => {
  try {
    const deleted = await ProjectInput.findByIdAndDelete(req.params.inputId);
    if (!deleted) return res.status(404).json({ error: 'Input not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete input' });
  }
};
