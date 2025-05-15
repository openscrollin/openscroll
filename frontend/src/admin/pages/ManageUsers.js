import React, { useEffect, useState } from 'react';

function ManageUsers() {
  const [activeTab, setActiveTab] = useState('readers');
  const [readers, setReaders] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint =
      activeTab === 'readers'
        ? 'http://localhost:5002/api/admin/readers'
        : 'http://localhost:5002/api/admin/writers';

    setLoading(true);
    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (activeTab === 'readers') {
          setReaders(data);
        } else {
          setWriters(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, [activeTab]);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Nunito Sans',
    marginTop: '1rem',
  };

  const thTd = {
    border: '1px solid #e5e7eb',
    padding: '0.75rem',
    textAlign: 'left',
    fontSize: '0.95rem',
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
  };

  const tabBtn = {
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  };

  const activeBtn = {
    ...tabBtn,
    background: '#2C9CF0',
    color: '#fff',
    borderColor: '#2C9CF0',
  };

  const currentUsers = activeTab === 'readers' ? readers : writers;

  return (
    <div>
      <h1 style={headingStyle}>Manage Users</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('readers')}
          style={activeTab === 'readers' ? activeBtn : tabBtn}
        >
          📘 Readers
        </button>
        <button
          onClick={() => setActiveTab('writers')}
          style={activeTab === 'writers' ? activeBtn : tabBtn}
        >
          ✍️ Writers
        </button>
      </div>

      {loading ? (
        <p>Loading {activeTab}...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTd}>Name</th>
              <th style={thTd}>Email</th>
              <th style={thTd}>Registered</th>
              <th style={thTd}>
                {activeTab === 'writers' ? 'Articles' : 'Purchases'}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td style={thTd}>{user.fullName || '—'}</td>
                <td style={thTd}>{user.email}</td>
                <td style={thTd}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={thTd}>{user.count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUsers;
