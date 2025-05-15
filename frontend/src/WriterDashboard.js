import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function WriterDashboard() {
  const navigate = useNavigate();
  const [currentWriter, setCurrentWriter] = useState(null);
  const [articles, setArticles] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const writer = JSON.parse(localStorage.getItem('openscroll_current_user'));
    const token = localStorage.getItem('writerToken');

    if (!writer || !token || writer.role !== 'writer') {
      navigate('/writer/login');
      return;
    }

    setCurrentWriter(writer);

    fetch(`http://localhost:5002/api/writer/earnings/${writer.email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles || []);
        setEarnings(data.totalEarnings || 0);

        const monthly = {};
        data.articles.forEach((a) => {
          const month = new Date(a.createdAt).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          });
          const value = Number(a.articleEarnings) || 0;
          monthly[month] = (monthly[month] || 0) + value;
        });

        const chartFormatted = Object.entries(monthly).map(([month, total]) => ({
          month,
          earnings: total,
        }));

        setChartData(chartFormatted);
      })
      .catch((err) => {
        console.error('Error fetching dashboard:', err);
        navigate('/writer/login');
      });
  }, [navigate]);

  const handleDelete = async (articleId) => {
    const token = localStorage.getItem('writerToken');
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const res = await fetch(`http://localhost:5002/api/articles/${articleId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setArticles((prev) => prev.filter((a) => a._id !== articleId));
          alert('Article deleted.');
        } else {
          const data = await res.json();
          alert(data.message || 'Delete failed.');
        }
      } catch (err) {
        console.error('Error deleting:', err);
        alert('Server error.');
      }
    }
  };

  const th = {
    textAlign: 'left',
    padding: '1rem',
    fontSize: '1rem',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
  };

  const td = {
    padding: '1rem',
    fontSize: '1rem',
    color: '#1a1a1a',
    borderBottom: '1px solid #f1f1f1',
  };

  const actionButton = {
    padding: '0.4rem 0.8rem',
    fontSize: '0.85rem',
    marginRight: '0.5rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  };

  const editButton = {
    ...actionButton,
    backgroundColor: '#0077cc',
    color: '#ffffff',
  };

  const deleteButton = {
    ...actionButton,
    backgroundColor: '#dc2626',
    color: '#ffffff',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9f9f7',
        padding: '2rem',
        fontFamily: "'Nunito Sans', sans-serif",
        marginTop: '5rem',
      }}
    >
      {currentWriter && (
        <>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
            Welcome back, {currentWriter.fullName?.split(' ')[0]} 👋
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{articles.length}</h2>
              <p>Total Articles</p>
            </div>
            <div
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <h2 style={{ fontSize: '2rem', margin: 0 }}>₹ {earnings}</h2>
              <p>Total Earnings</p>
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Earnings Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#2c2c2c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Link
            to="/writer/new-article"
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#2c2c2c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '2rem',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            ➕ Add New Article
          </Link>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
              Your Articles
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Title</th>
                  <th style={th}>Price</th>
                  <th style={th}>Unlocks</th>
                  <th style={th}>Earnings</th>
                  <th style={th}>Posted On</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <tr key={article._id}>
                      <td style={td}>{article.title}</td>
                      <td style={td}>
                        ₹ {article.price === '0' ? 'Free' : article.price}
                      </td>
                      <td style={td}>{article.unlockCount || 0}</td>
                      <td style={td}>₹ {article.articleEarnings || 0}</td>
                      <td style={td}>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td style={td}>
                        <button
                          style={editButton}
                          onClick={() => navigate(`/writer/edit-article/${article._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          style={deleteButton}
                          onClick={() => handleDelete(article._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={td} colSpan="6" align="center">
                      No articles posted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default WriterDashboard;
