import React from 'react';

const UsersView = ({ users, form, loading, handleChange, handleSubmit, deleteUser }) => {
  return (
    <>
      <section className="mb-4">
        <h2 className="h4">Users</h2>
        {users.length === 0 && <p className="text-muted">No users loaded.</p>}
        <ul className="list-group">
          {users.map(u => (
            <li key={u._id || u.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span><strong>{u.name}</strong> – {u.email}</span>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(u._id || u.id)} disabled={loading}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="h4">Add User</h2>
        <form onSubmit={handleSubmit} className="row g-2 align-items-end">
          <div className="col-sm-5"><input className="form-control" name="name" placeholder="Name" value={form.name} onChange={handleChange} /></div>
          <div className="col-sm-5"><input className="form-control" name="email" placeholder="Email" value={form.email} onChange={handleChange} /></div>
          <div className="col-sm-2"><button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Saving...' : 'Add'}</button></div>
        </form>
      </section>
    </>
  );
};

export default UsersView;
