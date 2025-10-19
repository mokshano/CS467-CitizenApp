import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectsView from '../views/ProjectsView';
import ProjectInputsView from '../views/ProjectInputsView';
import UsersView from '../views/UsersView';

// Wrapper expects props passed from parent (state + handlers)
const AppRoutes = (props) => {
  return (
    <Routes>
      <Route path="/projects" element={<ProjectsView {...props} fetchProjects={props.fetchProjects} deleteProject={props.deleteProject} />} />
      <Route path="/inputs" element={<ProjectInputsView {...props} editingInput={props.editingInput} editingData={props.editingData} startEditInput={props.startEditInput} cancelEditInput={props.cancelEditInput} handleEditDynamicChange={props.handleEditDynamicChange} updateProjectInput={props.updateProjectInput} deleteProjectInput={props.deleteProjectInput} updatingInput={props.updatingInput} />} />
      {/* Users route hidden */}
      <Route path="/" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
};

export default AppRoutes;
