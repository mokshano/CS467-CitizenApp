import React from 'react';

const ProjectInputsView = ({ projects, selectedProject, inputClassCode, submittedBy, projectInputs, inputsList, inputsLoading, initializeProjectInputs, setSelectedProject, setInputClassCode, setSubmittedBy, setProjectInputs, handleDynamicInputChange, submitProjectInputs, selectProjectByClassCode, editingInput, editingData, startEditInput, cancelEditInput, handleEditDynamicChange, updateProjectInput, deleteProjectInput, updatingInput }) => {
  return (
    <div>
      <h2 className="h4 mb-3">Project Inputs</h2>
      <div className="row g-3 mb-3 align-items-end">
        <div className="col-sm-4"><input className="form-control" placeholder="Class code" value={inputClassCode} onChange={e => setInputClassCode(e.target.value)} /></div>
        <div className="col-sm-2"><button className="btn btn-outline-primary w-100" onClick={selectProjectByClassCode}>Load</button></div>
        <div className="col-sm-6">
          <select className="form-select" value={selectedProject?._id || ''} onChange={e => {
            const proj = projects.find(p => p._id === e.target.value);
            setSelectedProject(proj || null);
            if (proj) {
              initializeProjectInputs(proj);
              setInputClassCode(proj.classCode);
            }
          }}>
            <option value="">Select by title...</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>
      </div>

      {selectedProject && (
        <div className="row g-4">
          <div className="col-lg-6">
            <form onSubmit={submitProjectInputs} className="border rounded p-3">
              <h5 className="mb-3">{selectedProject.title} <span className="badge text-bg-info ms-2">{selectedProject.classCode}</span></h5>
              {selectedProject.instructions && <div className="alert alert-secondary"><small>{selectedProject.instructions}</small></div>}
              <div className="mb-3">
                <input className="form-control" placeholder="Your name" value={submittedBy} onChange={e => setSubmittedBy(e.target.value)} />
              </div>
              <div className="row g-3">
                {selectedProject.fields.map(field => {
                  const isFloating = ['text','textarea','date'].includes(field.type);
                  if (isFloating) {
                    return (
                      <div key={field.name} className="col-12 floating-label-wrapper">
                        <label className="form-label floating-label">{field.label}{field.required && ' *'}</label>
                        {field.type === 'text' && (<input className="form-control" placeholder=" " value={projectInputs[field.name] || ''} onChange={e => handleDynamicInputChange(field,e)} />)}
                        {field.type === 'textarea' && (<textarea className="form-control" placeholder=" " rows={3} value={projectInputs[field.name] || ''} onChange={e => handleDynamicInputChange(field,e)} />)}
                        {field.type === 'date' && (<input type="date" className="form-control" placeholder=" " value={projectInputs[field.name] || ''} onChange={e => handleDynamicInputChange(field,e)} />)}
                      </div>
                    );
                  }
                  // Non-floating types (checkbox/radio groups)
                  return (
                    <div key={field.name} className="col-12">
                      <label className="form-label">{field.label}{field.required && ' *'}</label>
                      {field.type === 'checkbox' && field.options.length === 0 && (
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" checked={!!projectInputs[field.name]} onChange={e => handleDynamicInputChange(field,e)} id={`chk_${field.name}`} />
                          <label className="form-check-label" htmlFor={`chk_${field.name}`}>{field.label}</label>
                        </div>
                      )}
                      {field.type === 'checkbox' && field.options.length > 0 && (
                        <div>
                          {field.options.map(opt => (
                            <div className="form-check form-check-inline" key={opt}>
                              <input type="checkbox" className="form-check-input" value={opt} checked={Array.isArray(projectInputs[field.name]) && projectInputs[field.name].includes(opt)} onChange={e => handleDynamicInputChange(field,e)} id={`chk_${field.name}_${opt}`} />
                              <label className="form-check-label" htmlFor={`chk_${field.name}_${opt}`}>{opt}</label>
                            </div>
                          ))}
                        </div>
                      )}
                      {field.type === 'radio' && (
                        <div>
                          {field.options.map(opt => (
                            <div className="form-check form-check-inline" key={opt}>
                              <input type="radio" name={field.name} className="form-check-input" value={opt} checked={projectInputs[field.name] === opt} onChange={e => handleDynamicInputChange(field,e)} id={`rad_${field.name}_${opt}`} />
                              <label className="form-check-label" htmlFor={`rad_${field.name}_${opt}`}>{opt}</label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-end"><button type="submit" className="btn btn-success">Submit Inputs</button></div>
            </form>
          </div>
          <div className="col-lg-6">
            <div className="border rounded p-3 h-100">
              <h5 className="mb-3">Submitted Inputs</h5>
              {inputsLoading && <p className="text-muted">Loading...</p>}
              {!inputsLoading && inputsList.length === 0 && <p className="text-muted">No submissions yet.</p>}
              <ul className="list-group small">
                {inputsList.map(inp => (
                  <li key={inp._id} className="list-group-item">
                    {editingInput && editingInput._id === inp._id ? (
                      <form onSubmit={(e) => { e.preventDefault(); updateProjectInput(selectedProject, editingInput, editingData, cancelEditInput); }}>
                        <div className="d-flex justify-content-between mb-2">
                          <strong>Editing: {inp.submittedBy || 'anonymous'}</strong>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-sm btn-primary" disabled={updatingInput}>{updatingInput ? 'Saving...' : 'Save'}</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={cancelEditInput} disabled={updatingInput}>Cancel</button>
                          </div>
                        </div>
                        <div className="row g-2">
                          {selectedProject.fields.map(field => (
                            <div key={field.name} className="col-12">
                              <label className="form-label mb-1">{field.label}{field.required && ' *'}</label>
                              {field.type === 'text' && (<input className="form-control form-control-sm" value={editingData[field.name] || ''} onChange={e => handleEditDynamicChange(field,e)} />)}
                              {field.type === 'textarea' && (<textarea className="form-control form-control-sm" rows={2} value={editingData[field.name] || ''} onChange={e => handleEditDynamicChange(field,e)} />)}
                              {field.type === 'date' && (<input type="date" className="form-control form-control-sm" value={editingData[field.name] || ''} onChange={e => handleEditDynamicChange(field,e)} />)}
                              {field.type === 'checkbox' && field.options.length === 0 && (
                                <div className="form-check">
                                  <input type="checkbox" className="form-check-input" checked={!!editingData[field.name]} onChange={e => handleEditDynamicChange(field,e)} id={`edit_chk_${field.name}`} />
                                  <label className="form-check-label" htmlFor={`edit_chk_${field.name}`}>{field.label}</label>
                                </div>
                              )}
                              {field.type === 'checkbox' && field.options.length > 0 && (
                                <div>
                                  {field.options.map(opt => (
                                    <div className="form-check form-check-inline" key={opt}>
                                      <input type="checkbox" className="form-check-input" value={opt} checked={Array.isArray(editingData[field.name]) && editingData[field.name].includes(opt)} onChange={e => handleEditDynamicChange(field,e)} id={`edit_chk_${field.name}_${opt}`} />
                                      <label className="form-check-label" htmlFor={`edit_chk_${field.name}_${opt}`}>{opt}</label>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {field.type === 'radio' && (
                                <div>
                                  {field.options.map(opt => (
                                    <div className="form-check form-check-inline" key={opt}>
                                      <input type="radio" name={`edit_${field.name}`} className="form-check-input" value={opt} checked={editingData[field.name] === opt} onChange={e => handleEditDynamicChange(field,e)} id={`edit_rad_${field.name}_${opt}`} />
                                      <label className="form-check-label" htmlFor={`edit_rad_${field.name}_${opt}`}>{opt}</label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-end">
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteProjectInput(selectedProject, inp._id)} disabled={updatingInput}>Delete Submission</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{inp.submittedBy || 'anonymous'}</strong>
                            <div className="submitted-date">{new Date(inp.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="d-flex flex-column gap-1">
                            <span className="badge text-bg-secondary">Fields: {Object.keys(inp.data || {}).length}</span>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => startEditInput(inp)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProjectInput(selectedProject, inp._id)}>Delete</button>
                          </div>
                        </div>
                        <details className="mt-2">
                          <summary className="text-primary" style={{ cursor: 'pointer' }}>View Data</summary>
                          <ul className="mt-2 mb-0 ps-3">
                            {Object.entries(inp.data || {}).map(([k,v]) => (
                              <li key={k}><strong>{k}:</strong> {Array.isArray(v) ? v.join(', ') : String(v)}</li>
                            ))}
                          </ul>
                        </details>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectInputsView;
