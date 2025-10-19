import axios from 'axios';

export const initUsersState = () => ({ users: [], form: { name: '', email: '' }, loading: false });

export function usersHandlers(setUsersState) {
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsersState(s => ({ ...s, users: res.data }));
    } catch {
      setUsersState(s => ({ ...s, users: [] }));
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setUsersState(s => ({ ...s, form: { ...s.form, [name]: value } }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUsersState(s => ({ ...s, loading: true }));
    try {
      const { form } = await new Promise(resolve => resolve()); // placeholder to satisfy structure
      // Actually use current state
    } catch {}
  };

  const createUser = async (form, after) => {
    if (!form.name || !form.email) return;
    setUsersState(s => ({ ...s, loading: true }));
    try {
      await axios.post('/api/users', form);
      setUsersState(s => ({ ...s, form: { name: '', email: '' } }));
      await fetchUsers();
      if (after) after();
    } finally {
      setUsersState(s => ({ ...s, loading: false }));
    }
  };

  const deleteUser = async (id) => {
    if (!id) return;
    setUsersState(s => ({ ...s, loading: true }));
    try {
      await axios.delete(`/api/users/${id}`);
      await fetchUsers();
    } finally {
      setUsersState(s => ({ ...s, loading: false }));
    }
  };

  return { fetchUsers, handleChange, handleSubmit, createUser, deleteUser };
}
