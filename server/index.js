const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Controllers
const userController = require('./controllers/userController');
const projectController = require('./controllers/projectController');
const projectInputController = require('./controllers/projectInputController');

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: '' });
});

// User routes
app.get('/api/users', userController.listUsers);
app.post('/api/users', userController.createUser);
app.delete('/api/users/:id', userController.deleteUser);

// Project routes
app.get('/api/projects', projectController.listProjects);
app.post('/api/projects', projectController.createProject);
app.get('/api/projects/:id', projectController.getProject);
app.put('/api/projects/:id', projectController.updateProject);
app.delete('/api/projects/:id', projectController.deleteProject);

// Project Input routes (nested under project)
app.get('/api/projects/:projectId/inputs', projectInputController.listInputs);
app.post('/api/projects/:projectId/inputs', projectInputController.createInput);
app.get('/api/projects/:projectId/inputs/:inputId', projectInputController.getInput);
app.put('/api/projects/:projectId/inputs/:inputId', projectInputController.updateInput);
app.delete('/api/projects/:projectId/inputs/:inputId', projectInputController.deleteInput);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    // If request starts with /api keep default 404 for unknown API endpoints
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
