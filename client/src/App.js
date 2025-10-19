import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ProjectsView from './views/ProjectsView';
import ProjectInputsView from './views/ProjectInputsView';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import AppRoutes from './routing/AppRoutes';
import UsersView from './views/UsersView';
import { initUsersState, usersHandlers } from './controllers/usersController';
import { initProjectsState, projectsHandlers } from './controllers/projectsController';
import { initInputsState, projectInputsHandlers } from './controllers/projectInputsController';

function App() {
  const [message, setMessage] = useState('');

  const [usersState, setUsersState] = useState(initUsersState());
  const [projectsState, setProjectsState] = useState(initProjectsState());
  const [inputsState, setInputsState] = useState(initInputsState());

  const { fetchUsers, handleChange, handleSubmit, createUser, deleteUser } = usersHandlers(setUsersState);
  const { fetchProjects, handleProjectFormChange, handleFieldFormChange, addFieldToProject, startEdit, cancelEdit, updateProject, removeField } = projectsHandlers(setProjectsState);
  const { fetchProjectInputs, initializeProjectInputs, selectProjectByClassCode, handleDynamicInputChange, submitProjectInputs } = projectInputsHandlers(setInputsState);

  const { users, form, loading } = usersState;
  const { projects, projectLoading, projectForm, fieldForm, creatingProject, editingProject } = projectsState;
  const { inputClassCode, selectedProject, projectInputs, submittedBy, inputsList, inputsLoading, editingInput, editingData, updatingInput } = inputsState;

  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const createProject = e => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.classCode) return;
    setProjectsState(s => ({ ...s, creatingProject: true }));
    axios.post('/api/projects', projectForm)
      .then(() => {
        setProjectsState(s => ({ ...s, projectForm: { title: '', description: '', instructions: '', classCode: '', fields: [] } }));
        fetchProjects();
      })
      .finally(() => setProjectsState(s => ({ ...s, creatingProject: false })));
  };

  const selectProjectByClassCodeWrapper = () => selectProjectByClassCode(projects, inputClassCode);
  const initializeProjectInputsWrapper = (proj) => initializeProjectInputs(proj);
  const submitProjectInputsWrapper = e => {
    e.preventDefault();
    submitProjectInputs(selectedProject, projectInputs, submittedBy, initializeProjectInputsWrapper);
  };

  const openNewProjectModal = () => {
    cancelEdit();
    setProjectsState(s => ({ ...s, projectForm: { title: '', description: '', instructions: '', classCode: '', fields: [] } }));
    setProjectModalOpen(true);
  };
  const openEditProjectModal = (proj) => { startEdit(proj); setProjectModalOpen(true); };
  const closeProjectModal = () => { setProjectModalOpen(false); cancelEdit(); };

  const location = useLocation?.();

  useEffect(() => {
    axios.get('/api').then(r => setMessage(r.data.message)).catch(() => setMessage('API not reachable'));
    fetchUsers();
    fetchProjects();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Citizen Science App for Kids</h1>
      <p className="alert alert-info">Status: {message}</p>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item"><Link className={`nav-link ${location?.pathname === '/projects' ? 'active' : ''}`} to="/projects">Projects</Link></li>
        <li className="nav-item"><Link className={`nav-link ${location?.pathname === '/inputs' ? 'active' : ''}`} to="/inputs">Project Inputs</Link></li>
        {/* Users tab hidden */}
      </ul>

      <AppRoutes
        users={users}
        form={form}
        loading={loading}
        handleChange={handleChange}
        handleUserSubmit={(e) => { e.preventDefault(); if (!form.name || !form.email) return; createUser(form); }}
        deleteUser={deleteUser}
        projectModalOpen={projectModalOpen}
        openNewProjectModal={openNewProjectModal}
        openEditProjectModal={openEditProjectModal}
        closeProjectModal={closeProjectModal}
        projects={projects}
        projectLoading={projectLoading}
        editingProject={editingProject}
        projectForm={projectForm}
        fieldForm={fieldForm}
        creatingProject={creatingProject}
        startEdit={openEditProjectModal}
        createProject={createProject}
        updateProject={(e) => { e.preventDefault(); updateProject(editingProject, projectForm); }}
        cancelEdit={cancelEdit}
        handleProjectFormChange={handleProjectFormChange}
        handleFieldFormChange={handleFieldFormChange}
        addFieldToProject={addFieldToProject}
        removeField={removeField}
        fetchProjects={fetchProjects}
        deleteProject={(id) => { if (window.confirm('Delete this project?')) projectsHandlers(setProjectsState).deleteProject(id); }}
        selectedProject={selectedProject}
        inputClassCode={inputClassCode}
        submittedBy={submittedBy}
        projectInputs={projectInputs}
        inputsList={inputsList}
        inputsLoading={inputsLoading}
        initializeProjectInputs={initializeProjectInputsWrapper}
        setSelectedProject={(proj) => setInputsState(s => ({ ...s, selectedProject: proj }))}
        setInputClassCode={(val) => setInputsState(s => ({ ...s, inputClassCode: val }))}
        setSubmittedBy={(val) => setInputsState(s => ({ ...s, submittedBy: val }))}
        setProjectInputs={(obj) => setInputsState(s => ({ ...s, projectInputs: obj }))}
        handleDynamicInputChange={handleDynamicInputChange}
        submitProjectInputs={submitProjectInputsWrapper}
        selectProjectByClassCode={selectProjectByClassCodeWrapper}
        editingInput={editingInput}
        editingData={editingData}
        startEditInput={(inp) => projectInputsHandlers(setInputsState).startEditInput(inp)}
        cancelEditInput={() => projectInputsHandlers(setInputsState).cancelEditInput()}
        handleEditDynamicChange={(field,e) => projectInputsHandlers(setInputsState).handleEditDynamicChange(field,e)}
        updateProjectInput={(selectedProject, editingInput, editingData, after) => projectInputsHandlers(setInputsState).updateProjectInput(selectedProject, editingInput, editingData, after)}
        deleteProjectInput={(selectedProject, id) => projectInputsHandlers(setInputsState).deleteProjectInput(selectedProject, id)}
        updatingInput={updatingInput}
      />
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
