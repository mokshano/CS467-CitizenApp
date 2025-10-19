import axios from 'axios';

export const initInputsState = () => ({
  inputClassCode: '',
  selectedProject: null,
  projectInputs: {},
  submittedBy: '',
  inputsList: [],
  inputsLoading: false,
  editingInput: null,
  editingData: {},
  updatingInput: false
});

export function projectInputsHandlers(setInputsState) {
  const fetchProjectInputs = async (projectId) => {
    if (!projectId) return;
    setInputsState(s => ({ ...s, inputsLoading: true }));
    try {
      const res = await axios.get(`/api/projects/${projectId}/inputs`);
      setInputsState(s => ({ ...s, inputsList: res.data }));
    } catch {
      setInputsState(s => ({ ...s, inputsList: [] }));
    } finally {
      setInputsState(s => ({ ...s, inputsLoading: false }));
    }
  };

  const initializeProjectInputs = (proj) => {
    const initInputs = {};
    proj.fields.forEach(f => { initInputs[f.name] = f.type === 'checkbox' && f.options.length === 0 ? false : (f.type === 'checkbox' ? [] : ''); });
    setInputsState(s => ({ ...s, projectInputs: initInputs }));
    fetchProjectInputs(proj._id);
  };

  const selectProjectByClassCode = (projects, inputClassCode) => {
    const proj = projects.find(p => p.classCode.toLowerCase() === inputClassCode.trim().toLowerCase());
    setInputsState(s => ({ ...s, selectedProject: proj || null }));
    if (proj) initializeProjectInputs(proj);
  };

  const handleDynamicInputChange = (field, e) => {
    setInputsState(s => {
      const current = { ...s.projectInputs };
      if (field.type === 'checkbox' && field.options.length === 0) {
        current[field.name] = e.target.checked;
      } else if (field.type === 'checkbox' && field.options.length > 0) {
        const value = e.target.value;
        const arr = Array.isArray(current[field.name]) ? current[field.name] : [];
        const exists = arr.includes(value);
        current[field.name] = exists ? arr.filter(v => v !== value) : [...arr, value];
      } else {
        current[field.name] = e.target.value;
      }
      return { ...s, projectInputs: current };
    });
  };

  const submitProjectInputs = async (selectedProject, projectInputs, submittedBy, refresh) => {
    if (!selectedProject) return;
    try {
      await axios.post(`/api/projects/${selectedProject._id}/inputs`, { data: projectInputs, submittedBy: submittedBy || 'anonymous' });
      if (refresh) refresh(selectedProject);
      setInputsState(s => ({ ...s, submittedBy: '' }));
    } catch (err) {
      alert('Failed to submit: ' + (err.response?.data?.error || err.message));
    }
  };

  const startEditInput = (input) => {
    setInputsState(s => ({ ...s, editingInput: input, editingData: { ...input.data }, updatingInput: false }));
  };

  const cancelEditInput = () => {
    setInputsState(s => ({ ...s, editingInput: null, editingData: {}, updatingInput: false }));
  };

  const handleEditDynamicChange = (field, e) => {
    setInputsState(s => {
      const current = { ...s.editingData };
      if (field.type === 'checkbox' && field.options.length === 0) {
        current[field.name] = e.target.checked;
      } else if (field.type === 'checkbox' && field.options.length > 0) {
        const value = e.target.value;
        const arr = Array.isArray(current[field.name]) ? current[field.name] : [];
        const exists = arr.includes(value);
        current[field.name] = exists ? arr.filter(v => v !== value) : [...arr, value];
      } else {
        current[field.name] = e.target.value;
      }
      return { ...s, editingData: current };
    });
  };

  const updateProjectInput = async (selectedProject, editingInput, editingData, after) => {
    if (!selectedProject || !editingInput) return;
    setInputsState(s => ({ ...s, updatingInput: true }));
    try {
      await axios.put(`/api/projects/${selectedProject._id}/inputs/${editingInput._id}`, { data: editingData, submittedBy: editingInput.submittedBy });
      await fetchProjectInputs(selectedProject._id);
      if (after) after();
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setInputsState(s => ({ ...s, updatingInput: false }));
    }
  };

  const deleteProjectInput = async (selectedProject, id) => {
    if (!selectedProject || !id) return;
    if (!window.confirm('Delete this submission?')) return;
    setInputsState(s => ({ ...s, updatingInput: true }));
    try {
      await axios.delete(`/api/projects/${selectedProject._id}/inputs/${id}`);
      await fetchProjectInputs(selectedProject._id);
      cancelEditInput();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setInputsState(s => ({ ...s, updatingInput: false }));
    }
  };

  return { fetchProjectInputs, initializeProjectInputs, selectProjectByClassCode, handleDynamicInputChange, submitProjectInputs, startEditInput, cancelEditInput, handleEditDynamicChange, updateProjectInput, deleteProjectInput };
}
