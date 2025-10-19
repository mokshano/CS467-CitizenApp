import React from 'react';

const ProjectsView = ({ projects, projectLoading, editingProject, projectForm, fieldForm, creatingProject, startEdit, createProject, updateProject, cancelEdit, handleProjectFormChange, handleFieldFormChange, addFieldToProject, removeField, projectModalOpen, openNewProjectModal, openEditProjectModal, closeProjectModal, fetchProjects, deleteProject }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Projects</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={fetchProjects} disabled={projectLoading}>{projectLoading ? 'Refreshing...' : 'Refresh'}</button>
          <button className="btn btn-sm btn-primary" onClick={openNewProjectModal}>New Project</button>
        </div>
      </div>
      {projects.length === 0 && !projectLoading && <p className="text-muted">No projects found.</p>}
      <ul className="list-group mb-4">
        {projects.map(p => (
          <li key={p._id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <strong>{p.title}</strong> <span className="badge text-bg-info ms-2">{p.classCode}</span>
              <div className="small project-desc mb-1">{p.description}</div>
              <span className="badge text-bg-secondary project-fields-badge">Fields: {p.fields.length}</span>
            </div>
            <div className="ms-2 d-flex flex-column gap-1">
              <button className="btn btn-sm btn-outline-primary" onClick={() => openEditProjectModal(p)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProject(p._id)} disabled={projectLoading}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {projectModalOpen && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content" style={{ background: '#1b263b', border: '1px solid #324b67' }}>
              <div className="modal-header">
                <h5 className="modal-title">{editingProject ? 'Edit Project' : 'Create Project'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeProjectModal} style={{ filter: 'invert(1)' }}></button>
              </div>
              <form onSubmit={editingProject ? updateProject : createProject}>
                <div className="modal-body">
                  <div className="mb-2"><label className="form-label">Title *</label><input name="title" className="form-control" value={projectForm.title} onChange={handleProjectFormChange} /></div>
                  <div className="mb-2"><label className="form-label">Class Code * {editingProject && <span className="text-muted small">(locked)</span>}</label><input name="classCode" className="form-control" value={projectForm.classCode} onChange={handleProjectFormChange} disabled={!!editingProject} /></div>
                  <div className="mb-2"><label className="form-label">Description</label><textarea name="description" className="form-control" rows={2} value={projectForm.description} onChange={handleProjectFormChange} /></div>
                  <div className="mb-2"><label className="form-label">Instructions</label><textarea name="instructions" className="form-control" rows={3} value={projectForm.instructions} onChange={handleProjectFormChange} /></div>
                  <div className="border rounded p-2 mb-2">
                    <h6 className="mb-2">{editingProject ? 'Modify Fields' : 'Add Field'}</h6>
                    <div className="row g-2">
                      <div className="col-6"><input name="name" placeholder="Field name" className="form-control" value={fieldForm.name} onChange={handleFieldFormChange} /></div>
                      <div className="col-6">
                        <select name="type" className="form-select" value={fieldForm.type} onChange={handleFieldFormChange}>
                          <option value="text">Text</option>
                          <option value="textarea">Textarea</option>
                          <option value="date">Date</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="radio">Radio</option>
                        </select>
                      </div>
                      <div className="col-6"><input name="label" placeholder="Label" className="form-control" value={fieldForm.label} onChange={handleFieldFormChange} /></div>
                      <div className="col-6 d-flex align-items-center">
                        <div className="form-check ms-1">
                          <input className="form-check-input" type="checkbox" name="required" checked={fieldForm.required} onChange={handleFieldFormChange} id="requiredCheck" />
                          <label className="form-check-label" htmlFor="requiredCheck">Required</label>
                        </div>
                      </div>
                      {(fieldForm.type === 'radio' || fieldForm.type === 'checkbox') && (<div className="col-12"><input name="options" placeholder="Comma separated options" className="form-control" value={fieldForm.options} onChange={handleFieldFormChange} /></div>)}
                    </div>
                    <div className="mt-2 d-flex justify-content-between align-items-center">
                      <button className="btn btn-sm btn-secondary" onClick={addFieldToProject} disabled={!fieldForm.name} type="button">Add Field</button>
                      {editingProject && <span className="small text-muted">Remove unwanted fields below</span>}
                    </div>
                    {projectForm.fields.length > 0 && (
                      <ul className="list-group list-group-flush mt-2" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        {projectForm.fields.map((f,i) => (
                          <li key={i} className="list-group-item small d-flex justify-content-between align-items-center">
                            <span>{f.name} <span className="text-muted">({f.type}{f.required ? ', required' : ''})</span></span>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeField(i)}>&times;</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={creatingProject}>{creatingProject ? (editingProject ? 'Saving...' : 'Creating...') : (editingProject ? 'Save Changes' : 'Create Project')}</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={closeProjectModal} disabled={creatingProject}>Close</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
