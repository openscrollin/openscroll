import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';

function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5002/api/admin/articles', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching articles:', err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this article?');
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5002/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
      });
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const res = await fetch(`http://localhost:5002/api/admin/articles/feature/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('openscroll_admin_token')}`,
        },
      });
      const updated = await res.json();
      setArticles((prev) =>
        prev.map((a) => (a._id === id ? { ...a, featured: updated.featured } : a))
      );
    } catch (err) {
      console.error('Feature toggle error:', err);
    }
  };

  const filtered = articles.filter((article) => {
    const matchSearch = article.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || article.category === category;
    return matchSearch && matchCategory;
  });

  const categories = ['All', ...new Set(articles.map((a) => a.category))];

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

  const actionBtn = {
    padding: '0.3rem 0.6rem',
    marginRight: '0.5rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  };

  const inputStyle = {
    padding: '0.5rem',
    marginRight: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  return (
    <div>
      <h1 style={headingStyle}>Manage Articles</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader type="articles" message="Loading articles..." />
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTd}>Title</th>
              <th style={thTd}>Author</th>
              <th style={thTd}>Price</th>
              <th style={thTd}>Category</th>
              <th style={thTd}>Featured</th>
              <th style={thTd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((article) => (
              <tr key={article._id}>
                <td style={thTd}>{article.title}</td>
                <td style={thTd}>{article.authorFullName || article.authorEmail}</td>
                <td style={thTd}>{article.price === '0' ? 'Free' : `₹${article.price}`}</td>
                <td style={thTd}>{article.category}</td>
                <td style={thTd}>{article.featured ? '✅' : '❌'}</td>
                <td style={thTd}>
                  <button
                    style={{ ...actionBtn, backgroundColor: '#3b82f6', color: '#fff' }}
                    onClick={() => window.open(`/articles/${article._id}`, '_blank')}
                  >
                    View
                  </button>
                  <button
                    style={{ ...actionBtn, backgroundColor: '#10b981', color: '#fff' }}
                    onClick={() => toggleFeatured(article._id)}
                  >
                    {article.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    style={{ ...actionBtn, backgroundColor: '#ef4444', color: '#fff' }}
                    onClick={() => handleDelete(article._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageArticles;
