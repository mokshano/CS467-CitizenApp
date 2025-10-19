import axios from 'axios';

export const initProjectsState = () => ({
  projects: [],
  projectLoading: false,
  projectForm: { title: '', description: '', instructions: '', classCode: '', fields: [] },
  fieldForm: { name: '', type: 'text', label: '', required: false, options: '' },
  creatingProject: false,
  editingProject: null
});

export function projectsHandlers(setProjectsState) {
  const fetchProjects = async () => {
    setProjectsState(s => ({ ...s, projectLoading: true }));
    try {
      const res = await axios.get('/api/projects');
      setProjectsState(s => ({ ...s, projects: res.data }));
    } catch {
      setProjectsState(s => ({ ...s, projects: [] }));
    } finally {
      setProjectsState(s => ({ ...s, projectLoading: false }));
    }
  };

  const handleProjectFormChange = e => {
    const { name, value } = e.target;
    setProjectsState(s => ({ ...s, projectForm: { ...s.projectForm, [name]: value } }));
  };

  const handleFieldFormChange = e => {
    const { name, value, type, checked } = e.target;
    setProjectsState(s => ({ ...s, fieldForm: { ...s.fieldForm, [name]: type === 'checkbox' ? checked : value } }));
  };

  const addFieldToProject = e => {
    e.preventDefault();
    setProjectsState(s => {
      if (!s.fieldForm.name) return s;
      const field = {
        name: s.fieldForm.name.trim(),
        type: s.fieldForm.type,
        label: s.fieldForm.label.trim() || s.fieldForm.name,
        required: s.fieldForm.required,
        options: s.fieldForm.type === 'radio' || s.fieldForm.type === 'checkbox' ? s.fieldForm.options.split(',').map(o => o.trim()).filter(Boolean) : []
      };
      return { ...s, projectForm: { ...s.projectForm, fields: [...s.projectForm.fields, field] }, fieldForm: { name: '', type: 'text', label: '', required: false, options: '' } };
    });
  };

  const createProject = async (after) => {
    setProjectsState(s => ({ ...s, creatingProject: true }));
    try {
      const { projectForm } = await new Promise(resolve => resolve());
    } catch {}
  };

  const performCreate = async (projectForm, after, setProjectsStateRef) => {
    if (!projectForm.title || !projectForm.classCode) return;
    try {
      await axios.post('/api/projects', projectForm);
      setProjectsStateRef(s => ({ ...s, projectForm: { title: '', description: '', instructions: '', classCode: '', fields: [] } }));
      await fetchProjects();
      if (after) after();
    } finally {
      setProjectsStateRef(s => ({ ...s, creatingProject: false }));
    }
  };

  const startEdit = proj => {
    setProjectsState(s => ({ ...s, editingProject: proj, projectForm: { title: proj.title, description: proj.description || '', instructions: proj.instructions || '', classCode: proj.classCode, fields: proj.fields.map(f => ({ ...f })) } }));
  };

  const cancelEdit = () => {
    setProjectsState(s => ({ ...s, editingProject: null, projectForm: { title: '', description: '', instructions: '', classCode: '', fields: [] } }));
  };

  const updateProject = async (editingProject, projectForm) => {
    if (!editingProject) return;
    setProjectsState(s => ({ ...s, creatingProject: true }));
    try {
      await axios.put(`/api/projects/${editingProject._id}`, projectForm);
      cancelEdit();
      await fetchProjects();
    } finally {
      setProjectsState(s => ({ ...s, creatingProject: false }));
    }
  };

  const removeField = i => {
    setProjectsState(s => ({ ...s, projectForm: { ...s.projectForm, fields: s.projectForm.fields.filter((_, idx) => idx !== i) } }));
  };

  const deleteProject = async (id) => {
    if (!id) return;
    setProjectsState(s => ({ ...s, projectLoading: true }));
    try {
      await axios.delete(`/api/projects/${id}`);
      await fetchProjects();
    } finally {
      setProjectsState(s => ({ ...s, projectLoading: false }));
    }
  };

  return { fetchProjects, handleProjectFormChange, handleFieldFormChange, addFieldToProject, createProject, performCreate, startEdit, cancelEdit, updateProject, removeField, deleteProject };
}
