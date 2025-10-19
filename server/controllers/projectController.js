const Project = require('../models/Project');

exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, instructions, classCode, fields } = req.body;
    if (!title || !classCode) return res.status(400).json({ error: 'title and classCode required' });
    const project = await Project.create({ title, description, instructions, classCode, fields });
    res.status(201).json(project);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'classCode must be unique' });
    res.status(500).json({ error: 'Failed to create project' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description, instructions, classCode, fields } = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, instructions, classCode, fields },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'classCode must be unique' });
    res.status(500).json({ error: 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
